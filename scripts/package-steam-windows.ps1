param(
    [string]$Source = "D:\unity\bibi-dice",
    [string]$OutputDir = "",
    [string]$AppExeName = "BIBI-DICE.exe"
)

$ErrorActionPreference = "Stop"

if ([string]::IsNullOrWhiteSpace($OutputDir)) {
    $OutputDir = Join-Path $Source "dist\steam-windows"
}

$sourceRoot = [System.IO.Path]::GetFullPath($Source)
$outputRoot = [System.IO.Path]::GetFullPath($OutputDir)
$distRoot = [System.IO.Path]::GetFullPath((Join-Path $sourceRoot "dist"))

if (-not $outputRoot.StartsWith($distRoot, [System.StringComparison]::OrdinalIgnoreCase)) {
    throw "Refuse to write Steam Windows build outside dist folder: $outputRoot"
}

$electronDist = Join-Path $sourceRoot "node_modules\electron\dist"
$steamDemo = Join-Path $sourceRoot "dist\steam-demo"
$steamApp = Join-Path $sourceRoot "steam-app"

if (-not (Test-Path (Join-Path $electronDist "electron.exe"))) {
    throw "Electron runtime is missing. Run npm install first: $electronDist"
}
if (-not (Test-Path (Join-Path $steamDemo "index.html"))) {
    throw "Steam demo folder is missing. Run npm.cmd run steam:build first: $steamDemo"
}
if (-not (Test-Path (Join-Path $steamApp "main.js"))) {
    throw "Steam app main process is missing: $steamApp"
}

if (Test-Path $outputRoot) {
    Remove-Item -LiteralPath $outputRoot -Recurse -Force
}

New-Item -ItemType Directory -Force -Path $outputRoot | Out-Null

Write-Host "Copy Electron runtime..." -ForegroundColor Cyan
Get-ChildItem -LiteralPath $electronDist -Force | ForEach-Object {
    Copy-Item -LiteralPath $_.FullName -Destination $outputRoot -Recurse -Force
}

$appRoot = Join-Path $outputRoot "resources\app"
New-Item -ItemType Directory -Force -Path $appRoot | Out-Null

Write-Host "Copy app package files..." -ForegroundColor Cyan
$packageJson = Get-Content -LiteralPath (Join-Path $sourceRoot "package.json") -Raw | ConvertFrom-Json
$packageJson.name = "bibi-dice"
$packageJson.productName = "BIBI DICE"
$packageJson | Add-Member -MemberType NoteProperty -Name "main" -Value "steam-app/main.js" -Force
$packageJsonText = $packageJson | ConvertTo-Json -Depth 10
$utf8NoBom = New-Object System.Text.UTF8Encoding($false)
[System.IO.File]::WriteAllText((Join-Path $appRoot "package.json"), $packageJsonText, $utf8NoBom)
Copy-Item -LiteralPath $steamApp -Destination (Join-Path $appRoot "steam-app") -Recurse -Force

$appDist = Join-Path $appRoot "dist"
New-Item -ItemType Directory -Force -Path $appDist | Out-Null
Copy-Item -LiteralPath $steamDemo -Destination (Join-Path $appDist "steam-demo") -Recurse -Force

$defaultApp = Join-Path $outputRoot "resources\default_app.asar"
if (Test-Path $defaultApp) {
    Remove-Item -LiteralPath $defaultApp -Force
}

$electronExe = Join-Path $outputRoot "electron.exe"
$targetExe = Join-Path $outputRoot $AppExeName
if (Test-Path $targetExe) {
    Remove-Item -LiteralPath $targetExe -Force
}
Move-Item -LiteralPath $electronExe -Destination $targetExe -Force

Write-Host "Done. Steam Windows build folder is ready:" -ForegroundColor Green
Write-Host $outputRoot
Write-Host "Entry exe:" -ForegroundColor Green
Write-Host $targetExe
