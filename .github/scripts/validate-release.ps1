#
# validate-release.ps1
#
# Validates that a PR is ready for release to main:
#   1. package.json version is incremented vs. main
#   2. CHANGELOG.md has a versioned entry matching the package.json version
#   3. The [Unreleased] section has no content
#
# Usage: pwsh .github/scripts/validate-release.ps1
#

$ErrorActionPreference = 'Stop'
$errors = 0

# --- Read version from package.json ---
$prVersion = (Get-Content './package.json' -Raw | ConvertFrom-Json).version
Write-Host "PR version: $prVersion"

# --- Read version from main branch ---
$mainPackageJson = git show origin/main:package.json 2>$null
if ($LASTEXITCODE -ne 0) {
    # First release — no package.json on main yet
    $mainVersion = '0.0.0'
    Write-Host "main version: (none, treating as $mainVersion)"
} else {
    $mainVersion = ($mainPackageJson | ConvertFrom-Json).version
    Write-Host "main version: $mainVersion"
}

# --- Check 1: Version must be incremented ---
$prSemVer = [System.Version]$prVersion
$mainSemVer = [System.Version]$mainVersion

if ($prSemVer -gt $mainSemVer) {
    Write-Host "✅ Version incremented: $mainVersion → $prVersion"
} else {
    Write-Host "❌ Version not incremented. PR version ($prVersion) must be greater than main ($mainVersion)."
    $errors++
}

# --- Check 2: CHANGELOG.md has a matching versioned entry ---
$changelogContent = Get-Content './CHANGELOG.md'
$pattern = "^## \[$([regex]::Escape($prVersion))\]"

if ($changelogContent | Select-String -Pattern $pattern -Quiet) {
    Write-Host "✅ CHANGELOG.md has entry for [$prVersion]"
} else {
    Write-Host "❌ CHANGELOG.md is missing an entry for ## [$prVersion]. Add a versioned section before merging."
    $errors++
}

# --- Check 3: [Unreleased] section has no content ---
$inUnreleased = $false
$unreleasedLines = @()

foreach ($line in $changelogContent) {
    if ($line -match '^## \[Unreleased\]') {
        $inUnreleased = $true
        continue
    }
    if ($inUnreleased -and $line -match '^## \[') {
        break
    }
    if ($inUnreleased) {
        $unreleasedLines += $line
    }
}

$unreleasedContent = ($unreleasedLines | Where-Object { $_.Trim() -ne '' })

if (-not $unreleasedContent) {
    Write-Host "✅ [Unreleased] section is empty"
} else {
    Write-Host "❌ [Unreleased] section still has content. Move all entries to the [$prVersion] section before merging:"
    $unreleasedContent | ForEach-Object { Write-Host $_ }
    $errors++
}

# --- Summary ---
if ($errors -gt 0) {
    Write-Host ""
    Write-Host "Release validation failed with $errors error(s)."
    exit 1
} else {
    Write-Host ""
    Write-Host "Release validation passed."
}
