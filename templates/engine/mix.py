# Score + narration + procedural foley -> audio.wav
# Archetype: Investigative / Science & Technology Pulse
import json, re, os, sys
import numpy as np, soundfile as sf
from scipy.signal import butter, sosfilt, fftconvolve

ROOT = os.path.dirname(os.path.abspath(__file__))
os.chdir(ROOT)
OUT = sys.argv[1] if len(sys.argv) > 1 else 'audio.wav'

lib_candidate = os.environ.get('LIB', os.path.expanduser('~/lemo-opuscar'))
if not os.path.exists(lib_candidate):
    lib_candidate = 'C:/Users/Kenzie kafi/lemo-opuscar'
sys.path.insert(0, lib_candidate)
from core.audio import sampler as S

SR = 48000
DUR = 104.5
N = int(DUR * SR)
rng = np.random.default_rng(20261107)

def bp(x, lo, hi, o=2): return sosfilt(butter(o, [lo, hi], 'band', fs=SR, output='sos'), x)
def lp(x, f, o=2): return sosfilt(butter(o, f, 'low', fs=SR, output='sos'), x)
def hp(x, f, o=2): return sosfilt(butter(o, f, 'high', fs=SR, output='sos'), x)
def noise(n): return rng.standard_normal(n)
def st(x, pan=0.0):
    l = np.cos((pan + 1) * np.pi / 4); r = np.sin((pan + 1) * np.pi / 4)
    return np.stack([x * l * 1.414, x * r * 1.414], 1)
def tt(d): return np.arange(int(d * SR)) / SR
def ex(t, a, r): return np.minimum(1, t / max(a, 1e-4)) * np.exp(-np.maximum(0, t - a) / max(r, 1e-4))
def fade(x, fi, fo):
    n = len(x); e = np.ones(n); a = int(fi * SR); b = int(fo * SR)
    if a: e[:a] = np.linspace(0, 1, a) ** 1.5
    if b: e[-b:] = np.minimum(e[-b:], np.linspace(1, 0, b) ** 1.5)
    return x * (e[:, None] if x.ndim == 2 else e)

# Foley generators
def swish(d=0.75, g=0.9):
    t = tt(d); n = len(t); x = noise(n)
    y = bp(x, 500, 3000) * np.sin(np.pi * t / t[-1]) ** 1.6 * g
    return st(y, 0.0)

def crinkle(d=0.45, g=0.75):
    n = int(d * SR); x = np.zeros(n)
    for _ in range(int(150 * d)):
        i = rng.integers(0, max(1, n - 300)); L = rng.integers(30, 220)
        x[i:i + L] += noise(L) * np.exp(-np.arange(L) / (L / 4)) * rng.uniform(0.3, 1)
    return st(bp(x, 1400, 8000) * g, 0.1)

def type_clack(g=0.6, pan=0.0):
    t = tt(0.08)
    imp = noise(len(t)) * ex(t, 0.001, 0.015)
    f = 1200 * np.exp(-t * 35)
    body = np.sin(2 * np.pi * np.cumsum(f) / SR) * ex(t, 0.002, 0.035)
    x = (imp * 0.7 + body * 0.5) * g
    return st(x, pan)

def jam_chank(g=0.85):
    t = tt(0.35)
    ring1 = np.sin(2 * np.pi * 840 * t) * ex(t, 0.002, 0.12)
    ring2 = np.sin(2 * np.pi * 1160 * t) * ex(t, 0.002, 0.08)
    imp = noise(len(t)) * ex(t, 0.001, 0.03)
    x = (ring1 * 0.6 + ring2 * 0.5 + bp(imp, 600, 4500) * 0.8) * g
    return st(x, 0.15)

def morse_pip(f=750, dur=0.06, g=0.3, pan=-0.2):
    t = tt(dur)
    env = np.sin(np.pi * t / dur) ** 2
    x = np.sin(2 * np.pi * f * t) * env * g
    return st(x, pan)

def glass_tap(g=0.4, pan=0.2):
    t = tt(0.04)
    x = np.sin(2 * np.pi * 2200 * t) * ex(t, 0.001, 0.012) * g
    return st(x, pan)

def book_thud(g=0.8):
    t = tt(0.5)
    sub = np.sin(2 * np.pi * 65 * np.exp(-t * 6) * t) * ex(t, 0.005, 0.18)
    slap = lp(noise(len(t)), 450) * ex(t, 0.002, 0.06)
    x = (sub * 0.8 + slap * 0.5) * g
    return st(x, 0.0)

# Stems
voice_stem = np.zeros((N, 2))
foley_stem = np.zeros((N, 2))
music_stem = np.zeros((N, 2))

def put(buf, t, x):
    i = int(t * SR); j = min(N, i + len(x))
    if j > i and i >= 0: buf[i:j] += x[:j - i]

# 1. Place Voiceovers
vo_times = [
    ("v01", 2.8), ("v02", 7.8), ("b01", 13.4), ("v03", 18.6),
    ("v04", 27.5), ("v05", 35.0), ("v06", 40.6), ("b02", 48.0),
    ("v07", 53.0), ("v08", 58.5), ("v09", 65.0), ("v10", 70.4),
    ("v11", 78.3), ("v12", 83.1), ("v13", 88.3), ("v14", 94.5)
]

for vid, t_start in vo_times:
    wpath = os.path.join(ROOT, 'voices', f'{vid}.wav')
    if os.path.exists(wpath):
        data, sr = sf.read(wpath)
        if sr != SR:
            import scipy.signal
            data = scipy.signal.resample(data, int(len(data) * SR / sr))
        if data.ndim == 1:
            data = st(data, 0.0)
        put(voice_stem, t_start, data)

# 2. Procedural Foley Placement
put(foley_stem, 0.6, swish(0.8, 0.7))
put(foley_stem, 1.2, crinkle(0.5, 0.6))

# Modern glass taps (Spread 0)
for dt in [3.2, 3.6, 4.1, 4.8, 8.4, 9.2, 10.0, 11.2]:
    put(foley_stem, dt, glass_tap(0.35, rng.uniform(-0.3, 0.3)))

# Page Turn 0
put(foley_stem, 24.8, swish(0.85, 0.8))
put(foley_stem, 25.4, crinkle(0.6, 0.7))

# 1873 Typebar clacks (Spread 1)
for dt in [28.2, 28.9, 29.5, 30.2, 35.6, 36.1, 36.8, 41.2, 41.6, 42.1]:
    put(foley_stem, dt, type_clack(0.55, rng.uniform(-0.4, 0.4)))

# Typebar Jam Impact
put(foley_stem, 42.6, jam_chank(0.95))
put(foley_stem, 47.6, jam_chank(0.85))

# Page Turn 1
put(foley_stem, 50.4, swish(0.85, 0.8))
put(foley_stem, 51.0, crinkle(0.6, 0.7))

# Morse code pips (Spread 2)
for dt in [53.5, 53.7, 54.0, 54.2, 54.4, 55.0, 55.2, 71.0, 71.2, 71.5, 71.7, 72.0, 72.3]:
    put(foley_stem, dt, morse_pip(760, 0.05, 0.28, -0.2))

# Smooth fast typing (Spread 2)
for dt in [58.8, 59.2, 59.6, 60.1, 65.5, 66.0, 66.4, 66.9, 72.8, 73.2, 73.6]:
    put(foley_stem, dt, type_clack(0.48, rng.uniform(-0.3, 0.3)))

# Page Turn 2
put(foley_stem, 75.7, swish(0.85, 0.8))
put(foley_stem, 76.3, crinkle(0.6, 0.7))

# Epilogue glass taps & close
for dt in [84.2, 85.0, 89.2, 90.1, 95.0, 96.2]:
    put(foley_stem, dt, glass_tap(0.35, rng.uniform(-0.3, 0.3)))

put(foley_stem, 102.0, swish(0.9, 0.8))
put(foley_stem, 102.8, book_thud(0.85))

# 3. Procedural Thematic Musical Score (Investigative Science Pulse)
# 4 Sonic Layers:
# 1) Low-passed analog bass pulse & upright bass
# 2) Continuous harmonic progression (Rhodes / acoustic grand piano) in D Minor / G Dorian
# 3) Syncopated acoustic marimba ostinato & clockwork chime
# 4) Shaker / brush swing & acoustic woodblocks maintaining 112 BPM momentum

BPM = 112.0
beat_dur = 60.0 / BPM
bar_dur = beat_dur * 4.0
n_bars = int(np.ceil(DUR / bar_dur))

# D Minor / G Dorian chord progression
# Bar 0-3: Dm - F - C - Gm
# Bar 4-7: Dm - Bb - C - A7sus
roots = [50, 53, 48, 55, 50, 46, 48, 57] # MIDI notes (D3, F3, C3, G3, D3, Bb2, C3, A3)

def midi_to_freq(m): return 440.0 * (2.0 ** ((m - 69.0) / 12.0))

# Pre-render musical layers
music_raw = np.zeros((N, 2))

# Layer 1: Pulse Bass
for bar in range(n_bars):
    t_bar = bar * bar_dur
    root_m = roots[bar % len(roots)] - 12
    freq = midi_to_freq(root_m)
    for b in range(4):
        t_note = t_bar + b * beat_dur
        if t_note >= DUR - 2: break
        # 8th note pulsing bass
        for sub in [0.0, beat_dur * 0.5]:
            t_sub = t_note + sub
            t_len = beat_dur * 0.42
            tt_arr = tt(t_len)
            osc = np.sin(2 * np.pi * freq * tt_arr) + 0.35 * np.sin(2 * np.pi * freq * 2 * tt_arr)
            env = ex(tt_arr, 0.005, 0.16)
            b_sig = lp(osc * env * 0.32, 280)
            put(music_raw, t_sub, st(b_sig, -0.05))

# Layer 2: Harmonic Ostinato (Acoustic Piano / Rhodes)
chords = [
    [62, 65, 69], # Dm
    [65, 69, 72], # F
    [60, 64, 67], # C
    [58, 62, 67], # Gm
    [62, 65, 69], # Dm
    [58, 62, 65], # Bb
    [60, 64, 67], # C
    [61, 64, 67], # A
]

for bar in range(n_bars):
    t_bar = bar * bar_dur
    c_notes = chords[bar % len(chords)]
    for idx, mn in enumerate(c_notes):
        freq = midi_to_freq(mn)
        # Broken arpeggio pattern: beat 0, 1.5, 2.5, 3.5
        for b_off in [0.0, 1.5 * beat_dur, 2.5 * beat_dur]:
            t_p = t_bar + b_off + (idx * 0.02)
            if t_p >= DUR - 2: break
            t_len = beat_dur * 1.8
            tt_arr = tt(t_len)
            osc = np.sin(2 * np.pi * freq * tt_arr) + 0.2 * np.sin(2 * np.pi * freq * 2.01 * tt_arr) + 0.08 * np.sin(2 * np.pi * freq * 3.02 * tt_arr)
            env = ex(tt_arr, 0.004, 0.65)
            p_sig = bp(osc * env * 0.22, 180, 4200)
            put(music_raw, t_p, st(p_sig, 0.15 * (idx - 1)))

# Layer 3: Muted Marimba & Science Clockwork Ostinato
marimba_pat = [74, 69, 72, 74, 76, 74, 72, 69] # High D, A, C, D, E, D, C, A
for bar in range(n_bars):
    t_bar = bar * bar_dur
    for i, mn in enumerate(marimba_pat):
        t_m = t_bar + i * (beat_dur * 0.5)
        if t_m >= DUR - 1.5: break
        freq = midi_to_freq(mn)
        t_len = 0.18
        tt_arr = tt(t_len)
        strike = noise(len(tt_arr)) * ex(tt_arr, 0.001, 0.012) * 0.4
        tonal = np.sin(2 * np.pi * freq * tt_arr) * ex(tt_arr, 0.002, 0.07)
        m_sig = (strike + tonal) * 0.24
        pan = 0.35 if (i % 2 == 0) else -0.35
        put(music_raw, t_m, st(m_sig, pan))

# Layer 4: Shaker & Woodblock Rhythm
for bar in range(n_bars):
    t_bar = bar * bar_dur
    for step in range(8):
        t_s = t_bar + step * (beat_dur * 0.5)
        if t_s >= DUR - 1.0: break
        # Shaker tick
        t_len = 0.05
        shk = bp(noise(int(t_len * SR)), 4000, 11000) * ex(tt(t_len), 0.001, 0.018) * 0.14
        put(music_raw, t_s, st(shk, 0.2))
        # Woodblock syncopation on steps 2 and 6
        if step in [2, 6]:
            wb = np.sin(2 * np.pi * 920 * tt(0.06)) * ex(tt(0.06), 0.001, 0.015) * 0.18
            put(music_raw, t_s, st(wb, -0.25))

# 4. Calibrated Music Mastering & Gentle Ducking (-3.5 dB during voiceovers)
# Create voice envelope for ducking
voice_env = lp(np.abs(voice_stem[:, 0]) + np.abs(voice_stem[:, 1]), 8.0)
v_max = np.max(voice_env) if np.max(voice_env) > 0 else 1.0
voice_norm = np.clip(voice_env / (v_max * 0.4), 0.0, 1.0)

# -3.5 dB ducking = factor of 0.67
duck_gain = 1.0 - voice_norm * 0.33
music_stem = music_raw * duck_gain[:, None]

# Overall music gain: calibrated to -17 dBFS
rms_m = np.sqrt(np.mean(music_stem ** 2))
if rms_m > 0:
    target_rms = 10.0 ** (-17.0 / 20.0)
    music_stem *= (target_rms / rms_m)

# Fade out music gently at end
music_stem = fade(music_stem, 1.0, 3.0)

# Final Mix: Voice (-3 dBFS target), Foley (-14 dBFS), Music (-17 dBFS)
final_mix = voice_stem * 1.05 + foley_stem * 0.85 + music_stem

# Master limiter to prevent any digital clipping
peak = np.max(np.abs(final_mix))
if peak > 0.94:
    final_mix = final_mix * (0.94 / peak)

sf.write(OUT, final_mix, SR)
os.makedirs('out', exist_ok=True)
sf.write('out/mix.wav', final_mix, SR)
print(f"Rendered {OUT} & out/mix.wav: duration {len(final_mix)/SR:.2f}s, peak {np.max(np.abs(final_mix)):.2f}")

