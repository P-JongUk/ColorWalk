param(
  [int]$Port = 4175
)

$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot
$outputDir = Join-Path $root 'output\playwright\core-funnel'
$fixture = Join-Path $root 'public\brand\hueday-mark-transparent.png'
$session = 'hueday-core-funnel'

New-Item -ItemType Directory -Force $outputDir | Out-Null
$env:VITE_E2E_LOCAL_ONLY = 'true'
$env:npm_config_cache = Join-Path $root '.npm-cache'
$env:TEMP = Join-Path $root '.tmp'
$env:TMP = Join-Path $root '.tmp'
New-Item -ItemType Directory -Force $env:TEMP | Out-Null

$server = Start-Process -FilePath 'npm.cmd' -ArgumentList @('run', 'dev', '--', '--host', '127.0.0.1', '--port', $Port) -WorkingDirectory $root -WindowStyle Hidden -PassThru
try {
  $url = "http://127.0.0.1:$Port"
  $deadline = (Get-Date).AddSeconds(45)
  do {
    try { Invoke-WebRequest -UseBasicParsing $url -TimeoutSec 2 | Out-Null; break } catch { Start-Sleep -Milliseconds 500 }
  } while ((Get-Date) -lt $deadline)
  if ((Get-Date) -ge $deadline) { throw "Vite E2E server did not respond at $url" }

  $code = @"
async page => {
  await page.setViewportSize({ width: 430, height: 932 });
  await page.goto('$url');
  await page.getByRole('button', { name: /start camera|촬영/i }).click();
  for (let index = 0; index < 8; index += 1) {
    await page.locator('input[type=file]').first().setInputFiles('$($fixture.Replace('\', '\\'))');
    await page.getByRole('button', { name: /use photo|이 사진 사용/i }).click();
  }
  await page.getByRole('button', { name: /write journal|저널 쓰기/i }).click();
  await page.getByRole('button', { name: /^save$|저장/i }).first().click();
  await page.screenshot({ path: '$((Join-Path $outputDir 'core-funnel-430x932.png').Replace('\', '\\'))' });
}
"@
  npx --offline --package @playwright/cli playwright-cli --session $session open $url
  npx --offline --package @playwright/cli playwright-cli --session $session run-code $code
} finally {
  npx --offline --package @playwright/cli playwright-cli --session $session close 2>$null
  Stop-Process -Id $server.Id -Force -ErrorAction SilentlyContinue
}
