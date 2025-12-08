variable "aws_region" {
  description = "AWS region where the infrastructure will be created"
  type        = string
  default     = "eu-west-1"
}

variable "project_name" {
  description = "Project name used as prefix for AWS resources"
  type        = string
  default     = "cyt-ca"
}

variable "vpc_cidr" {
  description = "CIDR block for the VPC"
  type        = string
  default     = "10.0.0.0/16"
}

variable "public_subnet_cidrs" {
  description = "CIDR blocks for public subnets"
  type        = list(string)
  default     = ["10.0.1.0/24", "10.0.2.0/24"]
}

variable "private_subnet_cidrs" {
  description = "CIDR blocks for private subnets"
  type        = list(string)
  default     = ["10.0.11.0/24", "10.0.12.0/24"]
}

variable "ecs_task_definition_arn" {
  description = "Initial ECS task definition ARN (can be a placeholder, later updated by the CD pipeline)."
  type        = string
  default     = "arn:aws:ecs:eu-west-1:123456789012:task-definition/cyt-ca-placeholder"
}
