# Infrastructure Layer (Ciara)

This directory contains the **Infrastructure as Code (IaC)** layer for the CYT-CA project.  
The goal is to define the AWS platform that supports the application and integrates with the CI/CD pipelines.

## Responsibilities

- Provision the AWS network (VPC, subnets, routing).
- Create an ECS Fargate cluster to host the services.
- Create an ECR repository to store container images.
- Manage IAM roles and security policies for CI/CD and ECS tasks.
- Provide Terraform outputs that will be consumed by the CD workflow (Thiago).

## Infrastructure Components (Terraform)

### 1. Networking
- VPC
- Public and private subnets
- Internet gateway and route tables
- Security groups

### 2. Compute
- ECS Cluster (Fargate)
- ECS Task Execution Role
- ECS Task Role

### 3. Deployment Targets
- Application Load Balancer (ALB)
- Target Group
- Listener (HTTP/HTTPS)

### 4. Container Registry
- ECR repository for storing application images

### 5. Outputs for Integration
Terraform will expose values such as:

- `ecs_cluster_name`
- `ecs_service_name`
- `ecr_repository_url`
- `alb_dns_name`

These outputs will be used directly inside the **CD pipeline** implemented by Thiago.

## Status

Terraform code structure created.  
Placeholders included for future expansion.

