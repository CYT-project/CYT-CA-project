# Terraform Backend Bootstrap

This directory contains the setup for Terraform remote state backend.

## Purpose

Creates the S3 bucket and DynamoDB table required for storing Terraform state remotely. This needs to be run **once** before using the main infrastructure code.

## Prerequisites

- AWS CLI configured with credentials (`aws configure`)
- Terraform installed

## Steps to Bootstrap

### 1. Create Backend Resources

```powershell
cd infra/bootstrap
terraform init
terraform apply
```

This creates:
- **S3 Bucket**: `cyt-ca-terraform-state` (for storing state files)
- **DynamoDB Table**: `cyt-ca-terraform-locks` (for state locking)

### 2. Migrate Existing State (if any)

If you already have local state in `../terraform.tfstate`:

```powershell
cd ..
terraform init -migrate-state
```

Type `yes` when prompted to migrate state to S3.

### 3. Verify

```powershell
terraform state list
```

## Important Notes

- **Run bootstrap only once** - the backend resources are shared
- **Don't delete** the S3 bucket or DynamoDB table - they contain critical state data
- The bootstrap itself uses **local state** (stored in `bootstrap/terraform.tfstate`)
- Keep the bootstrap state file safe

## GitHub Actions Access

Ensure the AWS credentials in GitHub Secrets have permissions to:
- Read from the S3 bucket
- Read/write to the DynamoDB table

## Cleanup (Use with Caution)

To destroy backend resources (only if you're sure):

```powershell
cd infra/bootstrap
terraform destroy
```

⚠️ **WARNING**: This will delete all Terraform state history!
