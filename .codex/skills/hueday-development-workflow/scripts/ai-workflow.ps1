param(
    [Parameter(Mandatory = $true)]
    [ValidateSet('session-start', 'start', 'finish')]
    [string]$Mode,
    [string]$Question = '',
    [string]$Title = 'work-log',
    [string]$Verification = '',
    [string]$Decision = '',
    [string]$Failure = '',
    [string]$Next = ''
)

$repo = (Resolve-Path (Join-Path $PSScriptRoot '..\..\..\..')).Path
$memory = Join-Path $repo 'docs\ai-memory'
$graphify = Join-Path $repo '.graphify-venv\Scripts\graphify.exe'
$graph = Join-Path $repo 'graphify-out\graph.json'

$env:npm_config_cache = Join-Path $repo '.npm-cache'
$env:PIP_CACHE_DIR = Join-Path $repo '.pip-cache'
$env:UV_CACHE_DIR = Join-Path $repo '.uv-cache'
$env:TEMP = Join-Path $repo '.tmp'
$env:TMP = Join-Path $repo '.tmp'
$env:GRADLE_USER_HOME = 'D:\GradleCacheColorWalk'
$env:ANDROID_SDK_ROOT = 'D:\Android\Sdk'
$env:ANDROID_HOME = 'D:\Android\Sdk'
$env:ANDROID_AVD_HOME = 'D:\Android\Avd'
$env:XDG_DATA_HOME = Join-Path $repo '.vercel-local\data'
$env:XDG_CONFIG_HOME = Join-Path $repo '.vercel-local\config'
$env:VERCEL_TELEMETRY_DISABLED = '1'
$env:PLAYWRIGHT_BROWSERS_PATH = Join-Path $repo '.playwright-browsers'
New-Item -ItemType Directory -Force (Join-Path $repo '.tmp') | Out-Null

function Write-WorkflowHeader {
    Write-Host 'Hueday AI workflow' -ForegroundColor Cyan
    Write-Host "Repo: $repo"
    Write-Host "Memory: $memory"
    Write-Host "Graphify: $graph"
    Write-Host ''
}

if ($Mode -eq 'session-start') {
    Write-WorkflowHeader
    Write-Host 'Checklist: Graphify map -> scope/success conditions -> smallest safe change -> verify -> Obsidian note.' -ForegroundColor Yellow
    if (Test-Path $graph) {
        Write-Host 'Graphify graph: ready (use graphify query/path/explain before broad source reads).' -ForegroundColor Green
    } else {
        Write-Host 'Graphify graph: missing (run graphify extract . --code-only once).' -ForegroundColor Yellow
    }
    exit 0
}

if ($Mode -eq 'start') {
    Write-WorkflowHeader
    Write-Host 'Before coding:' -ForegroundColor Yellow
    Write-Host '  1. Ask one focused Graphify question.'
    Write-Host '  2. Write scope, likely files, success conditions, and smallest safe change.'
    Write-Host '  3. Check existing helpers/dependencies before adding code or packages.'
    if ($Question -and (Test-Path $graph) -and (Test-Path $graphify)) {
        Write-Host "`nGraphify answer for: $Question" -ForegroundColor Cyan
        & $graphify query $Question --budget 1200
    }
    exit 0
}

New-Item -ItemType Directory -Force (Join-Path $memory 'sessions') | Out-Null
$stamp = Get-Date -Format 'yyyy-MM-dd-HHmm'
$slug = ($Title.ToLowerInvariant() -replace '[^a-z0-9]+', '-') -replace '(^-|-$)', ''
if (-not $slug) { $slug = 'session' }
$notePath = Join-Path $memory "sessions\$stamp-$slug.md"
$content = @"
# Session record - $stamp - $Title

## Goal

$Title

## Scope and success conditions

- Scope: (fill in)
- Success conditions: (fill in)

## Graphify findings

- (fill in)

## Decision

$Decision

## Changes

- (fill in)

## Verification

$Verification

## Failed or deferred approaches

$Failure

## Next tasks

$Next
"@
Set-Content -LiteralPath $notePath -Value $content -Encoding UTF8

if (Test-Path $graphify) {
    & $graphify update .
}

Write-WorkflowHeader
Write-Host "Session note created: $notePath" -ForegroundColor Green
Write-Host 'Before commit: complete the note, update durable notes when needed, run relevant checks, and review git diff.' -ForegroundColor Yellow
git status --short
