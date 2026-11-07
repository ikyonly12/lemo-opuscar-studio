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
# S sampler not required, procedural synthesis handled via numpy & scipy

SR = 48000
DUR = 117.07
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

def clock_tick(pan=0.0, tock=False):
    t = tt(0.04)
    f = 1700 if not tock else 1250
    click = np.sin(2 * np.pi * f * t) * ex(t, 0.0005, 0.007)
    wood = lp(noise(len(t)), 850) * ex(t, 0.001, 0.012)
    return st((click * 0.55 + wood * 0.45) * 0.25, pan)

def steam_whisper(d=1.5, g=0.18):
    t = tt(d)
    x = bp(noise(len(t)), 700, 2800) * np.sin(np.pi * t / d) ** 1.3 * g
    return st(x, -0.35)

def carriage_ratchet(g=0.55):
    t = tt(0.22)
    x = np.zeros(len(t))
    for k in range(5):
        idx = int(k * 0.038 * SR)
        sub_t = tt(0.03)
        imp = noise(len(sub_t)) * ex(sub_t, 0.0008, 0.006)
        ring = np.sin(2 * np.pi * 2600 * sub_t) * ex(sub_t, 0.001, 0.009)
        x[idx:idx + len(sub_t)] += (imp * 0.6 + ring * 0.4)
    return st(x * g, 0.2)

def bell_ding(f=2350, g=0.48):
    t = tt(0.42)
    ding = np.sin(2 * np.pi * f * t) * ex(t, 0.001, 0.16) + 0.35 * np.sin(2 * np.pi * f * 2.76 * t) * ex(t, 0.001, 0.07)
    return st(ding * g, 0.25)

# Stems
voice_stem = np.zeros((N, 2))
foley_stem = np.zeros((N, 2))
music_stem = np.zeros((N, 2))

def put(buf, t, x):
    i = int(t * SR); j = min(N, i + len(x))
    if j > i and i >= 0: buf[i:j] += x[:j - i]

# 1. Place Voiceovers (Calibrated 117.07s DQ - Documenter timeline)
vo_times = [
    ("v01", 2.50),  ("v02", 8.23),  ("b01", 15.38), ("v03", 18.99),
    ("v04", 27.99), ("v05", 36.57), ("v06", 42.93), ("b02", 51.15),
    ("v07", 56.25), ("v08", 62.82), ("v09", 69.82), ("v10", 76.06),
    ("v11", 85.45), ("v12", 91.60), ("v13", 98.34), ("v14", 106.35)
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

# 2. Rich Environmental Soundscape & Procedural Foley Placement
# Opening Book Foley
put(foley_stem, 0.5, swish(0.9, 0.75))
put(foley_stem, 1.1, crinkle(0.55, 0.65))

# --- Spread 0: Modern Studio Atmosphere ---
# Bursts of modern capacitive touchscreen taps & chiclet laptop keyboard typing
tap_times = [
    2.8, 3.0, 3.15, 3.4, 3.65, 4.05, 4.25, 4.5, 4.8, 5.0,
    8.6, 8.8, 9.05, 9.3, 9.6, 10.0, 10.25, 10.5, 11.0, 11.25,
    16.0, 16.2, 16.45, 19.5, 19.7, 20.0, 21.5, 21.8, 22.1, 23.5, 24.0
]
for dt in tap_times:
    put(foley_stem, dt, glass_tap(0.32, rng.uniform(-0.25, 0.25)))

# Camera transition whoosh into Shot 3 / 4
put(foley_stem, 8.0, swish(0.65, 0.35))
put(foley_stem, 11.8, swish(0.6, 0.3))

# --- Page Turn 0 (25.59s -> 27.79s) ---
put(foley_stem, 25.59, swish(0.95, 0.85))
put(foley_stem, 26.10, crinkle(0.7, 0.75))

# --- Spread 1: 1873 Milwaukee Machine Shop Soundscape ---
# Antique Grandfather Clock Ticking throughout Spread 1 (27s to 54s at 120 BPM = 0.5s intervals)
for k in range(int((53.5 - 27.5) / 0.5)):
    t_clk = 27.5 + k * 0.5
    tock = (k % 2 == 1)
    put(foley_stem, t_clk, clock_tick(pan=-0.35, tock=tock))

# Occasional steam pipe hiss
for t_st in [28.5, 34.5, 41.2, 49.5]:
    put(foley_stem, t_st, steam_whisper(1.4, 0.16))

# Heavy Victorian Typebar Clacks (Testing prototype)
mech_hits = [
    28.8, 29.2, 29.6, 30.1, 30.8, 31.2, 31.6, 32.8, 33.2, 33.7,
    37.0, 37.4, 37.8, 38.3, 39.0, 39.5, 40.1, 40.6,
    43.2, 43.6, 43.9, 44.2, 44.5, 44.8
]
for dt in mech_hits:
    put(foley_stem, dt, type_clack(0.58, rng.uniform(-0.35, 0.35)))

# Carriage returns & bell dings during Sholes' typing
put(foley_stem, 31.8, bell_ding(2200, 0.45))
put(foley_stem, 32.0, carriage_ratchet(0.5))
put(foley_stem, 40.8, bell_ding(2200, 0.45))
put(foley_stem, 41.0, carriage_ratchet(0.5))

# THE FATAL TYPEBAR JAM IMPACT at 45.2s - 46.0s (during "bertubrukan keras, dan macet total")
# Massive clashing resonance, metal binding & spring shiver
put(foley_stem, 45.2, jam_chank(1.2))
put(foley_stem, 45.45, jam_chank(0.95))
put(foley_stem, 45.85, type_clack(0.7, 0.2))
put(foley_stem, 50.8, jam_chank(0.95)) # Sholes testing stuck lever in frustration

# Camera pan whoosh into Sholes reaction
put(foley_stem, 47.8, swish(0.65, 0.4))

# --- Page Turn 1 (53.85s -> 56.05s) ---
put(foley_stem, 53.85, swish(0.95, 0.85))
put(foley_stem, 54.35, crinkle(0.7, 0.75))

# --- Spread 2: Western Union Telegraph Office & Morse Code ---
# Background telegraph chatter (authentic dit-dah sequences)
morse_seq = [
    56.5, 56.62, 56.74, 56.98, 57.1, 57.4, 57.52, 57.75, 58.0,
    58.5, 58.62, 58.85, 59.1, 59.4, 59.65, 59.78, 60.1,
    70.2, 70.32, 70.44, 70.7, 70.82, 71.1, 71.22, 71.45, 71.7, 71.9,
    76.5, 76.62, 76.85, 77.0, 77.25, 77.4, 77.52, 77.8, 78.05
]
for dt in morse_seq:
    put(foley_stem, dt, morse_pip(750, 0.05, 0.32, -0.25))

# High-Speed Flawless Typing on Revised Anti-Jam Layout (63.0s - 68.5s and 72.0s - 81.5s)
rapid_hits = [
    63.2, 63.42, 63.65, 63.88, 64.1, 64.32, 64.6, 64.82, 65.05, 65.3, 65.6, 65.85, 66.1, 66.4,
    72.5, 72.7, 72.92, 73.15, 73.4, 73.65, 73.9, 74.2, 74.5, 74.75, 75.0,
    78.5, 78.7, 78.92, 79.15, 79.38, 79.6, 79.85, 80.1, 80.35
]
for dt in rapid_hits:
    put(foley_stem, dt, type_clack(0.52, rng.uniform(-0.3, 0.3)))

put(foley_stem, 66.6, bell_ding(2400, 0.42))
put(foley_stem, 66.8, carriage_ratchet(0.48))
put(foley_stem, 75.2, bell_ding(2400, 0.42))
put(foley_stem, 75.4, carriage_ratchet(0.48))

# --- Page Turn 2 (83.05s -> 85.25s) ---
put(foley_stem, 83.05, swish(0.95, 0.85))
put(foley_stem, 83.55, crinkle(0.7, 0.75))

# --- Spread 3: Modern Epilogue & Path Dependency ---
# Blend of mechanical typewriter strike evolving into digital phone capacitive clicks
morph_hits = [
    86.0, 86.4, 86.8, 87.2, 87.7, 88.2, 88.8, 89.4,
    91.8, 92.2, 92.7, 93.3, 93.8, 94.5, 95.3, 96.1,
    99.2, 99.8, 100.4, 101.2, 102.4, 103.2, 104.2, 105.4, 106.2, 107.5, 109.0
]
for idx, dt in enumerate(morph_hits):
    k_morph = idx / len(morph_hits) # 0 = mechanical, 1 = glass tap
    if k_morph < 0.5:
        put(foley_stem, dt, type_clack(0.45 * (1 - k_morph), rng.uniform(-0.2, 0.2)))
    put(foley_stem, dt, glass_tap(0.35 * (0.3 + 0.7 * k_morph), rng.uniform(-0.25, 0.25)))

# Climax & Final Closing at 114.5s
put(foley_stem, 114.5, swish(0.95, 0.85))
put(foley_stem, 115.3, book_thud(0.9))

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

