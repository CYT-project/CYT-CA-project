# Terraform configuration for CIV2025 infrastructure
# This demonstrates Infrastructure as Code for deploying microservices to AWS

terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  # In production, use a remote backend like S3
  backend "local" {
    path = "terraform.tfstate"
  }
}

# Configure AWS provider
provider "aws" {
  region = var.aws_region

  # In production, use proper authentication methods
  # profile = var.aws_profile
}

# VPC Module - creates networking infrastructure
module "vpc" {
  source = "./modules/vpc"

  environment = var.environment
  vpc_cidr    = var.vpc_cidr
}

# ECR Module - creates container registries
module "ecr" {
  source = "./modules/ecr"

  environment = var.environment
}

# ECS Module - creates container orchestration
module "ecs" {
  source = "./modules/ecs"

  environment       = var.environment
  vpc_id           = module.vpc.vpc_id
  public_subnets   = module.vpc.public_subnets
  execution_role_arn = module.iam.ecs_execution_role_arn

  # Container images from ECR
  frontend_image  = module.ecr.frontend_repository_url
  node_image     = module.ecr.node_repository_url
  spring_image   = module.ecr.spring_repository_url
}

# IAM Module - creates necessary permissions
module "iam" {
  source = "./modules/iam"

  environment = var.environment
}