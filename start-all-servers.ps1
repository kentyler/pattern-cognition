# start-all-servers.ps1
# Starts both the Next.js web app and MCP server in separate windows

Write-Host "Starting Pattern Cognition Development Environment" -ForegroundColor Green
Write-Host ""

# Kill any processes on ports 3000 (Next.js) and 10000 (MCP Server)
Write-Host "Checking for processes on port 3000..." -ForegroundColor Yellow
$processesOn3000 = netstat -ano | Select-String ":3000" | ForEach-Object { ($_ -split "\s+")[5] } | Where-Object { $_ -ne "" -and $_ -ne "PID" } | Select-Object -Unique
if ($processesOn3000) {
    Write-Host "Found processes using port 3000 (Next.js): $processesOn3000" -ForegroundColor Red
    foreach ($processId in $processesOn3000) {
        Write-Host "Killing process with PID: $processId" -ForegroundColor Red
        taskkill /F /PID $processId
    }
} else {
    Write-Host "No processes found using port 3000" -ForegroundColor Green
}

# Kill any processes on port 10000 (MCP Server)
Write-Host "\nChecking for processes on port 10000..." -ForegroundColor Yellow
$processesOn10000 = netstat -ano | Select-String ":10000" | ForEach-Object { ($_ -split "\s+")[5] } | Where-Object { $_ -ne "" -and $_ -ne "PID" } | Select-Object -Unique
if ($processesOn10000) {
    Write-Host "Found processes using port 10000 (MCP Server): $processesOn10000" -ForegroundColor Red
    foreach ($processId in $processesOn10000) {
        Write-Host "Killing process with PID: $processId" -ForegroundColor Red
        taskkill /F /PID $processId
    }
} else {
    Write-Host "No processes found using port 10000" -ForegroundColor Green
}

# Give a moment for processes to fully terminate
Start-Sleep -Seconds 1

# Start the Next.js frontend in a new window
Write-Host "`nStarting Next.js frontend (localhost:3000)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$PSScriptRoot'; npm run dev" -WindowStyle Normal

# Start the MCP server in a new window
Write-Host "`nStarting MCP server..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location 'C:\Users\Ken\Desktop\pattern-cognition-mcp'; npm start" -WindowStyle Normal

Write-Host "`nServers are starting in separate windows!" -ForegroundColor Green
Write-Host "- Frontend Next.js server: http://localhost:3000" -ForegroundColor Green

# Wait a moment to give servers time to start
Write-Host "`nWaiting a few seconds for servers to initialize..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

# Open the frontend in Chrome
Write-Host "Opening web application in Chrome..." -ForegroundColor Cyan
Start-Process "chrome.exe" -ArgumentList "http://localhost:3000"

Write-Host "`nYou can close this window when both servers are running." -ForegroundColor Yellow
