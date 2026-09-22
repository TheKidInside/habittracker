@echo off
REM Deploy Patch to Firebase Hosting on project patch-ec17e.
REM Why: the app origin then equals authDomain (patch-ec17e.firebaseapp.com),
REM so Safari's cross-site storage partitioning stops breaking iOS sign-in.
setlocal
cd /d "%~dp0"

echo === Firebase login (a browser window will open if you are not signed in) ===
call firebase login
if errorlevel 1 goto :failed

echo.
echo === Deploying hosting ===
call firebase deploy --only hosting --project patch-ec17e
if errorlevel 1 goto :nosite

echo.
echo Done. Open https://patch-ec17e.firebaseapp.com on your iPhone and
echo Share -^> Add to Home Screen from THAT url (not the github.io one).
goto :end

:nosite
echo.
echo Deploy failed. If the error was "site not found", run this once:
echo     firebase hosting:sites:create patch-ec17e --project patch-ec17e
echo then run this script again.
goto :end

:failed
echo.
echo Login failed or was cancelled.

:end
echo.
pause
