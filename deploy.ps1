# Briefly Auto-Deploy Script
# This script automates deployment to Render using API calls

$ErrorActionPreference = "Stop"

Write-Host "🚀 Briefly Auto-Deploy Script" -ForegroundColor Cyan
Write-Host "==============================" -ForegroundColor Cyan

# Configuration
$repoOwner = "Itslouisbaby"
$repoName = "Briefly"
$githubToken = $env:GITHUB_TOKEN

# Step 1: Check if GitHub repo exists
Write-Host "`n📋 Checking GitHub repository..." -ForegroundColor Yellow
$repoUrl = "https://api.github.com/repos/$repoOwner/$repoName"
try {
    $repo = Invoke-RestMethod -Uri $repoUrl -Method GET -ErrorAction Stop
    Write-Host "✅ Repository found: $($repo.html_url)" -ForegroundColor Green
} catch {
    Write-Host "❌ Repository not found. Please ensure it exists." -ForegroundColor Red
    exit 1
}

# Step 2: Check GitHub authentication
Write-Host "`n🔐 Checking GitHub authentication..." -ForegroundColor Yellow
$headers = @{}
if ($githubToken) {
    $headers["Authorization"] = "token $githubToken"
    try {
        $user = Invoke-RestMethod -Uri "https://api.github.com/user" -Headers $headers -ErrorAction Stop
        Write-Host "✅ Authenticated as: $($user.login)" -ForegroundColor Green
    } catch {
        Write-Host "⚠️  GitHub token invalid or expired" -ForegroundColor Yellow
    }
} else {
    Write-Host "⚠️  No GITHUB_TOKEN found in environment" -ForegroundColor Yellow
    Write-Host "   Set it with: $env:GITHUB_TOKEN = 'your_token_here'" -ForegroundColor Gray
}

# Step 3: Open Render Dashboard
Write-Host "`n🌐 Opening Render Dashboard..." -ForegroundColor Yellow
Write-Host "   Please complete these steps manually:" -ForegroundColor Cyan
Write-Host "" -ForegroundColor White
Write-Host "   1. Go to: https://dashboard.render.com" -ForegroundColor White
Write-Host "   2. Sign up/Login with GitHub" -ForegroundColor White
Write-Host "   3. Click 'New +' → 'Blueprint'" -ForegroundColor White
Write-Host "   4. Connect: $repoOwner/$repoName" -ForegroundColor White
Write-Host "   5. Click 'Apply'" -ForegroundColor White
Write-Host "" -ForegroundColor White

# Try to open browser
try {
    Start-Process "https://dashboard.render.com"
    Write-Host "✅ Opened browser to Render Dashboard" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Could not open browser automatically" -ForegroundColor Yellow
    Write-Host "   Please navigate to https://dashboard.render.com manually" -ForegroundColor Gray
}

Write-Host "`n📚 Quick Reference:" -ForegroundColor Cyan
Write-Host "   Repo URL: https://github.com/$repoOwner/$repoName" -ForegroundColor Gray
Write-Host "   Render Blueprint: Uses render.yaml from repo" -ForegroundColor Gray
Write-Host "`n✨ After deployment, your app will be live at:" -ForegroundColor Green
Write-Host "   https://briefly-xxx.onrender.com" -ForegroundColor White

Write-Host "`n💡 Next Steps After Deploy:" -ForegroundColor Cyan
Write-Host "   1. Add environment variables (STRIPE_SECRET_KEY, RESEND_API_KEY, etc.)" -ForegroundColor Gray
Write-Host "   2. Test the API endpoint: /api/health" -ForegroundColor Gray
Write-Host "   3. Start marketing on IndieHackers, Twitter" -ForegroundColor Gray

Write-Host "`n🎯 Press any key to exit..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
