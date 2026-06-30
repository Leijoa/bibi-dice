param(
    [string]$Source = "D:\unity\bibi-dice",
    [string]$UploadDir = "",
    [string]$Target = "leijoa/bibi-dice:html"
)

$ErrorActionPreference = "Stop"

if ([string]::IsNullOrWhiteSpace($UploadDir)) {
    $UploadDir = Join-Path $Source "dist\itch"
}

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
$excludeDirs = @(".git", ".claude", "node_modules", "scripts", "promo", "dist")
$excludeFiles = @(".gitignore", "AGENTS.md", "GDD.md", "CHANGELOG.md", "alldamege.csv", "package.json", "package-lock.json", "publish-*.cmd")

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

foreach ($dirName in $excludeDirs) {
    $path = Join-Path $UploadDir $dirName
    if (Test-Path $path) {
        $resolvedUploadDir = [System.IO.Path]::GetFullPath($UploadDir).TrimEnd('\') + '\'
        $resolvedPath = [System.IO.Path]::GetFullPath($path)
        if (-not $resolvedPath.StartsWith($resolvedUploadDir, [System.StringComparison]::OrdinalIgnoreCase)) {
            throw "Refuse to clean path outside upload folder: $resolvedPath"
        }
        Remove-Item -LiteralPath $path -Recurse -Force
    }
}

foreach ($filePattern in $excludeFiles) {
    Get-ChildItem -LiteralPath $UploadDir -Filter $filePattern -File -ErrorAction SilentlyContinue |
        Remove-Item -Force
}

if (-not (Test-Path (Join-Path $UploadDir "index.html"))) {
    throw "Upload folder is missing index.html after sync: $UploadDir"
}

$indexPath = Join-Path $UploadDir "index.html"
$utf8NoBom = New-Object System.Text.UTF8Encoding($false)
$indexHtml = [System.IO.File]::ReadAllText($indexPath, [System.Text.Encoding]::UTF8)
if ($indexHtml -notmatch '\bitch-build\b') {
    if ($indexHtml -match '<body\s+class="([^"]*)"') {
        $indexHtml = $indexHtml -replace '<body\s+class="([^"]*)"', '<body class="$1 itch-build"'
    } else {
        $indexHtml = $indexHtml -replace '<body', '<body class="itch-build"'
    }
    [System.IO.File]::WriteAllText($indexPath, $indexHtml, $utf8NoBom)
    Write-Host "Injected itch-build class into index.html" -ForegroundColor Cyan
}

Write-Host "Push to itch.io: $Target" -ForegroundColor Cyan
& butler push $UploadDir $Target
if ($LASTEXITCODE -ne 0) {
    throw "butler push failed. ExitCode=$LASTEXITCODE"
}

Write-Host "Done. Check status with:" -ForegroundColor Green
Write-Host "butler status $Target"
