# ECR Module for CIV2025
# Creates container registries for each microservice

resource "aws_ecr_repository" "frontend" {
  name                 = "${var.environment}-frontend"
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = true
  }

  tags = {
    Name        = "${var.environment}-frontend-repo"
    Environment = var.environment
    Project     = "civ2025"
    Service     = "frontend"
  }
}

resource "aws_ecr_repository" "node_service" {
  name                 = "${var.environment}-node-service"
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = true
  }

  tags = {
    Name        = "${var.environment}-node-service-repo"
    Environment = var.environment
    Project     = "civ2025"
    Service     = "node-service"
  }
}

resource "aws_ecr_repository" "spring_service" {
  name                 = "${var.environment}-spring-service"
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = true
  }

  tags = {
    Name        = "${var.environment}-spring-service-repo"
    Environment = var.environment
    Project     = "civ2025"
    Service     = "spring-service"
  }
}

# ECR lifecycle policy to keep only recent images
resource "aws_ecr_lifecycle_policy" "cleanup" {
  for_each = toset([
    aws_ecr_repository.frontend.name,
    aws_ecr_repository.node_service.name,
    aws_ecr_repository.spring_service.name
  ])

  repository = each.value

  policy = jsonencode({
    rules = [{
      rulePriority = 1
      description  = "Keep last 10 images"
      selection = {
        tagStatus   = "any"
        countType   = "imageCountMoreThan"
        countNumber = 10
      }
      action = {
        type = "expire"
      }
    }]
  })
}

# Module outputs
output "frontend_repository_url" {
  description = "Frontend ECR repository URL"
  value       = aws_ecr_repository.frontend.repository_url
}

output "node_repository_url" {
  description = "Node service ECR repository URL"
  value       = aws_ecr_repository.node_service.repository_url
}

output "spring_repository_url" {
  description = "Spring service ECR repository URL"
  value       = aws_ecr_repository.spring_service.repository_url
}