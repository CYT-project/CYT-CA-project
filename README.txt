# CIV2025 Microservices Template

A complete template for learning CI/CD with microservices architecture. This repository demonstrates modern DevOps practices including containerization, infrastructure as code, and automated deployment pipelines.

## 🏗️ Architecture

This template includes three microservices:

### Frontend Service (`apps/frontend/`)
- **Technology**: Next.js (React Framework)
- **Purpose**: Server-side rendered React application with API routes
- **Deployment**: Containerized with Docker, can be deployed to Vercel, Netlify, or cloud
- **CI/CD**: Automated testing, building, and deployment with SSR optimization

### Node.js Service (`apps/node-service/`)
- **Technology**: Node.js + Express
- **Purpose**: Backend API service
- **Deployment**: Containerized with Docker, orchestrated with ECS
- **CI/CD**: Automated testing, Docker build, and deployment

### Spring Service (`apps/spring-service/`)
- **Technology**: Java Spring Boot
- **Purpose**: Backend API service
- **Deployment**: Containerized with Docker, orchestrated with ECS
- **CI/CD**: Automated testing, Docker build, and deployment

## 🚀 Infrastructure

### Cloud Infrastructure (`infra/terraform/`)
- **VPC**: Isolated network with public/private subnets
- **ECS**: Container orchestration for microservices
- **ECR**: Container registry for Docker images
- **Load Balancers**: Application load balancers for services
- **IAM**: Least-privilege access control

### CI/CD Pipelines (`.github/workflows/`)
- **Automated Testing**: Unit tests for all services
- **Docker Builds**: Container image creation and registry pushes
- **Multi-Environment**: Staging and production deployments
- **Infrastructure**: Automated Terraform deployments

## 🛠️ Getting Started

### Prerequisites
- Node.js 18+
- Java 17+
- Docker
- AWS CLI (for cloud deployment)
- Terraform (for infrastructure)

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/sweeneyirl/CIV2025-template.git
   cd CIV2025-template
   ```

2. **Start the Node.js service**
   ```bash
   cd apps/node-service
   npm install
   npm run dev
   ```

3. **Start the Spring service**
   ```bash
   cd apps/spring-service
   mvn spring-boot:run
   ```

4. **Start the Next.js frontend**
   ```bash
   cd apps/frontend
   npm install
   npm run dev
   ```

### Docker Development

1. **Build all services**
   ```bash
   docker build -t node-service ./apps/node-service
   docker build -t spring-service ./apps/spring-service
   docker build -t frontend ./apps/frontend
   ```

2. **Run with Docker Compose** (if you create a compose file)
   ```bash
   docker-compose up
   ```

## 📋 CI/CD Learning Objectives

This template demonstrates:

- **Automated Testing**: Unit tests that run on every commit
- **Containerization**: Docker images for consistent deployments
- **Infrastructure as Code**: Terraform for reproducible infrastructure
- **Multi-Environment**: Separate staging and production deployments
- **Security**: Least-privilege IAM roles and secure secrets management
- **Monitoring**: Health checks and application metrics
- **Rollback**: Safe deployment practices with blue/green strategies

## 🔧 Configuration

### Environment Variables
- `NODE_ENV`: Environment (development/staging/production)
- `PORT`: Service port (default: 3000 for Node, 8080 for Spring)

### AWS Configuration
Set up these secrets in your GitHub repository:
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `AWS_REGION`

## 📚 Learning Path

1. **Understand the Architecture**: Review each service's code and Dockerfiles
2. **Run Locally**: Get all services running on your machine
3. **Explore CI/CD**: Push changes and watch the automated pipelines
4. **Deploy Infrastructure**: Use Terraform to create cloud resources
5. **Customize**: Add your own features and modify the architecture

## 🤝 Contributing

This is a learning template. Feel free to:
- Add new microservices
- Implement additional CI/CD features
- Add monitoring and logging
- Create deployment strategies

## 📄 License

This template is for educational purposes.
