// Story timeline, camera choreography & micro-shots for Passer Baroe: Detak Jantung 200 Tahun
// Broadcast Three.js r170 simulation with Native Indonesian Documentary Voiceover (DQ - Documenter)

export const DUR = 88.90;

export const OPEN = [0.0, 2.2];
export const CLOSE = [86.5, 88.90];

export const PAGE_TURN_0 = [39.8, 42.6];
export const PAGE_TURN_1 = [59.5, 62.3];
export const PAGE_TURN_2 = [84.0, 86.5]; // epilogue transition

// Chapters for overhead ribbon plaques
export const CHAPTERS = [
  [2.4, 8.0, "BABAK I", "1820 Weltevreden & Piringan Hitam 1927"],
  [43.0, 48.5, "BABAK II", "Benteng Nostalgia di Tengah Badai Digital"],
  [62.8, 68.5, "BABAK III", "Koridor Cagar Budaya & Lompatan Masa Depan"]
];

// Speech bubbles: empty (pure cinematic documentary)
export const BUB = [];

// Subtitle chunks: STRICTLY EMPTY (user requested: "buat tanpa subtittle dulu")
export const SUBS = [];

// 20 Contextual Micro-Shots Schedule & Continuous Spline Trajectory
// [shot_id, t_start, t_end, name, type, camPos, lookAt, fov, focus]
// Camera distances strictly >= 0.35m to prevent papercut pixelation
export const SHOTS = [
  // --- BABAK I: Weltevreden 1820 & Piringan Hitam 1927 (Spread 0) ---
  { id: 1,  t0: 0.0,   t1: 4.5,  name: "Establishing Desk & Book Open",        type: "Establishing Wide",  cam: [0.0, 0.44, 0.65],   look: [0.0, 0.12, 0.15],   fov: 42, focus: 0.59 },
  { id: 2,  t0: 4.5,   t1: 8.8,  name: "Batavia Steam Tram & Horse Carriage",  type: "Subject Tracking",    cam: [0.06, 0.35, 0.49],  look: [0.05, 0.14, 0.13],  fov: 38, focus: 0.41 },
  { id: 3,  t0: 8.8,   t1: 13.0, name: "Colonial Red-Brick Passer Baroe Gate", type: "Medium Architecture", cam: [-0.07, 0.33, 0.46], look: [-0.06, 0.15, 0.14], fov: 36, focus: 0.37 },
  { id: 4,  t0: 13.0,  t1: 17.5, name: "Bombay Silk Merchants & Chinese Shop", type: "Culture Ensemble",   cam: [0.05, 0.32, 0.46],  look: [0.05, 0.14, 0.13],  fov: 36, focus: 0.38 },
  { id: 5,  t0: 17.5,  t1: 22.0, name: "Golden Silk Fabric Cutting Macro",     type: "Extreme Macro",       cam: [0.04, 0.30, 0.44],  look: [0.04, 0.13, 0.13],  fov: 34, focus: 0.35 },
  { id: 6,  t0: 22.0,  t1: 26.5, name: "Toko Populer 1927 Teak Entrance",      type: "Subject Tracking",    cam: [-0.06, 0.32, 0.46], look: [-0.05, 0.15, 0.14], fov: 36, focus: 0.37 },
  { id: 7,  t0: 26.5,  t1: 31.0, name: "Brass Gramophone Needle on Shellac",   type: "Historical Climax",   cam: [-0.04, 0.30, 0.44], look: [-0.04, 0.13, 0.13], fov: 34, focus: 0.35 },
  { id: 8,  t0: 31.0,  t1: 35.5, name: "Indonesia Raya Sheet Music & Quill",   type: "Extreme Macro Detail",cam: [0.03, 0.31, 0.45],  look: [0.03, 0.14, 0.13],  fov: 35, focus: 0.36 },
  { id: 9,  t0: 35.5,  t1: 39.8, name: "First National Anthem Recording POV",   type: "Reaction / POV",      cam: [0.0, 0.35, 0.50],   look: [0.0, 0.14, 0.13],   fov: 38, focus: 0.42 },

  // --- TRANSISI HALAMAN 0 -> 1 ---
  { id: 10, t0: 39.8,  t1: 43.0, name: "Page Turn 0 to Modern Passer Baroe",   type: "Sweep Transition",    cam: [0.0, 0.40, 0.58],   look: [0.0, 0.14, 0.14],   fov: 42, focus: 0.51 },

  // --- BABAK II: Benteng Nostalgia di Tengah Badai Digital (Spread 1) ---
  { id: 11, t0: 43.0,  t1: 47.0, name: "Jakarta Glass Skyscrapers Rise",       type: "Isometric Shift",     cam: [-0.05, 0.34, 0.48], look: [-0.04, 0.15, 0.13], fov: 38, focus: 0.40 },
  { id: 12, t0: 47.0,  t1: 50.5, name: "Modern Pedestrian Arcade Canopy",      type: "Subject Tracking",    cam: [0.06, 0.32, 0.46],  look: [0.06, 0.14, 0.13],  fov: 36, focus: 0.37 },
  { id: 13, t0: 50.5,  t1: 54.0, name: "Vintage Analog Camera Shutter Click",  type: "Extreme Macro Retro", cam: [0.07, 0.30, 0.44],  look: [0.07, 0.13, 0.13],  fov: 34, focus: 0.35 },
  { id: 14, t0: 54.0,  t1: 57.0, name: "Third-Generation Master Tailor Suit",  type: "Artisan Action",      cam: [-0.06, 0.32, 0.45], look: [-0.06, 0.14, 0.13], fov: 36, focus: 0.36 },
  { id: 15, t0: 57.0,  t1: 59.5, name: "Steaming Gang Kelinci Noodle Bowl",    type: "Culinary Heritage",   cam: [0.02, 0.31, 0.45],  look: [0.02, 0.14, 0.13],  fov: 35, focus: 0.36 },

  // --- TRANSISI HALAMAN 1 -> 2 ---
  { id: 16, t0: 59.5,  t1: 62.8, name: "Page Turn 1 to Cyber-Heritage Future", type: "Sweep Transition",    cam: [0.0, 0.40, 0.58],   look: [0.0, 0.14, 0.14],   fov: 42, focus: 0.51 },

  // --- BABAK III: Koridor Cagar Budaya & Lompatan Masa Depan (Spread 2) ---
  { id: 17, t0: 62.8,  t1: 67.5, name: "Futuristic Kinetic Solar Canopy",      type: "Futuristic Panorama", cam: [-0.06, 0.33, 0.47], look: [-0.05, 0.15, 0.13], fov: 37, focus: 0.39 },
  { id: 18, t0: 67.5,  t1: 72.0, name: "Elevated MRT Sky Train Gliding By",    type: "Modern Mobility",     cam: [0.08, 0.33, 0.46],  look: [0.08, 0.15, 0.14],  fov: 36, focus: 0.37 },
  { id: 19, t0: 72.0,  t1: 78.0, name: "24-Hour Vibrant Cultural Night Hub",   type: "Nightlife Hub",       cam: [0.0, 0.34, 0.49],   look: [0.0, 0.14, 0.13],   fov: 38, focus: 0.41 },
  { id: 20, t0: 78.0,  t1: 88.9, name: "Final Golden Pullback: Living Legend", type: "Climax Pullback",     cam: [0.0, 0.48, 0.72],   look: [0.0, 0.12, 0.15],   fov: 44, focus: 0.67 }
];

export function track(t) {
  for (let i = SHOTS.length - 1; i >= 0; i--) {
    const s = SHOTS[i];
    if (t >= s.t0) {
      const u = Math.min(1, Math.max(0, (t - s.t0) / (s.t1 - s.t0)));
      return {
        cam: s.cam,
        look: s.look,
        fov: s.fov,
        focus: s.focus,
        shot: s,
        u
      };
    }
  }
  const s0 = SHOTS[0];
  return { cam: s0.cam, look: s0.look, fov: s0.fov, focus: s0.focus, shot: s0, u: 0 };
}
