# MarketForge CI/CD Pipeline

Этот репозиторий содержит инфраструктуру и конфигурацию CI/CD для платформы MarketForge.

## Структура проекта

- `infrastructure/` - Инфраструктура как код (Terraform)
- `backend/` - Backend сервисы (Spring Boot)
- `frontend/` - Frontend приложение (React)
- `scripts/` - Вспомогательные скрипты
- `.gitlab-ci.yml` - Конфигурация GitLab CI/CD

## Требования

- Terraform >= 1.0
- AWS CLI
- Docker
- Java 17+
- Node.js 16+

## Начало работы

1. Клонируйте репозиторий:
   ```bash
   git clone <repository-url>
   cd CYT-CA-project
   ```

2. Настройте AWS учетные данные:
   ```bash
   aws configure
   ```

3. Инициализируйте Terraform:
   ```bash
   cd infrastructure/terraform
   terraform init
   ```

4. Примените конфигурацию:
   ```bash
   terraform apply
   ```

## Развертывание

Развертывание выполняется автоматически через GitLab CI/CD при пуше изменений в соответствующие ветки:

- `main` - продакшн среда
- `staging` - стейджинг среда
- `develop` - среда для разработки

## Лицензия

MIT
