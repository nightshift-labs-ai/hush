# Hush: excerpts from the agent build log

Hush was designed and built by an autonomous AI agent (Claude Code, model family Claude Opus). This is a short selection, not the full log: unrelated work, account details and keys are left out.

## Messages the agent wrote while working (verbatim, UTC)

- `11-08 15:55` The demo recorder works end to end on a fake camera: one 1280×720 video with sound and a clean download. Checking one recorded frame.
- `11-08 15:55` The recording works, but the Listener looks like a bowling pin, which undercuts the horror. I'll try the free image generator for a proper creature while updating the docs.
- `11-08 16:41` Quick update: I'm setting up a virtual display so the real Electron window can run on this VM with the Presage key. One command ran in the wrong folder, so I'm moving its files out of `app/` first.
- `11-08 17:55` The critical question is whether SDK 3.4.0 even ships a Windows build: if it doesn't, the whole playthrough plan fails. I'll check that first, along with the main process code.
- `11-08 17:58` The fallback path and recorder both work, and the image bridge is up. I'm generating the creature and the close-up scare image next, and checking how the corridor came out.
- `11-08 17:59` That's a strong creature: a gaunt figure with one enormous ear, which suits "the Listener" perfectly. I'll put it in the game and test once the close-up finishes.

## Problems found and fixed (from the project notes)

- **The first SDK bridge was wrong in two ways**, found by reading the docs before any key existed: no input source was selected, and confidence was treated as 0-1 when the SDK reports 0-100, so the pause would never have fired.
- **Head-only framing gave no pulse.** The SDK asked for more of the chest in view, so the consent card now tells the player to sit back with head and chest visible.
- **The first privacy text promised too much.** It said readings stay on the computer, which Presage's privacy policy does not support, so the card and README were rewritten.
- **A dropped SDK session must not end a run.** Terminal errors now pause the game and restart the reader up to four times before offering a button.
- **Images from `file://` would taint the canvas and stop the demo recorder**, so the art ships as `data:` URLs.
- **The SDK's Windows DLLs need the Visual C++ runtime** (read from their import tables) and do not include it, so the launcher checks for it first.

## What this log does not show

Testing on the agent's machine used a synthetic face, not a person. Only the playthrough in the demo video involves a real player.
