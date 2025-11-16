# Terraform outputs for CIV2025 infrastructure
# These values can be used by other tools or referenced in CI/CD

output "vpc_id" {
  description = "ID of the created VPC"
  value       = module.vpc.vpc_id
}

output "frontend_url" {
  description = "URL of the frontend application"
  value       = module.ecs.frontend_url
}

output "node_service_url" {
  description = "URL of the Node.js service"
  value       = module.ecs.node_service_url
}

output "spring_service_url" {
  description = "URL of the Spring service"
  value       = module.ecs.spring_service_url
}

output "ecr_repositories" {
  description = "ECR repository URLs"
  value = {
    frontend = module.ecr.frontend_repository_url
    node     = module.ecr.node_repository_url
    spring   = module.ecr.spring_repository_url
  }
}