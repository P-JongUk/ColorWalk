param(
    [Parameter(Mandatory = $true)]
    [ValidateSet('session-start', 'start', 'check', 'finish')]
    [string]$Mode,
    [string]$Question = '',
    [string]$Title = 'work-log',
    [string]$Scope = '',
    [string]$GraphifyFinding = '',
    [string]$Changes = '',
    [string]$Verification = '',
    [string]$Decision = '',
    [string]$Failure = '',
    [string]$Next = '',
    [string]$Documentation = '',
    [string]$Career = ''
)

$ErrorActionPreference = 'Stop'

$repo = (Resolve-Path (Join-Path $PSScriptRoot '..\..\..\..')).Path
$memory = Join-Path $repo 'docs\ai-memory'
$graphify = Join-Path $repo '.graphify-venv\Scripts\graphify.exe'
$graph = Join-Path $repo 'graphify-out\graph.json'
$roadmap = Join-Path $repo 'docs\hueday-development-roadmap.md'

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

function Write-RoadmapSnapshot {
    param(
        [string]$Path,
        [string]$Label
    )

    if (-not (Test-Path $Path)) {
        Write-Warning "$Label roadmap missing: $Path"
        return
    }

    $lines = Get-Content -Encoding UTF8 -LiteralPath $Path
    $phase = $lines | Where-Object { $_ -match '^- (마스터 단계|현재 단계):' } | Select-Object -First 1
    $next = $lines | Where-Object { $_ -match '^- 다음 한 작업:' } | Select-Object -First 1

    Write-Host "$Label roadmap" -ForegroundColor Cyan
    if ($phase) { Write-Host "  $phase" }
    if ($next) { Write-Host "  $next" }
}

function Get-RoutedReferences {
    param([string]$Text)

    $references = @(
        'AGENTS.md',
        'docs/hueday-product-blueprint.md',
        'docs/hueday-development-roadmap.md',
        'docs/development-reference-guide.md',
        'docs/ai-model-selection-guide.md',
        'docs/ai-memory/00-current-state.md',
        'docs/ai-memory/01-decisions.md',
        'docs/ai-memory/02-next-tasks.md'
    )

    $query = $Text.ToLowerInvariant()

    if ($query -match 'hue.?room|색방|가구|room') {
        $references += @('docs/hue-room-product-spec.md', 'docs/hue-room-development-roadmap.md', 'docs/colorwalk-reward-system.md', 'docs/design-qa-log.md')
    }
    if ($query -match 'hue.?canvas|canvas|팔레트|palette|유리|glass|도안|타일|발견.?색|리믹스|remix') {
        $references += @('docs/hue-canvas-product-spec.md', 'docs/discovered-color-content-strategy.md', 'docs/data-storage-sync-and-cost-strategy.md', 'docs/colorwalk-reward-system.md', 'docs/design-reference-index.md', 'docs/design-qa-log.md')
    }
    if ($query -match '미션|카메라|촬영|3x3|격자|1컷|8컷|color.?hunt|capture|camera') {
        $references += @('docs/hueday-breakout-strategy.md', 'docs/colorwalk-reward-system.md', 'docs/discovered-color-content-strategy.md')
    }
    if ($query -match '보상|배지|리듬|연속|레벨|해금|reward|badge|streak') {
        $references += @('docs/colorwalk-reward-system.md', 'docs/hue-canvas-product-spec.md', 'docs/product-growth-strategy.md')
    }
    if ($query -match '팩|성장|리텐션|relay|hueprint|capsule|친구|공유|growth|mission.?pack|recap') {
        $references += @('docs/hueday-breakout-strategy.md', 'docs/product-growth-strategy.md', 'docs/colorwalk-reward-system.md')
    }
    if ($query -match '스토리|스티커|템플릿|share|story|sticker|template') {
        $references += @('docs/product-growth-strategy.md', 'docs/colorwalk-reward-system.md', 'docs/release-readiness.md', 'docs/design-qa-log.md')
    }
    if ($query -match '디자인|css|반응형|접근성|visual|design|responsive|accessibility') {
        $references += @('docs/design-reference-index.md', 'docs/design-qa-log.md')
    }
    if ($query -match 'supabase|auth|rls|storage|migration|보안|인증|db|database|저장|동기화|백업|복구|archive|sync|backup|압축|화질|비용') {
        $references += @('docs/data-storage-sync-and-cost-strategy.md', 'docs/security-audit.md', 'docs/release-readiness.md')
    }
    if ($query -match 'android|pwa|카메라 권한|알림|emulator|capacitor') {
        $references += @('docs/android-local-environment.md', 'docs/release-readiness.md')
    }
    if ($query -match '배포|출시|스토어|플레이|ios|app.?store|play.?store|release|deploy') {
        $references += @('docs/release-readiness.md', 'docs/play-store-internal-testing.md', 'docs/hueday-breakout-strategy.md', 'plan.md')
    }
    if ($query -match '수익|결제|구독|유료|monetization|payment|subscription') {
        $references += @('docs/product-growth-strategy.md', 'docs/colorwalk-reward-system.md')
    }

    return $references | Select-Object -Unique
}

function Write-RoutedReferences {
    param([string]$Text)

    Write-Host 'Read before work:' -ForegroundColor Yellow
    foreach ($path in (Get-RoutedReferences -Text $Text)) {
        Write-Host "  - $path"
    }
}

function Test-DocumentationContract {
    $required = @(
        'AGENTS.md',
        'docs/hueday-product-blueprint.md',
        'docs/hueday-development-roadmap.md',
        'docs/development-reference-guide.md',
        'docs/hue-canvas-product-spec.md',
        'docs/data-storage-sync-and-cost-strategy.md',
        'docs/design-reference-index.md',
        'docs/discovered-color-content-strategy.md',
        'docs/hue-room-product-spec.md',
        'docs/hue-room-development-roadmap.md',
        'docs/hueday-breakout-strategy.md',
        'docs/product-growth-strategy.md',
        'docs/colorwalk-reward-system.md',
        'docs/ai-memory/00-current-state.md',
        'docs/ai-memory/01-decisions.md',
        'docs/ai-memory/02-next-tasks.md'
    )

    $missing = @($required | Where-Object { -not (Test-Path (Join-Path $repo $_)) })
    if ($missing.Count -gt 0) {
        foreach ($path in $missing) { Write-Warning "Required document missing: $path" }
        return $false
    }

    $masterText = Get-Content -Raw -Encoding UTF8 -LiteralPath $roadmap
    if ($masterText -notmatch '마스터 단계:' -or $masterText -notmatch '다음 한 작업:') {
        Write-Warning 'Master roadmap must contain both current master phase and next action.'
        return $false
    }

    $changed = @(git -C $repo status --porcelain)
    $changedText = $changed -join "`n"
    $codeChanged = $changedText -match '(src/|src\\|supabase/|supabase\\|package\.json|vite\.config)'
    if ($codeChanged -and $changedText -notmatch 'docs[\\/]ai-memory') {
        Write-Warning 'Code changed but docs/ai-memory has no visible update yet.'
    }
    if ($changedText -match '(HueRoom|hue-room|src[\\/]lib[\\/]room|room_states)' -and $changedText -notmatch 'docs[\\/]hue-room-development-roadmap\.md') {
        Write-Warning 'Hue Room implementation changed but its roadmap has no visible update.'
    }
    if ($changedText -match '(HueCanvas|hue-canvas|hueCanvas|canvas_recipe)' -and $changedText -notmatch 'docs[\\/](hue-canvas-product-spec|discovered-color-content-strategy)\.md') {
        Write-Warning 'Hue Canvas implementation changed; confirm its product spec and strategy impact.'
    }
    if ($changedText -match '(CameraView|TodayView|GridCollage|Story|ProfileView|collection\.ts|mission\.ts)' -and $changedText -notmatch 'docs[\\/]colorwalk-reward-system\.md') {
        Write-Warning 'Capture/story/profile/reward-related code changed; confirm reward documentation impact.'
    }
    if ($changedText -match 'supabase[\\/]migrations' -and $changedText -notmatch 'docs[\\/](security-audit|release-readiness)\.md') {
        Write-Warning 'A database migration changed; confirm security and release documentation impact.'
    }

    Write-Host 'Documentation contract: required files and roadmap markers are present.' -ForegroundColor Green
    return $true
}

if ($Mode -eq 'session-start') {
    Write-WorkflowHeader
    Write-Host 'Checklist: current agent only -> roadmap/docs -> Graphify map -> scope/success conditions -> smallest safe change -> verify -> documentation/career impact -> Obsidian note.' -ForegroundColor Yellow
    Write-RoadmapSnapshot -Path $roadmap -Label 'Hueday master'
    Write-Host ''
    Write-RoutedReferences -Text ''
    if (Test-Path $graph) {
        Write-Host 'Graphify graph: ready (expand against graph vocabulary, then use query/path/explain before broad source reads).' -ForegroundColor Green
    } else {
        Write-Host 'Graphify graph: missing (run graphify extract . --code-only once).' -ForegroundColor Yellow
    }
    exit 0
}

if ($Mode -eq 'start') {
    Write-WorkflowHeader
    Write-Host 'Before coding:' -ForegroundColor Yellow
    Write-Host '  1. Keep all work in the current agent; do not create subagents.'
    Write-Host '  2. Confirm the current roadmap phase and routed source documents.'
    Write-Host '  3. Ask one focused Graphify question.'
    Write-Host '  4. Write scope, likely files, success conditions, and smallest safe change.'
    Write-Host '  5. Check existing helpers/dependencies before adding code or packages.'
    Write-Host ''
    Write-RoadmapSnapshot -Path $roadmap -Label 'Hueday master'
    Write-RoutedReferences -Text $Question
    if ($Question -and (Test-Path $graph) -and (Test-Path $graphify)) {
        Write-Host "`nGraphify is ready. Expand the question against graph vocabulary, then query the focused subgraph: $Question" -ForegroundColor Cyan
    }
    exit 0
}

if ($Mode -eq 'check') {
    Write-WorkflowHeader
    if (Test-DocumentationContract) { exit 0 }
    exit 1
}

New-Item -ItemType Directory -Force (Join-Path $memory 'sessions') | Out-Null
$stamp = Get-Date -Format 'yyyy-MM-dd-HHmm'
$slug = ($Title.ToLowerInvariant() -replace '[^\p{L}\p{Nd}]+', '-') -replace '(^-|-$)', ''
if (-not $slug) { $slug = 'session' }
$notePath = Join-Path $memory "sessions\$stamp-$slug.md"
$changedFiles = @(git -C $repo status --short)
$changedFileSummary = if ($changedFiles.Count -gt 0) { $changedFiles -join "`n" } else { '(no working-tree changes at finish)' }
$scopeText = if ($Scope) { $Scope } else { '(실제 범위와 성공 조건을 작성하세요.)' }
$graphifyText = if ($GraphifyFinding) { $GraphifyFinding } else { '(질의한 노드와 확인한 의존 관계를 작성하세요.)' }
$changesText = if ($Changes) { $Changes } else { '(실제 변경 내용을 작성하세요.)' }
$documentationImpact = if ($Documentation) { $Documentation } else { '(미기입) 실제 diff를 기준으로 기준 문서 영향을 확인하세요.' }
$careerImpact = if ($Career) { $Career } else { '(미기입) 문제해결 기록 갱신 여부와 이유를 확인하세요.' }
$content = @"
# Session record - $stamp - $Title

## Goal

$Title

## Scope and success conditions

$scopeText

## Graphify findings

$graphifyText

## Decision

$Decision

## Changes

$changesText

## Changed files at finish

~~~text
$changedFileSummary
~~~

## Verification

$Verification

## Failed or deferred approaches

$Failure

## Documentation impact

$documentationImpact

## Career evidence impact

$careerImpact

## Next tasks

$Next
"@
Set-Content -LiteralPath $notePath -Value $content -Encoding UTF8

if (-not $Documentation -or -not $Career) {
    Write-Warning 'Documentation or career impact was omitted. Complete both sections before committing.'
}

if (-not (Test-DocumentationContract)) {
    throw 'Documentation contract failed.'
}

if (Test-Path $graphify) {
    & $graphify update .
    if ($LASTEXITCODE -ne 0) {
        throw "Graphify update failed with exit code $LASTEXITCODE."
    }
}

Write-WorkflowHeader
Write-Host "Session note created: $notePath" -ForegroundColor Green
Write-Host 'Before commit: complete every note section, resolve documentation/career-log impact, run relevant checks, and review git diff.' -ForegroundColor Yellow
git status --short
