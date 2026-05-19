@echo off
setlocal
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0scripts\publish-steam-demo.ps1" %*
exit /b %ERRORLEVEL%
