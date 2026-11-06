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

def load_story_data():
    story_path = 'story.json'
    if os.path.exists(story_path):
        try:
            with open(story_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
                print(f"[*] Loaded dynamic story: \"{data.get('title', 'Untitled')}\"")
                return data
        except Exception as e:
            print(f"[!] Error reading story.json: {e}")

    # Fallback to minimal dynamic container from CLI args
    title = sys.argv[1] if len(sys.argv) > 1 else "Inovasi Sains & Sejarah"
    return {
        "title": title,
        "topic": title,
        "language": "id",
        "voiceLines": []
    }

async def synthesize_voice(story):
    os.makedirs('out', exist_ok=True)
    voice_track = np.zeros(TOTAL_SAMPLES, dtype=np.float32)

    lang = story.get('language', 'id').lower()
    voice = "en-US-GuyNeural" if (lang.startswith('en') or 'english' in lang) else "id-ID-ArdiNeural"

    # Extract dynamic voice lines
    raw_lines = story.get('voiceLines', [])
    
    # If voiceLines empty, derive from subtitles
    if not raw_lines and story.get('subtitles'):
        subs = story.get('subtitles', [])
        # Group every 3 subtitle chunks into a voice line
        for i in range(0, len(subs), 3):
            group = subs[i:i+3]
            t_start = group[0].get('start', group[0].get('t0', 0.5))
            combined_text = " ".join([c.get('text', '') for c in group]).strip()
            if combined_text:
                raw_lines.append({'t': t_start, 'text': combined_text})

    # If still empty, use topic / title
    if not raw_lines:
        topic_text = story.get('topic') or story.get('title') or "Inovasi teknologi dan sejarah tersembunyi di balik peradaban modern."
        # Split into 3 narrative beats across the 60s
        sentences = [s.strip() for s in topic_text.replace(';', '.').split('.') if s.strip()]
        if len(sentences) == 1:
            raw_lines = [
                {'t': 1.0, 'text': sentences[0]},
                {'t': 22.0, 'text': "Melalui perhitungan presisi dan eksperimen mendalam, rancangan revolusioner ini mengubah cara kerja peradaban modern."},
                {'t': 44.0, 'text': "Inilah bukti nyata bahwa detail teknis terkecil mampu menciptakan dampak abadi dalam kehidupan kita."}
            ]
        else:
            spacing = min(18.0, 50.0 / max(len(sentences), 1))
            raw_lines = [{'t': 1.0 + i * spacing, 'text': s} for i, s in enumerate(sentences[:4])]

    print(f"[*] Synthesizing dynamic neural voiceover via Edge-TTS ({voice}) for {len(raw_lines)} lines...")
    
    for idx, item in enumerate(raw_lines):
        start_time = float(item.get('t', item.get('start', 0.5)))
        text = str(item.get('text', '')).strip()
        if not text or start_time >= DUR - 2.0:
            continue

        line_wav = f"out/line_{idx}.mp3"
        try:
            print(f"  [{idx+1}/{len(raw_lines)}] ({start_time:.1f}s): \"{text}\"")
            comm = edge_tts.Communicate(text, voice, rate="+0%", volume="+0%")
            await asyncio.wait_for(comm.save(line_wav), timeout=25.0)

            # Read mp3 into numpy array
            data, rate = sf.read(line_wav)
            if len(data.shape) > 1:
                data = data.mean(axis=1) # stereo to mono
            
            # Resample if needed to 48kHz
            if rate != SR:
                import scipy.signal
                data = scipy.signal.resample(data, int(len(data) * SR / rate))

            start_idx = int(start_time * SR)
            end_idx = min(TOTAL_SAMPLES, start_idx + len(data))
            length = end_idx - start_idx
            voice_track[start_idx:end_idx] += data[:length] * 0.95
        except Exception as e:
            print(f"[!] Warning synthesizing line {idx}: {e}")

    return voice_track

def generate_bgm(voice_track):
    print("[*] Composing 4-layer continuous BGM score (Bass, Harmony, Melody, Rhythm)...")
    t = np.linspace(0, DUR, TOTAL_SAMPLES, endpoint=False)

    # 1. Warm Acoustic Bass Layer (Sub-bass pulse 55Hz - 110Hz)
    bass = np.sin(2 * np.pi * 55.0 * t) * 0.22
    bass += np.sin(2 * np.pi * 110.0 * t) * 0.10

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
            chord_wave += np.sin(2 * np.pi * f * t_sec) * 0.07
            chord_wave += np.sin(2 * np.pi * f * 2 * t_sec) * 0.025 # warm octave overtone
        harmony[s0:s1] = chord_wave

    # 3. Cinematic Acoustic Pluck / Marimba Melodic Motifs
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
            p_wave = (np.sin(2 * np.pi * freq * p_t) + 0.35 * np.sin(2 * np.pi * freq * 2 * p_t)) * env * 0.15
            s_idx = int(b_time * SR)
            melody[s_idx:s_idx + pluck_len] += p_wave

    # 4. Rhythm & Foley Kinetics
    foley = np.zeros(TOTAL_SAMPLES, dtype=np.float32)
    for b in range(total_beats * 2): # 8th notes
        b_time = b * (beat_dur / 2)
        s_idx = int(b_time * SR)
        tick_len = int(SR * 0.03)
        if s_idx + tick_len < TOTAL_SAMPLES:
            noise = (np.random.rand(tick_len) * 2 - 1) * np.exp(-np.linspace(0, 1, tick_len) * 25.0) * 0.05
            foley[s_idx:s_idx + tick_len] += noise.astype(np.float32)

    bgm = bass + harmony + melody + foley

    # Dynamic speech ducking: calculate voice energy envelope
    voice_abs = np.abs(voice_track)
    kernel_size = int(SR * 0.4) # 400ms smoothing window
    kernel = np.ones(kernel_size) / kernel_size
    voice_env = np.convolve(voice_abs, kernel, mode='same')
    
    # Duck BGM by -3.5 dB (factor ~0.67) when speech is active
    duck_factor = 1.0 - 0.33 * np.clip(voice_env * 3.5, 0.0, 1.0)
    ducked_bgm = bgm * duck_factor

    return ducked_bgm

async def main():
    story = load_story_data()
    voice_track = await synthesize_voice(story)
    bgm_track = generate_bgm(voice_track)

    print("[*] Final audio summing and balancing...")
    final_mix = (bgm_track * 0.55) + (voice_track * 0.90)

    # Peak normalization to -1.0 dBFS
    max_peak = np.max(np.abs(final_mix))
    if max_peak > 0:
        final_mix = final_mix / max_peak * 0.89

    # Convert to stereo
    stereo_mix = np.column_stack((final_mix, final_mix))
    out_path = 'out/mix.wav'
    sf.write(out_path, stereo_mix, SR, subtype='PCM_16')
    print(f"[OK] Master audio track synthesized successfully: {out_path} ({DUR}s at {SR}Hz)")

if __name__ == '__main__':
    asyncio.run(main())
