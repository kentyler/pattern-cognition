# dev-start.ps1
# Starts both the Next.js web app and MCP server

Write-Host "Starting Pattern Cognition Development Environment" -ForegroundColor Green
Write-Host ""

# Install MCP dependencies
Write-Host "Installing MCP dependencies..." -ForegroundColor Yellow
npm run mcp:install

if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: MCP install failed" -ForegroundColor Red
    exit 1
}

Write-Host "SUCCESS: MCP dependencies installed" -ForegroundColor Green
Write-Host ""

# Start both servers in parallel
Write-Host "Starting Next.js web app (localhost:3000)..." -ForegroundColor Cyan
Write-Host "Starting MCP server..." -ForegroundColor Cyan
Write-Host ""
Write-Host "Press Ctrl+C to stop both servers" -ForegroundColor Yellow
Write-Host ""

# Start both processes in background jobs
$webJob = Start-Job -ScriptBlock { 
    Set-Location $using:PWD
    npm run dev 
}

$mcpJob = Start-Job -ScriptBlock { 
    Set-Location $using:PWD  
    npm run mcp:start
}

# Wait for jobs and display output
try {
    while ($webJob.State -eq "Running" -or $mcpJob.State -eq "Running") {
        # Get output from both jobs
        Receive-Job $webJob -Keep | ForEach-Object { Write-Host "[WEB] $_" -ForegroundColor Blue }
        Receive-Job $mcpJob -Keep | ForEach-Object { Write-Host "[MCP] $_" -ForegroundColor Magenta }
        Start-Sleep -Milliseconds 500
    }
} finally {
    # Clean up jobs when script ends
    Write-Host ""
    Write-Host "Stopping servers..." -ForegroundColor Yellow
    Stop-Job $webJob, $mcpJob -ErrorAction SilentlyContinue
    Remove-Job $webJob, $mcpJob -ErrorAction SilentlyContinue
    Write-Host "Servers stopped" -ForegroundColor Green
}