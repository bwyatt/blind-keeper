#
# extract-changelog.ps1
#
# Extracts the changelog content for a given version from CHANGELOG.md.
# Outputs clean markdown suitable for GitHub Release notes.
#
# Usage: pwsh .github/scripts/extract-changelog.ps1 -Version <version>
#   e.g.: pwsh .github/scripts/extract-changelog.ps1 -Version 1.0.0
#

param(
    [Parameter(Mandatory)]
    [string]$Version
)

$ErrorActionPreference = 'Stop'

$changelogContent = Get-Content './CHANGELOG.md'
$pattern = "^## \[$([regex]::Escape($Version))\]"
$collecting = $false
$lines = @()

foreach ($line in $changelogContent) {
    if ($line -match $pattern) {
        $collecting = $true
        continue
    }
    if ($collecting -and $line -match '^## \[') {
        break
    }
    if ($collecting -and $line -match '^\[.*\]:') {
        break
    }
    if ($collecting) {
        $lines += $line
    }
}

# Trim leading and trailing blank lines
while ($lines.Count -gt 0 -and $lines[0].Trim() -eq '') {
    $lines = $lines[1..($lines.Count - 1)]
}
while ($lines.Count -gt 0 -and $lines[-1].Trim() -eq '') {
    $lines = $lines[0..($lines.Count - 2)]
}

if ($lines.Count -eq 0) {
    Write-Error "No changelog content found for version $Version"
    exit 1
}

$lines -join "`n"
