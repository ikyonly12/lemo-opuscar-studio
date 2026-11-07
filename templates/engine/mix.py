# Procedural Audio & Music Score Generator for Passer Baroe: Detak Jantung 200 Tahun (Myeongdong Edition)
import os, sys, math, random, json
import numpy as np
import soundfile as sf

SR = 44100
DUR = 95.5

def synth_mix():
    n_samples = int(SR * DUR)
    t = np.linspace(0, DUR, n_samples, endpoint=False)
    
    # 1. Background Music (Warm Acoustic Score: A minor / D minor / F major progression)
    # Bass / Foundation (Cello & warm sub pulse)
    chords = [
        (0.0, 22.0, [55.0, 110.0, 164.81]),    # A minor (Batavia Weltevreden)
        (22.0, 42.0, [73.42, 146.83, 220.0]),  # D minor (Toko Populer 1927)
        (42.0, 62.0, [87.31, 174.61, 261.63]), # F major (Masa Kini Nostalgia)
        (62.0, 85.0, [98.0, 196.0, 293.66]),   # G major / D minor (Myeongdong Jakarta Street Festival)
        (85.0, DUR, [55.0, 110.0, 164.81])     # A minor Resolving Epilogue
    ]
    
    bgm = np.zeros(n_samples, dtype=np.float32)
    for t_start, t_end, freqs in chords:
        idx_s = int(t_start * SR)
        idx_e = min(int(t_end * SR), n_samples)
        sub_t = t[idx_s:idx_e]
        
        # Soft envelope
        fade = int(1.2 * SR)
        env = np.ones(len(sub_t), dtype=np.float32)
        if len(env) > fade * 2:
            env[:fade] = np.linspace(0, 1, fade)
            env[-fade:] = np.linspace(1, 0, fade)
            
        chord_wave = np.zeros(len(sub_t), dtype=np.float32)
        for f in freqs:
            # Warm analog saw/sine blend
            chord_wave += 0.08 * np.sin(2 * np.pi * f * sub_t)
            chord_wave += 0.03 * np.sin(2 * np.pi * (f * 2) * sub_t)
            chord_wave += 0.015 * np.sin(2 * np.pi * (f * 3) * sub_t)
        bgm[idx_s:idx_e] += chord_wave * env

    # Marimba / Acoustic Pluck ostinato
    ostinato = np.zeros(n_samples, dtype=np.float32)
    tempo = 112.0 # BPM
    beat_dur = 60.0 / tempo
    notes = [440.0, 523.25, 659.25, 587.33, 523.25, 440.0, 392.0, 440.0]
    
    cur_beat = 2.0
    note_idx = 0
    while cur_beat < DUR - 3.0:
        freq = notes[note_idx % len(notes)]
        idx = int(cur_beat * SR)
        hit_len = int(0.28 * SR)
        if idx + hit_len < n_samples:
            hit_t = np.linspace(0, 0.28, hit_len, endpoint=False)
            decay = np.exp(-hit_t * 14.0)
            wave = (np.sin(2 * np.pi * freq * hit_t) + 0.3 * np.sin(2 * np.pi * freq * 2.7 * hit_t)) * decay
            ostinato[idx:idx + hit_len] += 0.06 * wave
        cur_beat += beat_dur * 0.5
        note_idx += 1
        
    # Shaker / Clockwork rhythm groove
    groove = np.zeros(n_samples, dtype=np.float32)
    step = beat_dur * 0.25
    cur_step = 2.0
    rng = np.random.default_rng(42)
    while cur_step < DUR - 2.0:
        idx = int(cur_step * SR)
        hit_len = int(0.04 * SR)
        if idx + hit_len < n_samples:
            noise = rng.uniform(-1, 1, hit_len)
            decay = np.linspace(1, 0, hit_len) ** 3
            groove[idx:idx + hit_len] += 0.02 * noise * decay
        cur_step += step

    master_music = bgm + ostinato + groove
    
    # 2. Bespoke Procedural Foley
    foley = np.zeros(n_samples, dtype=np.float32)
    
    # A. Batavia horse carriage hooves (t=3 to 20s)
    h_time = 3.2
    while h_time < 20.0:
        idx = int(h_time * SR)
        click_len = int(0.06 * SR)
        if idx + click_len < n_samples:
            ct = np.linspace(0, 0.06, click_len, endpoint=False)
            h_wave = np.sin(2 * np.pi * 140 * ct) * np.exp(-ct * 65.0)
            foley[idx:idx + click_len] += 0.04 * h_wave
        h_time += 0.42

    # B. 1927 Gramophone needle drop & vinyl crackle (t=29 to 42s)
    v_start = int(29.5 * SR)
    v_end = int(42.0 * SR)
    vinyl_noise = rng.uniform(-0.012, 0.012, v_end - v_start)
    foley[v_start:v_end] += vinyl_noise
    
    # C. Tailor scissors snip (t=46.0, 48.5)
    for sc_time in [46.2, 48.6]:
        idx = int(sc_time * SR)
        s_len = int(0.08 * SR)
        st = np.linspace(0, 0.08, s_len, endpoint=False)
        snip = rng.uniform(-0.04, 0.04, s_len) * np.exp(-st * 50.0)
        foley[idx:idx + s_len] += snip

    # D. Vintage camera shutter click (t=51.5)
    idx_cam = int(51.5 * SR)
    cam_len = int(0.12 * SR)
    cam_t = np.linspace(0, 0.12, cam_len, endpoint=False)
    shutter = (np.sin(2 * np.pi * 850 * cam_t) + rng.uniform(-0.05, 0.05, cam_len)) * np.exp(-cam_t * 35.0)
    foley[idx_cam:idx_cam + cam_len] += 0.06 * shutter

    # E. Steaming noodle bowl hiss & bowl clink (t=55.5 to 58.0)
    idx_nd = int(55.5 * SR)
    nd_len = int(2.5 * SR)
    hiss = rng.uniform(-0.015, 0.015, nd_len) * np.linspace(0.8, 0.2, nd_len)
    foley[idx_nd:idx_nd + nd_len] += hiss

    # F. Myeongdong Street Market Vibe & Busking Guitar Strum (t=63.5 to 85.0)
    b_start = int(63.5 * SR)
    b_end = int(85.0 * SR)
    # Gentle cheerful street murmurs and warm acoustic guitar busker chords
    for g_strum in [64.0, 67.5, 71.0, 75.0, 78.5, 82.0]:
        g_idx = int(g_strum * SR)
        g_len = int(1.2 * SR)
        if g_idx + g_len < n_samples:
            gt = np.linspace(0, 1.2, g_len, endpoint=False)
            g_chord = (np.sin(2 * np.pi * 330 * gt) + np.sin(2 * np.pi * 440 * gt) + np.sin(2 * np.pi * 550 * gt)) * np.exp(-gt * 4.0)
            foley[g_idx:g_idx + g_len] += 0.045 * g_chord

    # Combine master bed (music + foley)
    bed = master_music + foley
    # Normalize bed to -16 dBFS
    bed = bed / (np.max(np.abs(bed)) + 1e-6) * 0.28
    
    # 3. Load Spoken Voice Lines with Dynamic Speech Ducking (-3.5 dB)
    v_dir = os.path.join(os.path.dirname(__file__), 'voices')
    dur_path = os.path.join(v_dir, 'dur.json')
    durs = json.load(open(dur_path, encoding='utf-8'))
    
    voice_track = np.zeros(n_samples, dtype=np.float32)
    ducking = np.ones(n_samples, dtype=np.float32)
    
    speech_schedule = [
        ('v01', 2.4),
        ('v02', 9.8),
        ('v03', 20.8),
        ('v04', 30.2),
        ('v05', 44.2),
        ('v06', 54.8),
        ('v07', 63.8),
        ('v08', 74.8),
        ('v09', 86.2)
    ]
    
    for vid, t_start in speech_schedule:
        v_file = os.path.join(v_dir, f'{vid}.wav')
        if os.path.exists(v_file):
            data, fs = sf.read(v_file)
            if data.ndim > 1: data = data.mean(axis=1)
            if fs != SR:
                from scipy.signal import resample
                new_len = int(len(data) * SR / fs)
                data = resample(data, new_len)
            
            idx_s = int(t_start * SR)
            idx_e = min(idx_s + len(data), n_samples)
            actual_len = idx_e - idx_s
            voice_track[idx_s:idx_e] += data[:actual_len]
            
            # Apply ducking (-3.5 dB = ~0.67x) during speech with 0.3s ramp
            ramp = int(0.3 * SR)
            d_s = max(0, idx_s - ramp)
            d_e = min(n_samples, idx_e + ramp)
            ducking[d_s:d_e] = 0.65

    # Master Mix
    final_mix = (bed * ducking) + (voice_track * 0.92)
    # Global fade in and fade out
    in_len = int(1.2 * SR)
    out_len = int(2.0 * SR)
    final_mix[:in_len] *= np.linspace(0, 1, in_len)
    final_mix[-out_len:] *= np.linspace(1, 0, out_len)
    
    # Master peak limiter
    peak = np.max(np.abs(final_mix))
    if peak > 0.95:
        final_mix = final_mix / peak * 0.94
        
    out_path = os.path.join(os.path.dirname(__file__), 'audio.wav')
    sf.write(out_path, final_mix, SR)
    
    out_dir = os.path.join(os.path.dirname(__file__), 'out')
    os.makedirs(out_dir, exist_ok=True)
    sf.write(os.path.join(out_dir, 'mix.wav'), final_mix, SR)
    print(f"[mix.py] Generated master audio: {out_path} ({DUR:.2f}s, Peak: {np.max(np.abs(final_mix)):.2f})")

if __name__ == '__main__':
    synth_mix()
