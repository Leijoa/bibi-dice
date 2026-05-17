@echo off
setlocal
set "PATH=%LOCALAPPDATA%\Programs\butler;%PATH%"
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0scripts\publish-itch.ps1" %*
exit /b %ERRORLEVEL%
