terraform {
  required_version = ">= 1.5.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

# Networking, ECS, ALB, ECR, IAM etc.
# are split into separate *.tf files in this directory:
# - networking.tf
# - ecs.tf
# - alb.tf
# - ecr.tf
# - iam.tf
# - outputs.tf

# This file acts as the Terraform entry point for the CYT-CA infrastructure.
