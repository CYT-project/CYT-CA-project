# ECS Module for CIV2025
# Creates ECS cluster and services for microservices

resource "aws_ecs_cluster" "main" {
  name = "${var.environment}-cluster"

  tags = {
    Name        = "${var.environment}-ecs-cluster"
    Environment = var.environment
    Project     = "civ2025"
  }
}

resource "aws_ecs_task_definition" "frontend" {
  family                   = "${var.environment}-frontend"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = "256"
  memory                   = "512"
  execution_role_arn       = var.execution_role_arn

  container_definitions = jsonencode([
    {
      name  = "frontend"
      image = var.frontend_image
      portMappings = [
        {
          containerPort = 80
          hostPort      = 80
          protocol      = "tcp"
        }
      ]
      essential = true
    }
  ])

  tags = {
    Name        = "${var.environment}-frontend-task"
    Environment = var.environment
    Project     = "civ2025"
    Service     = "frontend"
  }
}

resource "aws_ecs_service" "frontend" {
  name            = "${var.environment}-frontend"
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.frontend.arn
  desired_count   = 1
  launch_type     = "FARGATE"

  network_configuration {
    subnets         = var.public_subnets
    security_groups = [aws_security_group.frontend.id]
    assign_public_ip = true
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.frontend.arn
    container_name   = "frontend"
    container_port   = 80
  }

  tags = {
    Name        = "${var.environment}-frontend-service"
    Environment = var.environment
    Project     = "civ2025"
    Service     = "frontend"
  }
}

# Security group for frontend
resource "aws_security_group" "frontend" {
  name_prefix = "${var.environment}-frontend-"
  vpc_id      = var.vpc_id

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name        = "${var.environment}-frontend-sg"
    Environment = var.environment
    Project     = "civ2025"
  }
}

# Load balancer for frontend
resource "aws_lb" "frontend" {
  name               = "${var.environment}-frontend-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.alb.id]
  subnets            = var.public_subnets

  tags = {
    Name        = "${var.environment}-frontend-alb"
    Environment = var.environment
    Project     = "civ2025"
  }
}

resource "aws_lb_target_group" "frontend" {
  name_prefix = "${var.environment}-fe-"
  port        = 80
  protocol    = "HTTP"
  vpc_id      = var.vpc_id
  target_type = "ip"

  health_check {
    enabled             = true
    healthy_threshold   = 2
    interval            = 30
    matcher             = "200"
    path                = "/health"
    port                = "traffic-port"
    protocol            = "HTTP"
    timeout             = 5
    unhealthy_threshold = 2
  }
}

resource "aws_lb_listener" "frontend" {
  load_balancer_arn = aws_lb.frontend.arn
  port              = "80"
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.frontend.arn
  }
}

resource "aws_security_group" "alb" {
  name_prefix = "${var.environment}-alb-"
  vpc_id      = var.vpc_id

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name        = "${var.environment}-alb-sg"
    Environment = var.environment
    Project     = "civ2025"
  }
}

# Module outputs
output "frontend_url" {
  description = "Frontend application URL"
  value       = aws_lb.frontend.dns_name
}

output "node_service_url" {
  description = "Node service URL (placeholder)"
  value       = "http://node-service.local"
}

output "spring_service_url" {
  description = "Spring service URL (placeholder)"
  value       = "http://spring-service.local"
}