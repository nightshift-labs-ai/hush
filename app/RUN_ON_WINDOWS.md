# Running the Hush demo on Windows (for Claude Code on the owner's PC)
1. Copy this `app/` folder to Windows WITHOUT `node_modules/` and `dist/` (they are Linux builds). Needs Node 20+ and a webcam.
   Before calling the owner over, run `powershell -ExecutionPolicy Bypass -File .\START_DEMO.ps1 -CheckOnly` and fix whatever it lists (no key or player needed). The likely one is the Visual C++ runtime, which the SDK's DLLs need and do not include.
2. In PowerShell, in the copied folder, set the key for that window only: `$env:SMARTSPECTRA_API_KEY = "..."`. Do not write it to any file.
3. If scripts are blocked: `powershell -ExecutionPolicy Bypass -File .\START_DEMO.ps1 mosaic`. Otherwise `.\START_DEMO.ps1 mosaic` (or `face`, only if the owner chose that).
4. The owner sits back so head AND chest are in the picture, in even light, and clicks "I agree". The first reading can take about 20 s.
5. Let the round finish (DAWN or FOUND) and wait a few seconds on the end card: the video is saved only at the end of a round, to the Desktop as `hush-demo-<number>.webm`. Closing the window early loses it.
6. If the screen says "Reconnecting" or asks to step back, wait: the round pauses and carries on.
7. Observed on one PC (Node 24, npm 12): `npm ci` did not fetch Electron, so run `node node_modules/electron/install.js` if `node_modules/electron/dist/electron.exe` is missing. npm 12 blocked the esbuild, koffi and protobufjs install scripts and the game still worked.
8. The saved video has no duration header: remux it before uploading. On closing, the process may die with `FATAL ERROR: Error::ThrowAsJavaScriptException napi_throw` about 10 s after the save; the video is not affected.
9. SDK errors and hints are logged to the DevTools console as `[hush] ...`. If "Reconnecting" repeats, the game gives up after 4 restarts in 2 minutes and shows the error.
