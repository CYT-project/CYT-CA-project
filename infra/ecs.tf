# ECS Cluster for the CYT-CA application
resource "aws_ecs_cluster" "main" {
  name = "${var.project_name}-ecs-cluster"

  setting {
    name  = "containerInsights"
    value = "enabled"
  }

  tags = {
    Name = "${var.project_name}-ecs-cluster"
  }
}

# ECS Service (Fargate) - integrates with ALB and CD pipeline
resource "aws_ecs_service" "app" {
  name            = "${var.project_name}-ecs-service"
  cluster         = aws_ecs_cluster.main.id
  launch_type     = "FARGATE"
  desired_count   = 1
  task_definition = var.ecs_task_definition_arn

  network_configuration {
    subnets         = aws_subnet.private[*].id
    security_groups = [aws_security_group.ecs_service.id]
    assign_public_ip = false
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.app_tg.arn
    container_name   = "cyt-app-container"
    container_port   = 8080
  }

  deployment_minimum_healthy_percent = 50
  deployment_maximum_percent         = 200

  lifecycle {
    ignore_changes = [
      task_definition
    ]
  }

  tags = {
    Name = "${var.project_name}-ecs-service"
  }
}
