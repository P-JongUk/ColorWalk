param(
  [int]$Port = 4175
)

$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot
$outputDir = Join-Path $root 'output\playwright\core-funnel'
$screenshotPath = Join-Path $outputDir 'core-funnel-430x932.png'
$session = 'hueday-core-funnel'
$vite = Join-Path $root 'node_modules\vite\bin\vite.js'
$node = (Get-Command node).Source
$runner = Join-Path $root 'scripts\e2e-core-funnel.mjs'

New-Item -ItemType Directory -Force $outputDir | Out-Null
$env:VITE_E2E_LOCAL_ONLY = 'true'
$env:npm_config_cache = Join-Path $root '.npm-cache'
$env:TEMP = Join-Path $root '.tmp'
$env:TMP = Join-Path $root '.tmp'
New-Item -ItemType Directory -Force $env:TEMP | Out-Null

if (Get-NetTCPConnection -State Listen -LocalPort $Port -ErrorAction SilentlyContinue) {
  throw "E2E 포트 $Port 가 이미 사용 중입니다. 비어 있는 포트로 -Port 를 지정하세요."
}

& npm.cmd run build
if ($LASTEXITCODE -ne 0) { throw 'Production build failed before E2E.' }

$server = Start-Process -FilePath $node -ArgumentList @($vite, 'preview', '--host', '127.0.0.1', '--port', $Port, '--strictPort') -WorkingDirectory $root -WindowStyle Hidden -PassThru
try {
  $startedAt = Get-Date
  $url = "http://127.0.0.1:$Port"
  $deadline = (Get-Date).AddSeconds(45)
  do {
    try { Invoke-WebRequest -UseBasicParsing $url -TimeoutSec 2 | Out-Null; break } catch { Start-Sleep -Milliseconds 500 }
  } while ((Get-Date) -lt $deadline)
  if ((Get-Date) -ge $deadline) { throw "Vite E2E server did not respond at $url" }

  npx --offline --package @playwright/cli playwright-cli --session $session open $url
  if ($LASTEXITCODE -ne 0) { throw "Playwright 브라우저 열기에 실패했습니다. exit=$LASTEXITCODE" }
  npx --offline --package @playwright/cli playwright-cli --session $session run-code --filename $runner
  if ($LASTEXITCODE -ne 0) { throw "핵심 퍼널 E2E 실행에 실패했습니다. exit=$LASTEXITCODE" }
  if (!(Test-Path -LiteralPath $screenshotPath) -or (Get-Item -LiteralPath $screenshotPath).LastWriteTime -lt $startedAt) {
    throw '핵심 퍼널 E2E가 현재 실행의 430x932 스크린샷을 만들지 못했습니다.'
  }
} finally {
  npx --offline --package @playwright/cli playwright-cli --session $session close 2>$null
  Stop-Process -Id $server.Id -Force -ErrorAction SilentlyContinue
}
