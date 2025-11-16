<#
.SYNOPSIS
  Smoke test local services for CIV2025-template.

.DESCRIPTION
  Requests common endpoints for frontend, node, spring, and nginx and prints
  results. Optionally saves responses to a directory.

.PARAMETER SaveDir
  Optional directory where response bodies will be saved.

Usage:
  pwsh .\scripts\smoke-test.ps1
  pwsh .\scripts\smoke-test.ps1 -SaveDir .\tmp\smoke
#>

[param(
  [string]$SaveDir
)]

$urls = @{
  Frontend = 'http://localhost:3001'
  NodeHealth = 'http://localhost:3000/health'
  NodeInfo = 'http://localhost:3000/api/info'
  SpringHealth = 'http://localhost:8080/actuator/health'
  Nginx = 'http://localhost'
}

$errors = 0

if ($SaveDir) {
  if (-not (Test-Path $SaveDir)) { New-Item -ItemType Directory -Path $SaveDir | Out-Null }
}

foreach ($k in $urls.Keys) {
  Write-Output "=== $k ($($urls[$k])) ==="
  try {
    if ($k -in @('Frontend','Nginx')) {
      $r = Invoke-WebRequest -Uri $urls[$k] -UseBasicParsing -TimeoutSec 10
      $content = $r.Content
      Write-Output "HTTP/$($r.StatusCode) $($r.StatusDescription)"
    } else {
      $r = Invoke-RestMethod -Uri $urls[$k] -TimeoutSec 10
      $content = $r | ConvertTo-Json -Depth 10
      Write-Output $content
    }
    if ($SaveDir) {
      $filename = Join-Path $SaveDir ("{0}.txt" -f $k)
      $content | Out-File -FilePath $filename -Encoding UTF8
      Write-Output "Saved response to $filename"
    }
  } catch {
    Write-Output "ERROR: $($_.Exception.Message)"
    $errors++
  }
  Write-Output ""
}

if ($errors -gt 0) {
  Write-Output "Smoke test failed: $errors errors"
  exit 1
}

Write-Output "All smoke tests passed."
exit 0
