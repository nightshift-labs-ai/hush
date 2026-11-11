# Hush demo round for the challenge video. Run from this folder in PowerShell.
# The key must already be set in this window: $env:SMARTSPECTRA_API_KEY = "..."
# Choose how the camera appears in the saved video:  .\START_DEMO.ps1 mosaic   (blocks, no recognisable face)
#                                                    .\START_DEMO.ps1 face     (your real camera picture)
# Check this PC first, without the key, the camera or the player:  .\START_DEMO.ps1 -CheckOnly
param([ValidateSet('mosaic','face')][string]$Camera = 'mosaic', [switch]$CheckOnly)

$problems = @()
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
  $problems += 'Node.js is missing. Install Node 20 or newer, 64-bit: winget install OpenJS.NodeJS.LTS'
} else {
  $nodeMajor = [int](node -p "process.versions.node.split('.')[0]")
  $nodeArch = node -p "process.arch"
  if ($nodeMajor -lt 20 -or $nodeArch -ne 'x64') {
    $problems += "Node is version $nodeMajor on $nodeArch. Needs 20 or newer on x64: winget install OpenJS.NodeJS.LTS"
  }
}
# The Presage SDK's Windows DLLs import these, and its package does not include them.
$runtime = 'msvcp140.dll','msvcp140_atomic_wait.dll','vcruntime140.dll','vcruntime140_1.dll','concrt140.dll'
$missing = $runtime | Where-Object { -not (Test-Path (Join-Path $env:WINDIR "System32\$_")) }
if ($missing) {
  $problems += "Visual C++ runtime files are missing ($($missing -join ', ')). Install it (asks for admin): winget install Microsoft.VCRedist.2015+.x64"
}
if ((Test-Path node_modules) -and -not (Test-Path 'node_modules\electron\dist\electron.exe')) {
  $problems += 'electron.exe is missing. Run: node node_modules/electron/install.js  If that does not help (for example the folder was copied from Linux), delete node_modules and dist, run npm install, and try again.'
}
if ((Get-Location).Path -match '[^\x00-\x7F]') {
  $problems += 'This folder path has non-English letters, which native libraries often cannot open. Copy the app to a plain path such as C:\hush and run it there.'
}
if ($problems) {
  Write-Host 'This PC is not ready:'
  $problems | ForEach-Object { Write-Host " - $_" }
  exit 2
}
if ($CheckOnly) { Write-Host 'PC check passed. This does not test the webcam or the SDK itself.'; exit 0 }

if (-not $env:SMARTSPECTRA_API_KEY) { Write-Host 'Set $env:SMARTSPECTRA_API_KEY first.'; exit 1 }
if (-not (Test-Path node_modules)) { npm install; if ($LASTEXITCODE -ne 0) { exit 1 } }
if ($Camera -eq 'face') { $env:HUSH_RECORD = '1' } else { $env:HUSH_RECORD = 'mosaic' }
npm start
Write-Host 'Done. The video is on your Desktop: hush-demo-<number>.webm'
