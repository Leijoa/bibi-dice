param(
    [string]$Source = "D:\unity\bibi-dice",
    [string]$UploadDir = "D:\unity\bibi-dice_UP",
    [string]$Target = "leijoa/bibi-dice:html"
)

$ErrorActionPreference = "Stop"

$butlerDir = Join-Path $env:LocalAppData "Programs\butler"
$env:Path = "$butlerDir;$env:Path"

$butler = Get-Command butler -ErrorAction SilentlyContinue
if (-not $butler) {
    throw "butler not found. Try: `$env:Path = `"$butlerDir;`$env:Path`""
}

if (-not (Test-Path (Join-Path $Source "index.html"))) {
    throw "Source folder is missing index.html: $Source"
}

New-Item -ItemType Directory -Force -Path $UploadDir | Out-Null

Write-Host "Sync upload folder..." -ForegroundColor Cyan
$excludeDirs = @(".git", ".claude", "node_modules", "scripts")
$excludeFiles = @(".gitignore", "AGENTS.md", "GDD.md", "CHANGELOG.md", "alldamege.csv")

$robocopyArgs = @(
    $Source,
    $UploadDir,
    "/MIR",
    "/XD"
) + $excludeDirs + @(
    "/XF"
) + $excludeFiles + @(
    "/NFL",
    "/NDL",
    "/NJH",
    "/NJS",
    "/NP"
)

& robocopy @robocopyArgs
$robocopyExitCode = $LASTEXITCODE
if ($robocopyExitCode -ge 8) {
    throw "robocopy failed. ExitCode=$robocopyExitCode"
}

if (-not (Test-Path (Join-Path $UploadDir "index.html"))) {
    throw "Upload folder is missing index.html after sync: $UploadDir"
}

Write-Host "Push to itch.io: $Target" -ForegroundColor Cyan
& butler push $UploadDir $Target
if ($LASTEXITCODE -ne 0) {
    throw "butler push failed. ExitCode=$LASTEXITCODE"
}

Write-Host "Done. Check status with:" -ForegroundColor Green
Write-Host "butler status $Target"
