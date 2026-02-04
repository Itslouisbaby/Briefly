# GitHub Repo Creation Script
# Run this in PowerShell to create the Briefly repo

# Check if user is logged into gh CLI
$ghVersion = gh --version 2>$nul
if ($LASTEXITCODE -ne 0) {
    Write-Host "Installing GitHub CLI..."
    winget install --id GitHub.cli
    
    Write-Host "Please login to GitHub:"
    gh auth login
}

# Create the repo
Write-Host "Creating Briefly repository..."
gh repo create briefly --private --description "AI-powered daily intelligence briefings" --source=. --remote=origin --push

Write-Host "Repository created successfully!"
Write-Host "URL: https://github.com/Itslouisbaby/briefly"
