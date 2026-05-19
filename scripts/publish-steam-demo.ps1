param(
    [string]$Source = "D:\unity\bibi-dice",
    [string]$OutputDir = ""
)

$ErrorActionPreference = "Stop"

if ([string]::IsNullOrWhiteSpace($OutputDir)) {
    $OutputDir = Join-Path $Source "dist\steam-demo"
}

if (-not (Test-Path (Join-Path $Source "index.html"))) {
    throw "Source folder is missing index.html: $Source"
}

New-Item -ItemType Directory -Force -Path $OutputDir | Out-Null

Write-Host "Build Steam Demo folder..." -ForegroundColor Cyan
Write-Host "Source: $Source"
Write-Host "Output: $OutputDir"

$excludeDirs = @(".git", ".claude", "node_modules", "scripts", "promo", "dist")
$excludeFiles = @(".gitignore", "AGENTS.md", "GDD.md", "CHANGELOG.md", "alldamege.csv", "package.json", "package-lock.json", "publish-*.cmd")

$robocopyArgs = @(
    $Source,
    $OutputDir,
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
    $path = Join-Path $OutputDir $dirName
    if (Test-Path $path) {
        $resolvedOutputDir = [System.IO.Path]::GetFullPath($OutputDir).TrimEnd('\') + '\'
        $resolvedPath = [System.IO.Path]::GetFullPath($path)
        if (-not $resolvedPath.StartsWith($resolvedOutputDir, [System.StringComparison]::OrdinalIgnoreCase)) {
            throw "Refuse to clean path outside Steam Demo folder: $resolvedPath"
        }
        Remove-Item -LiteralPath $path -Recurse -Force
    }
}

foreach ($filePattern in $excludeFiles) {
    Get-ChildItem -LiteralPath $OutputDir -Filter $filePattern -File -ErrorAction SilentlyContinue |
        Remove-Item -Force
}

if (-not (Test-Path (Join-Path $OutputDir "index.html"))) {
    throw "Steam Demo folder is missing index.html after sync: $OutputDir"
}

$indexPath = Join-Path $OutputDir "index.html"
$utf8NoBom = New-Object System.Text.UTF8Encoding($false)
$indexHtml = [System.IO.File]::ReadAllText($indexPath, [System.Text.Encoding]::UTF8)
$indexHtml = $indexHtml -replace '\ssteam-layout\b', ''
if ($indexHtml -notmatch '\bsteam-portrait\b') {
    if ($indexHtml -match '<body\s+class="([^"]*)"') {
        $indexHtml = $indexHtml -replace '<body\s+class="([^"]*)"', '<body class="$1 steam-portrait"'
    } else {
        $indexHtml = $indexHtml -replace '<body', '<body class="steam-portrait"'
    }
}
[System.IO.File]::WriteAllText($indexPath, $indexHtml, $utf8NoBom)

$runtimeFiles = Get-ChildItem -LiteralPath $OutputDir -Recurse -Include *.html,*.css,*.js -File
$externalPatterns = @(
    '<script[^>]+src=["'']https?://',
    '<link[^>]+href=["'']https?://',
    '@import\s+url\(["'']?https?://',
    'url\(["'']?https?://',
    'fetch\(["'']https?://',
    'cdn\.tailwindcss\.com',
    'cdn\.jsdelivr\.net',
    'fonts\.googleapis\.com',
    'fonts\.gstatic\.com'
)
$externalHits = $runtimeFiles | Select-String -Pattern $externalPatterns -ErrorAction SilentlyContinue
if ($externalHits) {
    Write-Warning "Active external runtime references were detected:"
    $externalHits | ForEach-Object {
        Write-Warning ("{0}:{1}: {2}" -f $_.Path, $_.LineNumber, $_.Line.Trim())
    }
} else {
    Write-Host "Offline check passed: no active external runtime references detected." -ForegroundColor Green
}

Write-Host "Done. Steam Demo build folder is ready:" -ForegroundColor Green
Write-Host $OutputDir
