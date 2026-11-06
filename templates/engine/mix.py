import os, sys, shutil

os.makedirs('out', exist_ok=True)
out_wav = 'out/mix.wav'

if os.path.exists('audio.wav'):
    shutil.copy('audio.wav', out_wav)
    print(f"[OK] Successfully copied pre-mixed master audio.wav ({os.path.getsize(out_wav)} bytes) to {out_wav}")
else:
    print("[!] audio.wav not found! Please ensure audio.wav is present.")
    sys.exit(1)
