# ECR repository for application images
resource "aws_ecr_repository" "app" {
  name                 = "${var.project_name}-app-repo"
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = true
  }

  tags = {
    Name = "${var.project_name}-ecr-repo"
  }
}
