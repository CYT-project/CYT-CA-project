variable "environment" {
  description = "Environment name"
  type        = string
}

variable "vpc_id" {
  description = "VPC ID"
  type        = string
}

variable "public_subnets" {
  description = "Public subnet IDs"
  type        = list(string)
}

variable "frontend_image" {
  description = "Frontend container image URL"
  type        = string
}

variable "node_image" {
  description = "Node service container image URL"
  type        = string
}

variable "spring_image" {
  description = "Spring service container image URL"
  type        = string
}

variable "execution_role_arn" {
  description = "ECS execution role ARN"
  type        = string
  default     = null
}