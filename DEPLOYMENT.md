# Deployment Architecture Documentation

## Overview

This project uses a **GitOps CI/CD pipeline** to automatically build, containerize, and deploy a multi-component application to AWS ECS Fargate. The infrastructure is managed with Terraform, and deployments are triggered via GitHub Actions workflows.

---

## Infrastructure (`infra/`)

### `main.tf` (Single-File Infrastructure)

**Purpose**: Defines all AWS resources needed to run the application on ECS Fargate with an Application Load Balancer.

**Key Components**:

#### Networking (Lines 1-51)
- **VPC**: `10.0.0.0/16` CIDR block
- **Public Subnets**: Two subnets in different AZs (`10.0.1.0/24`, `10.0.2.0/24`)
- **Internet Gateway**: Enables public internet access
- **Route Table**: Routes traffic from subnets to the internet gateway
- **Security Groups**: 
  - ALB SG: Allows inbound HTTP (port 80) from anywhere
  - ECS SG: Allows inbound traffic from ALB on port 8080

#### Container Registry (Lines 53-62)
- **ECR Repository**: Stores Docker images with tag immutability enabled
- **Lifecycle Policy**: Keeps only the 5 most recent images to save storage costs

#### IAM Roles (Lines 64-143)
- **ECS Execution Role** (`ecs_execution`):
  - Used by ECS to pull images from ECR
  - Send logs to CloudWatch
  - Permissions: `AmazonECSTaskExecutionRolePolicy`
  
- **ECS Task Role** (`ecs_task`):
  - Assumed by the running container
  - Can be extended with permissions for S3, DynamoDB, etc.
  - Currently has basic ECS permissions

#### Load Balancer (Lines 145-176)
- **Application Load Balancer**: Internet-facing, distributes traffic to ECS tasks
- **Target Group**: Routes HTTP traffic to ECS tasks on port 8080
  - **Health Check**: `/health` endpoint (Spring Boot Actuator)
  - Interval: 120 seconds
  - Timeout: 60 seconds
  - Healthy threshold: 2 checks
  - Unhealthy threshold: 10 checks
- **Listener**: Forwards all HTTP (port 80) traffic to the target group

#### ECS Cluster & Service (Lines 178-219)
- **ECS Cluster**: Container orchestration cluster
- **CloudWatch Log Group**: Stores container logs, retained for 7 days
- **ECS Task Definition** (placeholder):
  - Fargate launch type
  - 256 CPU units, 512 MB memory
  - Defines container image (replaced during deployment)
  - Maps port 8080
  - CloudWatch logs configuration
  
- **ECS Service**:
  - Desired count: 1 task
  - Launch type: Fargate
  - Deployment config: Min 0%, Max 200% (allows rolling deployments)
  - Network: Public subnets with auto-assign public IP
  - Load balancer integration: Registers tasks with target group
  - **Ignore changes to task_definition**: Allows CD pipeline to update without Terraform drift

#### Terraform Backend (Lines 221-227)
- **S3 Backend**: Stores Terraform state remotely
  - Bucket: `cyt-ca-terraform-state`
  - Key: `prod/terraform.tfstate`
  - DynamoDB table: `cyt-ca-terraform-locks` (prevents concurrent modifications)
  - Region: `eu-west-1`

#### Outputs (Lines 229-256)
- `ecr_repository_url`: ECR image URL for Docker pushes
- `ecs_cluster_name`: Cluster name for deployments
- `ecs_service_name`: Service name for updates
- `alb_dns_name`: Public ALB URL to access the application
- `ecs_execution_role_arn`: IAM role ARN for task execution
- `ecs_task_role_arn`: IAM role ARN for running tasks

---

### `bootstrap/setup-backend.tf`

**Purpose**: One-time setup to create S3 bucket and DynamoDB table for Terraform remote state.

**Resources Created**:
- **S3 Bucket** (`cyt-ca-terraform-state`):
  - Versioning enabled (tracks state history)
  - Server-side encryption with AES256
  - Prevents accidental deletion
  
- **DynamoDB Table** (`cyt-ca-terraform-locks`):
  - Partition key: `LockID`
  - Prevents multiple Terraform runs from conflicting

**Usage**:
```powershell
cd infra/bootstrap
terraform init
terraform apply
```

Run this **once** before using the main infrastructure.

---

## CI/CD Workflows (`.github/workflows/`)

### Deployment Pipeline Overview

```
┌─────────────┐      ┌──────────────────┐      ┌─────────────┐
│   ci.yml    │ ───> │ build-images.yml │ ───> │   cd.yml    │
│  (Build)    │      │  (Containerize)  │      │  (Deploy)   │
└─────────────┘      └──────────────────┘      └─────────────┘
     │                       │                        │
     ├─ Backend JAR          ├─ Pull artifacts        ├─ Terraform outputs
     ├─ Frontend build       ├─ Build Docker image    ├─ Register task def
     └─ Node service         └─ Push to ECR           └─ Update ECS service
```

---

### `ci.yml` - Continuous Integration

**Trigger**: Push to `main` branch or pull requests

**Purpose**: Build all application components and upload as artifacts for later use.

**Jobs**:

#### 1. **Build Backend** (Spring Boot)
- Runs on: `ubuntu-latest`
- Java: OpenJDK 17
- Steps:
  1. Checkout code
  2. Set up Maven cache
  3. Build with Maven (`mvn clean package -DskipTests`)
  4. Upload `backend.jar` as artifact

#### 2. **Build Frontend** (React)
- Runs on: `ubuntu-latest`
- Node.js: 18.x
- Steps:
  1. Checkout code
  2. Install dependencies (`npm ci`)
  3. Build production bundle (`npm run build`)
  4. Upload `frontend-dist/` as artifact

#### 3. **Build Node Microservice**
- Runs on: `ubuntu-latest`
- Node.js: 18.x
- Steps:
  1. Checkout code
  2. Install dependencies (`npm ci`)
  3. Upload `node-service/` (source + node_modules) as artifact

**Artifacts Produced**:
- `backend-jar` → backend.jar
- `frontend-dist` → Static React files
- `node-service` → Node.js microservice

---

### `build-images.yml` - Docker Image Build

**Trigger**: After `ci.yml` completes successfully (`workflow_run`)

**Purpose**: Download build artifacts, package them into a single Docker image, and push to ECR.

**Key Steps**:

#### 1. **Terraform Setup**
- Installs Terraform (if not cached)
- Initializes with S3 backend
- **Purpose**: Get ECR repository URL from Terraform outputs

#### 2. **Download Artifacts**
- Uses `actions/download-artifact@v4` with `github-token`
- Downloads artifacts from the triggering `ci.yml` workflow
- Extracts:
  - `backend.jar` → `docker-build/backend.jar`
  - `frontend-dist/` → `docker-build/frontend-dist/`
  - `node-service/` → `docker-build/node-service/`

#### 3. **AWS Authentication**
- Configures AWS credentials from GitHub secrets
- Logs into ECR using `aws ecr get-login-password`

#### 4. **Build & Push Docker Image**
- Image tag: Git commit SHA (`${{ github.sha }}`)
- Builds image from `apps/backend-spring-boot/Dockerfile`
- Pushes to ECR repository

**Dockerfile Strategy** (Multi-Component):
- Base: `eclipse-temurin:17-jre`
- Installs Node.js 18
- Copies all three components:
  - `backend.jar` → `/app/app.jar`
  - `frontend-dist/` → `/app/static/`
  - `node-service/` → `/app/node-service/`
- Exposes port 8080
- Startup script runs both Spring Boot backend and Node.js service

---

### `cd.yml` - Continuous Deployment

**Trigger**: After `build-images.yml` completes successfully (`workflow_run`)

**Purpose**: Deploy the new Docker image to ECS Fargate.

**Environment Variables**:
- `AWS_REGION`: `eu-west-1`

**Key Steps**:

#### 1. **AWS Authentication**
- Configures AWS credentials from GitHub secrets:
  - `AWS_ACCESS_KEY_ID`
  - `AWS_SECRET_ACCESS_KEY`

#### 2. **Terraform Setup & Outputs**
- Installs Terraform
- Initializes with S3 backend
- Retrieves outputs:
  - `ecr_repository` → ECR URL
  - `ecs_cluster` → ECS cluster name
  - `ecs_service` → ECS service name
  - `alb_dns` → Load balancer DNS
  - `execution_role_arn` → IAM role for task execution
  - `task_role_arn` → IAM role for running containers

#### 3. **Prepare ECS Task Definition**
- Reads base template: `cd/ecs-taskdef-base.json`
- Uses `jq` to inject:
  - `IMAGE`: ECR URL with commit SHA tag
  - `EXEC_ROLE`: Execution role ARN
  - `TASK_ROLE`: Task role ARN
- Outputs: `cd/ecs-taskdef.json`

#### 4. **Register New Task Definition**
- Registers updated task definition with ECS
- Returns new task definition ARN

#### 5. **Update ECS Service**
- Updates service to use new task definition
- Forces new deployment (replaces running tasks)

#### 6. **Wait for Service Stability**
- `aws ecs wait services-stable`
- Polls every 15 seconds
- **Timeout**: 10 minutes
- Waits for:
  - Desired task count to be running
  - Tasks to pass health checks
  - Old tasks to drain

#### 7. **Smoke Test**
- Waits 10 seconds for service readiness
- Curls `/health` endpoint via ALB
- Fails deployment if health check returns non-200

---

## CD Configuration (`cd/`)

### `ecs-taskdef-base.json`

**Purpose**: Template for ECS task definition (JSON format).

**Key Fields**:
- `family`: Task definition family name
- `networkMode`: `awsvpc` (required for Fargate)
- `requiresCompatibilities`: `["FARGATE"]`
- `cpu`: `"256"` (0.25 vCPU)
- `memory`: `"512"` (512 MB)
- `executionRoleArn`: Placeholder replaced by CD workflow
- `taskRoleArn`: Placeholder replaced by CD workflow

**Container Definition**:
- `name`: Container name
- `image`: Placeholder replaced with ECR image URL + commit SHA
- `portMappings`: Port 8080 (HTTP)
- `logConfiguration`:
  - Driver: `awslogs`
  - Stream prefix: `ecs`
  - Log group: `/ecs/marketforge`
  - Region: `eu-west-1`

**During Deployment**:
The CD workflow uses `jq` to replace placeholders with actual values before registering with ECS.

---

## Deployment Flow (End-to-End)

### Step-by-Step Process

1. **Developer pushes to `main`**
   ```bash
   git push origin main
   ```

2. **CI Workflow Triggers** (`ci.yml`)
   - Builds backend JAR (Maven)
   - Builds frontend static files (npm)
   - Packages Node.js microservice
   - Uploads artifacts to GitHub

3. **Build-Images Workflow Triggers** (`build-images.yml`)
   - Downloads artifacts from CI run
   - Runs `terraform output` to get ECR URL
   - Builds unified Docker image with all components
   - Tags image with commit SHA
   - Pushes to ECR

4. **CD Workflow Triggers** (`cd.yml`)
   - Retrieves Terraform outputs (cluster, service, IAM roles)
   - Injects image URL + IAM role ARNs into task definition JSON
   - Registers new task definition with ECS
   - Updates ECS service to use new task definition
   - Forces new deployment (rolling update)
   - Waits for service stability (up to 10 minutes)
   - Runs health check via ALB (`/health` endpoint)

5. **AWS ECS Deployment**
   - ECS pulls new image from ECR
   - Starts new task(s) in Fargate
   - Registers new tasks with ALB target group
   - ALB health checks new tasks (`/health`, 120s interval)
   - Once healthy, routes traffic to new tasks
   - Drains old tasks

6. **Application Live**
   - Access via ALB DNS: `http://<alb-dns>/`
   - Frontend: Served as static files by Spring Boot
   - Backend API: Spring Boot on `/api/*`
   - Health check: `/health` (Spring Boot Actuator)

---

## Prerequisites

### One-Time Setup

1. **AWS Account**
   - Valid AWS credentials with permissions for:
     - ECS, ECR, VPC, ALB, IAM, CloudWatch Logs
   
2. **Terraform Backend Setup**
   ```powershell
   cd infra/bootstrap
   terraform init
   terraform apply
   ```

3. **GitHub Secrets**
   - Navigate to: Repository → Settings → Secrets and variables → Actions
   - Add secrets:
     - `AWS_ACCESS_KEY_ID`
     - `AWS_SECRET_ACCESS_KEY`

4. **Deploy Infrastructure**
   ```powershell
   cd infra
   terraform init
   terraform apply
   ```

5. **Trigger Pipeline**
   ```bash
   git push origin main
   ```

---

## Maintenance & Operations

### View Application
```powershell
cd infra
terraform output alb_dns_name
# Visit: http://<output-value>/
```

### View Logs
```bash
aws logs tail /ecs/marketforge --follow --region eu-west-1
```

### Manual Deployment
```bash
# Get outputs
cd infra
terraform output

# Deploy manually
aws ecs update-service \
  --cluster <cluster-name> \
  --service <service-name> \
  --force-new-deployment \
  --region eu-west-1
```

### Destroy Infrastructure
```powershell
cd infra
terraform destroy
```

**Warning**: This will delete all resources. ECR images will be deleted automatically due to `force_delete = true`.

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        GitHub Actions                        │
│  ┌──────────┐    ┌────────────────┐    ┌──────────────┐    │
│  │ ci.yml   │───>│ build-images   │───>│   cd.yml     │    │
│  │ (Build)  │    │ (Containerize) │    │  (Deploy)    │    │
│  └──────────┘    └────────────────┘    └──────┬───────┘    │
└─────────────────────────────────────────────────┼───────────┘
                                                  │
                                                  ▼
┌─────────────────────────────────────────────────────────────┐
│                          AWS Cloud                           │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Application Load Balancer (Public Internet)        │   │
│  │  http://<alb-dns>/                                   │   │
│  └────────────────────┬─────────────────────────────────┘   │
│                       │                                      │
│                       ▼                                      │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Target Group (Health: /health, Port: 8080)         │   │
│  └────────────────────┬─────────────────────────────────┘   │
│                       │                                      │
│                       ▼                                      │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  ECS Fargate Service (1 task, Rolling deployments)  │   │
│  │  ┌────────────────────────────────────────────────┐ │   │
│  │  │  Task (256 CPU, 512 MB)                        │ │   │
│  │  │  ┌──────────────────────────────────────────┐  │ │   │
│  │  │  │ Container (Port 8080)                    │  │ │   │
│  │  │  │ - Spring Boot Backend (Java 17)          │  │ │   │
│  │  │  │ - React Frontend (Static files)          │  │ │   │
│  │  │  │ - Node.js Microservice                   │  │ │   │
│  │  │  └──────────────────────────────────────────┘  │ │   │
│  │  └────────────────────────────────────────────────┘ │   │
│  └──────────────────────┬───────────────────────────────┘   │
│                         │                                    │
│                         ▼                                    │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  CloudWatch Logs (/ecs/marketforge)                 │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  ECR Repository (Docker images, tagged by commit)   │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                    Terraform State (S3)                      │
│  - Bucket: cyt-ca-terraform-state                           │
│  - Locks: DynamoDB (cyt-ca-terraform-locks)                 │
└─────────────────────────────────────────────────────────────┘
```

---

## Cost Optimization

**Current Configuration**:
- **ECS Fargate**: 1 task × 256 CPU × 512 MB = ~$5-10/month
- **ALB**: ~$16/month (fixed) + data transfer
- **ECR**: Minimal (only 5 images retained)
- **CloudWatch Logs**: 7-day retention, minimal cost
- **VPC**: No NAT Gateway (tasks in public subnets) = $0

**Estimated Monthly Cost**: **$20-30 USD**

---

## Security Considerations

1. **IAM Roles**: Least privilege principle
2. **Security Groups**: Only ALB accepts public traffic
3. **Secrets**: Managed via GitHub Secrets (never committed)
4. **ECR**: Tag immutability prevents image overwrites
5. **Logs**: Retained for 7 days for debugging

---

## Troubleshooting

### Deployment fails at "Wait for service stability"
- Check CloudWatch Logs: `/ecs/marketforge`
- Common issues:
  - Health check failing (verify `/health` endpoint)
  - Image pull errors (check ECR permissions)
  - Insufficient resources (CPU/memory limits)

### Health check fails
- Verify `/health` endpoint returns 200 OK
- Check security groups allow traffic on port 8080
- Ensure Spring Boot Actuator dependency is included

### Terraform state locked
```bash
# If Terraform crashes, manually unlock:
aws dynamodb delete-item \
  --table-name cyt-ca-terraform-locks \
  --key '{"LockID":{"S":"cyt-ca-terraform-state/prod/terraform.tfstate-md5"}}'
```

---

## Next Steps

- [ ] Add HTTPS support (ACM certificate + ALB listener)
- [ ] Add database (RDS PostgreSQL) when needed
- [ ] Implement auto-scaling based on CPU/memory
- [ ] Add Route53 custom domain
- [ ] Implement blue/green deployments
- [ ] Add monitoring/alerting (CloudWatch Alarms)
