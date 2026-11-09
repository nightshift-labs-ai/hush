#!/usr/bin/env python3
"""Rebuild app/art.js from art/*.png. Needs ffmpeg on PATH. Run from the repo root."""
import base64, json, subprocess, tempfile, os
SIZES = {'corridor': 'scale=1280:-2', 'listener': 'scale=-2:900', 'face': 'scale=1280:-2'}
art = {}
with tempfile.TemporaryDirectory() as tmp:
    for name, scale in SIZES.items():
        out = os.path.join(tmp, name + '.jpg')
        subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', f'art/{name}.png', '-vf', scale, '-q:v', '4', out], check=True)
        art[name] = 'data:image/jpeg;base64,' + base64.b64encode(open(out, 'rb').read()).decode()
open('app/art.js', 'w').write('// Generated images, embedded so the canvas stays recordable.\nwindow.HUSH_ART=' + json.dumps(art) + ';\n')
