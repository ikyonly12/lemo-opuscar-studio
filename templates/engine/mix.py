import os
import sys
import json
import asyncio
import numpy as np
import soundfile as sf
import edge_tts

SR = 48000
DUR = 60.0
TOTAL_SAMPLES = int(SR * DUR)

# Subtitle Dialogue Lines (Indonesian)
LINES = [
    (0.5, "Pernahkah Anda bertanya-tanya, mengapa tombol snooze berdurasi tepat sembilan menit? Bukan sepuluh, bukan lima."),
    (10.0, "Tahun sembilan belas lima puluh enam, perusahaan jam Telechron menghadapi masalah mekanik besar."),
    (18.8, "Gigi roda gigi jam weker hanya bisa disinkronkan pada siklus roda tertentu."),
    (28.2, "Roda gigi sepuluh menit terlalu besar untuk sasis jam. Pilihannya hanya sembilan menit atau sepuluh lewat."),
    (41.0, "Para insinyur memilih sembilan menit lebih aman, agar orang tidak tertidur pulas."),
    (50.5, "Namun bagi biologi manusia, sembilan menit merusak siklus otak. Itulah misteri tombol snooze.")
]

async def synthesize_voice():
    os.makedirs('out', exist_ok=True)
    voice_track = np.zeros(TOTAL_SAMPLES, dtype=np.float32)

    print("[*] Synthesizing Indonesian neural voiceover via Edge-TTS (id-ID-ArdiNeural)...")
    for idx, (start_time, text) in enumerate(LINES):
        line_wav = f"out/line_{idx}.mp3"
        comm = edge_tts.Communicate(text, "id-ID-ArdiNeural", rate="+0%", volume="+0%")
        await comm.save(line_wav)

        # Read mp3 into numpy array
        data, rate = sf.read(line_wav)
        if len(data.shape) > 1:
            data = data.mean(axis=1) # stereo to mono
        
        # Resample if needed
        if rate != SR:
            import scipy.signal
            data = scipy.signal.resample(data, int(len(data) * SR / rate))

        start_idx = int(start_time * SR)
        end_idx = min(TOTAL_SAMPLES, start_idx + len(data))
        length = end_idx - start_idx
        voice_track[start_idx:end_idx] += data[:length] * 0.95

    return voice_track

def generate_bgm(voice_track):
    print("[*] Composing 4-layer continuous BGM score (Bass, Harmony, Melody, Clock Ticks)...")
    t = np.linspace(0, DUR, TOTAL_SAMPLES, endpoint=False)

    # 1. Warm Acoustic Bass Layer (Sub-bass pulse 48Hz - 64Hz)
    bass = np.sin(2 * np.pi * 55.0 * t) * 0.25
    bass += np.sin(2 * np.pi * 110.0 * t) * 0.12

    # 2. Chord Progression (Harmony: Fm - Db - Eb - C)
    harmony = np.zeros(TOTAL_SAMPLES, dtype=np.float32)
    chords = [
        (0, 15, [174.61, 207.65, 261.63]), # F minor
        (15, 30, [138.59, 174.61, 207.65]), # Db major
        (30, 45, [155.56, 196.00, 233.08]), # Eb major
        (45, 60, [130.81, 164.81, 196.00])  # C major
    ]
    for c_start, c_end, freqs in chords:
        s0, s1 = int(c_start * SR), int(c_end * SR)
        t_sec = t[s0:s1]
        chord_wave = np.zeros(s1 - s0, dtype=np.float32)
        for f in freqs:
            chord_wave += np.sin(2 * np.pi * f * t_sec) * 0.08
            chord_wave += np.sin(2 * np.pi * f * 2 * t_sec) * 0.03 # warm octave overtone
        harmony[s0:s1] = chord_wave

    # 3. Clockwork Pluck / Marimba Melodic Motifs
    melody = np.zeros(TOTAL_SAMPLES, dtype=np.float32)
    bpm = 108
    beat_dur = 60.0 / bpm
    total_beats = int(DUR / beat_dur)
    scale = [261.63, 293.66, 311.13, 349.23, 392.00, 415.30, 466.16, 523.25]
    for b in range(total_beats):
        b_time = b * beat_dur
        freq = scale[(b * 3 + (b // 4)) % len(scale)]
        pluck_len = int(SR * 0.35)
        if int(b_time * SR) + pluck_len < TOTAL_SAMPLES:
            p_t = np.linspace(0, 0.35, pluck_len)
            env = np.exp(-p_t * 12.0)
            p_wave = (np.sin(2 * np.pi * freq * p_t) + 0.4 * np.sin(2 * np.pi * freq * 2 * p_t)) * env * 0.16
            s_idx = int(b_time * SR)
            melody[s_idx:s_idx + pluck_len] += p_wave

    # 4. Rhythm & Mechanical Clockwork Foley Ticks
    foley = np.zeros(TOTAL_SAMPLES, dtype=np.float32)
    tick_interval = 0.5 # 2 ticks per second (120 ticks/min)
    for k in range(int(DUR / tick_interval)):
        k_time = k * tick_interval
        tick_len = int(SR * 0.02)
        if int(k_time * SR) + tick_len < TOTAL_SAMPLES:
            noise = (np.random.rand(tick_len) * 2 - 1) * np.exp(-np.linspace(0, 0.02, tick_len) * 200) * 0.06
            idx = int(k_time * SR)
            foley[idx:idx + tick_len] += noise

    # Master BGM Sum (Master Level: -16 dBFS)
    bgm_master = (bass + harmony + melody + foley) * 0.65

    # Voice Ducking (-3.5 dB attenuation during voice activity)
    voice_env = np.abs(voice_track)
    # Simple low-pass envelope follower
    from scipy.ndimage import uniform_filter1d
    smooth_env = uniform_filter1d(voice_env, size=int(SR * 0.25))
    duck_gain = 1.0 - (smooth_env > 0.02).astype(np.float32) * 0.40 # 40% reduction (-3.5 dB)
    ducked_bgm = bgm_master * duck_gain

    return ducked_bgm

async def main():
    os.makedirs('out', exist_ok=True)
    voice = await synthesize_voice()
    bgm = generate_bgm(voice)

    # Master Mixdown (Stereo)
    final_mix = np.column_stack([voice + bgm, voice + bgm])

    out_file = 'out/mix.wav'
    sf.write(out_file, final_mix, SR, subtype='PCM_16')
    print(f"[✓] Audio mixdown successfully generated: {out_file} (Duration: {DUR}s, 48kHz Stereo)")

if __name__ == '__main__':
    asyncio.run(main())
