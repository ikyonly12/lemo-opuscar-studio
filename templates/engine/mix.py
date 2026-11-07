# Score + narration + procedural foley -> audio.wav & out/mix.wav
# Archetype: Historical Drama & Cultural Pulse — Passer Baroe: Detak Jantung 200 Tahun
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

SR = 48000
DUR = 88.90
N = int(DUR * SR)
rng = np.random.default_rng(20261108)

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

def horse_hoof(g=0.55, pan=0.0):
    t = tt(0.12)
    slap = lp(noise(len(t)), 750) * ex(t, 0.002, 0.035)
    ring = np.sin(2 * np.pi * 320 * t) * ex(t, 0.005, 0.06)
    return st((slap * 0.7 + ring * 0.3) * g, pan)

def carriage_creak(g=0.45, pan=-0.15):
    t = tt(0.35)
    f = np.linspace(420, 280, len(t))
    wood = np.sin(2 * np.pi * np.cumsum(f) / SR) * ex(t, 0.01, 0.15)
    return st(wood * g, pan)

def scissors_snip(g=0.5, pan=0.2):
    t = tt(0.14)
    scrap = hp(noise(len(t)), 2500) * ex(t, 0.001, 0.025)
    clack = np.sin(2 * np.pi * 1850 * t) * ex(t, 0.002, 0.04)
    return st((scrap * 0.65 + clack * 0.35) * g, pan)

def needle_drop(g=0.6, pan=-0.1):
    t = tt(0.08)
    imp = noise(len(t)) * ex(t, 0.0005, 0.012)
    pop = np.sin(2 * np.pi * 650 * t) * ex(t, 0.001, 0.03)
    return st((imp * 0.7 + pop * 0.4) * g, pan)

def camera_shutter(g=0.65, pan=0.15):
    t = tt(0.09)
    click1 = noise(len(t)) * ex(t, 0.0005, 0.01)
    click2 = np.sin(2 * np.pi * 1400 * t) * ex(t, 0.008, 0.025)
    return st((click1 * 0.6 + click2 * 0.5) * g, pan)

def steam_hiss(d=1.2, g=0.25):
    t = tt(d)
    hiss = bp(noise(len(t)), 1200, 4800) * np.sin(np.pi * t / d) ** 1.4 * g
    return st(hiss, -0.2)

def bowl_clink(g=0.45, pan=0.1):
    t = tt(0.3)
    ding = np.sin(2 * np.pi * 2800 * t) * ex(t, 0.001, 0.09) + 0.3 * np.sin(2 * np.pi * 5600 * t) * ex(t, 0.001, 0.04)
    return st(ding * g, pan)

def mrt_whoosh(d=2.5, g=0.35):
    t = tt(d)
    hum = (np.sin(2 * np.pi * np.linspace(110, 220, len(t)) * t) * 0.5 + 
           np.sin(2 * np.pi * np.linspace(220, 440, len(t)) * t) * 0.3)
    air = bp(noise(len(t)), 300, 1500) * 0.4
    env = np.sin(np.pi * t / d) ** 1.8
    return st((hum + air) * env * g, 0.0)

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

# 1. Place Voiceovers (Calibrated 88.90s Indonesian Documentary Timeline)
vo_times = [
    ("v01", 2.40),
    ("v02", 9.58),
    ("v03", 18.59),
    ("v04", 27.92),
    ("v05", 43.00),
    ("v06", 50.31),
    ("v07", 62.80),
    ("v08", 72.27),
    ("v09", 80.13)
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
put(foley_stem, 0.5, swish(0.9, 0.75))
put(foley_stem, 1.1, crinkle(0.55, 0.65))

# --- Spread 0: Weltevreden 1820 & Rekaman 1927 ---
# Horse carriage hooves
for ht in [4.8, 5.25, 5.7, 6.15, 6.6, 7.05, 7.5, 7.95, 10.2, 10.65, 11.1, 11.55]:
    put(foley_stem, ht, horse_hoof(0.42, rng.uniform(-0.25, 0.15)))
put(foley_stem, 6.2, carriage_creak(0.35, -0.2))

# Fabric scissors snips
put(foley_stem, 19.2, scissors_snip(0.48, 0.22))
put(foley_stem, 20.4, scissors_snip(0.45, 0.18))
put(foley_stem, 22.8, scissors_snip(0.46, 0.25))

# Gramophone needle drop & vinyl crackle at 1927 climax
put(foley_stem, 28.5, needle_drop(0.65, -0.1))
# Subtle vinyl crackle
t_crackle = tt(9.0)
crackle = noise(len(t_crackle)) * (rng.random(len(t_crackle)) > 0.998) * 0.15
put(foley_stem, 28.6, st(bp(crackle, 2000, 8000), -0.05))

# Page Turn 0 (39.8s -> 42.6s)
put(foley_stem, 39.8, swish(0.95, 0.85))
put(foley_stem, 40.4, crinkle(0.7, 0.75))

# --- Spread 1: Pasar Baru Masa Kini (Nostalgia & Tradisi) ---
# Analog camera shutter clicks
put(foley_stem, 51.0, camera_shutter(0.62, 0.2))
put(foley_stem, 53.5, camera_shutter(0.58, -0.15))

# Culinary noodle steam & bowl tap
put(foley_stem, 55.2, steam_hiss(1.8, 0.28))
put(foley_stem, 56.5, bowl_clink(0.45, 0.12))

# Page Turn 1 (59.5s -> 62.3s)
put(foley_stem, 59.5, swish(0.95, 0.85))
put(foley_stem, 60.1, crinkle(0.7, 0.75))

# --- Spread 2: Metropolitan Masa Depan ---
# MRT whoosh passing by
put(foley_stem, 67.8, mrt_whoosh(2.8, 0.38))
put(foley_stem, 75.0, mrt_whoosh(2.5, 0.32))

# Climax & Final Closing at 86.5s
put(foley_stem, 86.5, swish(0.95, 0.85))
put(foley_stem, 87.2, book_thud(0.9))

# 3. Procedural Thematic Musical Score (Historical Drama & Cultural Pulse)
# 4 Sonic Layers:
# 1) Deep cello & bass foundation
# 2) Continuous harmonic progression (acoustic piano + warm Rhodes) in A minor / D minor
# 3) Expressive violin & marimba ostinatos
# 4) Gentle shaker & clockwork percussion maintaining 108 BPM narrative pace

BPM = 108.0
beat_dur = 60.0 / BPM
bar_dur = beat_dur * 4.0
n_bars = int(np.ceil(DUR / bar_dur))

# Piano / Cello note synthesizer
def note(f, dur, g=0.3, a=0.015, r=0.45, harm=[1.0, 0.5, 0.25, 0.12]):
    t = tt(dur)
    env = ex(t, a, r)
    sig = np.zeros(len(t))
    for idx, h_amp in enumerate(harm, 1):
        sig += np.sin(2 * np.pi * f * idx * t) * h_amp
    # Add subtle resonance
    return sig * env * g

# Chord progression in A Minor / D Minor (Emotional historical grandeur)
CHORDS = [
    # Bar 0-3: Intro (A minor)
    [220.0, 261.63, 329.63, 440.0],
    [174.61, 220.0, 261.63, 349.23], # F major
    [196.0, 246.94, 293.66, 392.0],  # G major
    [220.0, 261.63, 329.63, 440.0],  # A minor
    # Bar 4-7: Colonial 1820 & Trade (D minor progression)
    [146.83, 220.0, 261.63, 293.66], # D minor
    [174.61, 220.0, 261.63, 349.23], # F major
    [164.81, 246.94, 329.63, 392.0], # E minor
    [220.0, 261.63, 329.63, 440.0],  # A minor
    # Bar 8-11: 1927 Climax Indonesia Raya (Grand D minor to F major)
    [146.83, 220.0, 293.66, 349.23],
    [174.61, 220.0, 261.63, 349.23],
    [196.0, 246.94, 293.66, 392.0],
    [220.0, 261.63, 329.63, 440.0],
    # Bar 12-15: Masa Kini (Reflective, rhythmic pulse)
    [220.0, 261.63, 329.63, 440.0],
    [146.83, 220.0, 261.63, 293.66],
    [174.61, 220.0, 261.63, 349.23],
    [196.0, 246.94, 293.66, 392.0],
    # Bar 16-19: Masa Depan (Soaring harmonic lift)
    [220.0, 261.63, 329.63, 523.25], # Am
    [174.61, 261.63, 329.63, 349.23], # Fmaj7
    [196.0, 293.66, 392.0, 493.88],  # G
    [220.0, 261.63, 329.63, 440.0],  # Am
    # Bar 20+: Climax Pullback & Outro
    [220.0, 261.63, 329.63, 440.0],
    [220.0, 261.63, 329.63, 440.0]
]

music_raw = np.zeros((N, 2))

for b in range(n_bars):
    t_bar = b * bar_dur
    if t_bar >= DUR - 1.0: break
    chord = CHORDS[b % len(CHORDS)]
    root = chord[0]

    # Layer 1: Warm Cello / Bass Foundation (Sustained bass note)
    bass_sig = note(root / 2.0, bar_dur * 1.1, g=0.48, a=0.08, r=bar_dur * 0.8, harm=[1.0, 0.45, 0.15])
    put(music_raw, t_bar, st(lp(bass_sig, 380), 0.0))

    # Layer 2: Harmonic Piano Chords on beats 0 and 2
    for beat in [0, 2]:
        t_beat = t_bar + beat * beat_dur
        for f in chord:
            ch_sig = note(f, beat_dur * 2.2, g=0.18, a=0.012, r=beat_dur * 1.8, harm=[1.0, 0.35, 0.12])
            pan = (f - 260.0) / 400.0
            put(music_raw, t_beat, st(ch_sig, np.clip(pan, -0.4, 0.4)))

    # Layer 3: Syncopated Marimba / Celesta Arpeggios on 8th notes
    for beat_sub in range(8):
        t_sub = t_bar + beat_sub * (beat_dur / 2.0)
        f_arp = chord[beat_sub % len(chord)] * (2.0 if beat_sub % 2 == 1 else 1.0)
        mar_sig = note(f_arp, 0.35, g=0.14, a=0.003, r=0.18, harm=[1.0, 0.18, 0.06])
        put(music_raw, t_sub, st(mar_sig, rng.uniform(-0.35, 0.35)))

    # Layer 4: Percussion Clockwork Shaker (Subtle continuous groove)
    for beat_sub in range(8):
        t_sub = t_bar + beat_sub * (beat_dur / 2.0)
        shk_t = tt(0.06)
        shk_noise = hp(noise(len(shk_t)), 3500) * ex(shk_t, 0.002, 0.02) * (0.09 if beat_sub % 2 == 0 else 0.05)
        put(music_raw, t_sub, st(shk_noise, 0.15))

# 4. Master Mix Calibrations & Speech Ducking (-3.5 dB during voiceover)
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
print(f"[OK] Master audio rendered: {OUT} & out/mix.wav (Duration: {len(final_mix)/SR:.2f}s, Peak: {np.max(np.abs(final_mix)):.2f})")
