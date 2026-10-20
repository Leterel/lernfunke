@echo off
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
 echo Bitte Node.js 24 oder neuer installieren und erneut starten.
 pause
 exit /b 1
)
echo Lernfunke startet. Danach http://127.0.0.1:4178 im Browser oeffnen.
echo Zum Beenden Strg+C druecken. Dieses Fenster offen lassen.
node server.mjs
if errorlevel 1 pause
