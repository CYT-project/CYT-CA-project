CD – Continuous Deployment Layer
Automated Deployment to AWS ECS Fargate

This directory contains all components related to the Continuous Deployment (CD) phase of the project.
The CD pipeline is responsible for deploying the validated application produced by the CI workflow into the AWS ECS Fargate environment.

The goal of this layer is to ensure repeatable, observable, and fully automated deployments with no manual steps required.

Overview

The CD workflow is triggered automatically when the CI workflow completes successfully.
It retrieves the final container image (already published to Amazon ECR) and deploys it to ECS by generating a new Task Definition and forcing a rolling update of the ECS Service.

CD does not build code, run tests, or produce artifacts.
Those responsibilities belong to the CI pipeline.

Architecture Responsibilities
What CD is responsible for:

-Generating a deployment-ready ECS Task Definition.
-Injecting the correct ECR image into the task template.
-Registering the new ECS Task Definition revision.
-Deploying the new revision to the ECS service.
-Waiting for the service to reach a stable state (ECS + ALB health checks).
-Running a final smoke test to validate the deployment.

What CD is not responsible for:
-Building or packaging code (CI handles this).
-Creating AWS infrastructure (Terraform by Ciara will handle it).
-Publishing images to ECR (done by CI or Infra workflow).

Integration With Other Team Members
With CI (Yulia)

The CD pipeline:
Is triggered by CI via workflow_run.

Expects CI to validate the application before deployment.

Deploys only validated images referenced through ECR_IMAGE.

This ensures a complete CI → CD delivery chain.

With Infra (Ciara)

CD depends on Terraform outputs such as:
ECS_CLUSTER_NAME
ECS_SERVICE_NAME
AWS_REGION
ECR_IMAGE
Networking resources (VPC, subnets, ALB)

For now, these values are provided as environment variables inside the workflow.
Once Terraform is ready, these placeholders will be replaced with real outputs.

Files in This Directory
1. ecs-taskdef-base.json

A base ECS Task Definition template that defines:

CPU & memory limits
Networking mode (awsvpc)
Log configuration (CloudWatch Logs)
Container port mappings
Placeholder container image (REPLACE_IMAGE_AT_DEPLOY)
This file is transformed by the CD pipeline during deployment.

2. GitHub Actions Deployment Pipeline (cd.yml)

Located in .github/workflows/cd.yml but documented here.

Key responsibilities:
Trigger on CI completion (workflow_run)
Allow manual deployments (workflow_dispatch)
Inject the final ECR image with jq
Register a new ECS Task Definition
Force a rolling update of the ECS Service
Wait for the service to stabilize
Execute a health check (curl against /health)

Deployment Flow (Step-by-Step)

Trigger
Automatic: CI completes successfully
Manual: GitHub Actions UI
Checkout repository
Authenticate to AWS
Using aws-actions/configure-aws-credentials.
Generate ECS Task Definition
jq replaces the placeholder image with the actual ECR_IMAGE
Output: ecs-taskdef.json
Register new ECS Task Definition revision
Update ECS Service
Forces a new rolling deployment
Wait for service stability
Ensures ECS + ALB health checks have passed
Smoke Test
Uses /health endpoint to confirm the deployment is healthy

Health & Observability

CloudWatch Logs capture application logs (/ecs/cyt-app)
ECS rolling deployments ensure zero downtime
ALB health checks block bad deployments automatically
Final smoke test validates service functionality after rollout

Secrets & Environment Variables
Required GitHub Secrets:
AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY

How to Trigger a Deployment Manually

You can manually deploy from GitHub:
Actions → CD – Deploy to ECS → Run workflow

Useful for:

Testing infrastructure changes
Rolling forward after fixes
Manual promotions between environments

Roadmap / Future Improvements

The CD layer is designed to be extendable. Proposed improvements include:
Multi-environment (dev/staging/prod) promotion
Automatic rollback on failed smoke test
Image tagging based on Git SHA / CI run ID
Terraform-to-GitHub Actions output integration

Summary

The contents of this directory implement the entire deployment logic of the project.
This CD layer connects the validated output from CI with the AWS ECS infrastructure, ensuring:

Automated deployments
Versioned task definitions
✔ Zero-downtime rollouts
✔ Health-validated releases
✔ Integration with future Terraform infrastructure
