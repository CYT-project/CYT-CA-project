# Continuous Deployment (Thiago)

This directory contains the **Integration & Deployment (CD)** part of the CYT-CA project.

## Responsibilities

- Integrate Yulia’s CI output with Ciara’s future AWS infrastructure.
- Define the deployment workflow from GitHub → AWS ECS.
- Prepare base files required for deployment (task definition, pipeline, scripts).
- Define health checks, observability hooks, and rollback strategy.

## Assumptions About Infrastructure (Ciara)

Ciara’s Terraform code will eventually provide:

- VPC, subnets, and networking
- ECS Cluster (Fargate)
- Load Balancer + Target Group
- IAM roles for ECS tasks and deployments
- ECR repository for storing Docker images

All these pieces are treated as **placeholders** for now.

## Assumptions About CI (Yulia)

Yulia’s CI workflow already:

- Builds backend, frontend, and microservice
- Runs tests
- Publishes a Docker image
- Uploads a CI artifact with metadata, such as:

```json
{
  "image": "123456789012.dkr.ecr.eu-west-1.amazonaws.com/app-repo:build-123"
}
```
---

## CI/CD Overview

This project uses a split responsibility model:

- **Yulia – CI (Continuous Integration)**: builds and tests the services, uploads artifacts.
- **Thiago – CD (Continuous Deployment)**: takes the CI outputs and deploys to AWS ECS.
- **Ciara – Infrastructure**: provides the AWS platform (VPC, ECS, LB, IAM, etc.) via Terraform.

The high-level flow is:

```mermaid
flowchart LR
    Dev[Developer pushes code] --> GitHub[GitHub repository]

    GitHub --> CI[CI Workflow (ci.yml)\nBuild + Test + Package]
    CI --> Artifacts[Docker image + image metadata\n(upload-artifact)]

    Artifacts --> CD[CD Workflow (cd.yml)\nECS deployment]
    CD --> AWS[AWS ECS Cluster\n(created by Terraform)]

    AWS --> Users[Application available to users]
