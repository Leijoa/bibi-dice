<#
.SYNOPSIS
  韻西（Codex）呼叫阿扣（Claude Code）的標準腳本。

.DESCRIPTION
  統一封裝呼叫參數，避免每次手打踩雷：
  - 非互動模式（-p）＋ 不留 session（--no-session-persistence）
  - 預算上限預設 US$5.00（AGENTS.md 第 5 節規範，未經製作人同意不得調高）
  - 權限模式預設 plan（唯讀審查／交叉驗收用）；實作任務經製作人核准後可改 acceptEdits
  - 輸出自動存檔到 tmp/，並偵測 session limit／workspace trust／401 三種既知失敗原因

.EXAMPLE
  powershell -NoProfile -ExecutionPolicy Bypass -File scripts/call-claude-review.ps1 -PromptFile docs/ai-collaboration/tasks/xxx/TASK_BRIEF.md

.EXAMPLE
  powershell -NoProfile -ExecutionPolicy Bypass -File scripts/call-claude-review.ps1 -Prompt "唯讀交叉驗收：請核對 js/engine.js 的弒神枷鎖結算與 SYNC.md 紀錄是否一致，只回報結論。"

.NOTES
  workspace trust 提示只需製作人在 D:\unity\bibi-dice 互動執行一次 claude 並接受信任，即可永久解決。
  session limit 時輸出會含重置時間；B/C 級任務依製作人授權（2026-07-10、07-11）由韻西先獨力完成並記入 SYNC.md。
#>
param(
  [string]$PromptFile,
  [string]$Prompt,
  [string]$OutFile,
  [double]$MaxBudgetUsd = 5.00,
  [ValidateSet('plan', 'default', 'acceptEdits')]
  [string]$Mode = 'plan'
)

$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot

if (-not $Prompt) {
  if (-not $PromptFile) {
    Write-Host '錯誤：需要 -PromptFile 或 -Prompt 其中之一。'
    exit 2
  }
  if (-not (Test-Path $PromptFile)) {
    Write-Host "錯誤：找不到提示檔：$PromptFile"
    exit 2
  }
  $resolved = (Resolve-Path $PromptFile).Path
  $Prompt = [System.IO.File]::ReadAllText($resolved, [System.Text.Encoding]::UTF8)
}

if (-not $OutFile) {
  $stamp = Get-Date -Format 'yyyyMMdd-HHmmss'
  $tmpDir = Join-Path $root 'tmp'
  if (-not (Test-Path $tmpDir)) { New-Item -ItemType Directory -Path $tmpDir | Out-Null }
  $OutFile = Join-Path $tmpDir "claude-review-$stamp.md"
}

$claude = Get-Command claude.exe -ErrorAction SilentlyContinue
if (-not $claude) { $claude = Get-Command claude -ErrorAction SilentlyContinue }
if (-not $claude) {
  Write-Host '錯誤：找不到 claude.exe，請確認 Claude Code CLI 已安裝並在 PATH。'
  exit 3
}

Write-Host "呼叫阿扣（模式 $Mode、預算 USD $MaxBudgetUsd）..."
$output = & $claude.Source -p $Prompt --permission-mode $Mode --max-budget-usd $MaxBudgetUsd --no-session-persistence
$code = $LASTEXITCODE
$text = ($output | Out-String)

$utf8NoBom = New-Object System.Text.UTF8Encoding($false)
[System.IO.File]::WriteAllText($OutFile, $text, $utf8NoBom)
Write-Host "輸出已存：$OutFile（exit code $code）"

if ($text -match 'session limit' -or $text -match "hit your .*limit") {
  Write-Warning '阿扣 session limit：輸出內容含重置時間。B/C 級任務依製作人授權由韻西先獨力完成，並在 SYNC.md 記錄原因。'
}
if ($text -match 'trust' -and ($text -match 'workspace' -or $text -match 'folder')) {
  Write-Warning 'workspace trust 未接受：請製作人在專案目錄互動執行一次 claude 並接受信任（一次即可永久解決）。'
}
if ($text -match '401' -and $text -match 'authentication') {
  Write-Warning '認證失效（401）：請製作人重新登入 claude（/login）後重試。'
}

exit $code
