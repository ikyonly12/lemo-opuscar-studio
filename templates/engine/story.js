// Story timeline, camera choreography & micro-shots for Passer Baroe: Detak Jantung 200 Tahun (Myeongdong Edition)
// Broadcast Three.js r170 simulation with Native Indonesian Documentary Voiceover (id-ID-ArdiNeural)

export const DUR = 95.50;

export const OPEN = [0.0, 2.2];
export const CLOSE = [93.0, 95.50];

export const PAGE_TURN_0 = [28.8, 30.8]; // Spread 0 -> Spread 1 (Weltevreden -> Toko Populer 1927)
export const PAGE_TURN_1 = [42.0, 44.2]; // Spread 1 -> Spread 2 (Toko Populer -> Masa Kini)
export const PAGE_TURN_2 = [62.0, 64.2]; // Spread 2 -> Spread 3 (Masa Kini -> Myeongdong Jakarta 2027+)
export const PAGE_TURN_3 = [84.8, 87.0]; // Spread 3 -> Epilog

// Chapters for overhead ribbon plaques
export const CHAPTERS = [
  [2.4, 8.5, "BABAK I", "1820 Weltevreden & Toko Kompak Mayor Tionghoa"],
  [30.5, 36.5, "BABAK II", "1927 Perekaman Piringan Hitam Indonesia Raya"],
  [44.5, 50.5, "BABAK III", "Benteng Tradisi: Penjahit Bombay, Kamera & Gang Kelinci"],
  [64.5, 71.0, "BABAK IV", "Visi 2027+: Revitalisasi Pasar Baru ala Myeongdong"]
];

// Speech bubbles: empty (pure cinematic documentary)
export const BUB = [];

// Subtitle chunks: STRICTLY EMPTY (user requested: "buat tanpa subtittle dulu")
export const SUBS = [];

// 20 Contextual Micro-Shots Schedule & Continuous Spline Trajectory
// [shot_id, t_start, t_end, name, type, camPos, lookAt, fov, focus]
export const SHOTS = [
  // --- BABAK I: Weltevreden 1820 & Toko Kompak (Spread 0) ---
  { id: 1,  t0: 0.0,   t1: 4.5,  name: "Establishing Desk & Book Opening",       type: "Establishing Wide",  cam: [0.0, 0.44, 0.65],   look: [0.0, 0.12, 0.15],   fov: 42, focus: 0.59 },
  { id: 2,  t0: 4.5,   t1: 9.8,  name: "Batavia Horse Tram & Weltevreden Origin", type: "Subject Tracking",    cam: [0.06, 0.35, 0.49],  look: [0.05, 0.14, 0.13],  fov: 38, focus: 0.41 },
  { id: 3,  t0: 9.8,   t1: 15.0, name: "Passer Baroe Gate & Daendels Plaque",    type: "Colonial Architecture",cam: [-0.07, 0.33, 0.46],look: [-0.06, 0.15, 0.14], fov: 36, focus: 0.37 },
  { id: 4,  t0: 15.0,  t1: 20.8, name: "Toko Kompak Mayor Tionghoa 1800s",       type: "Heritage Medium",    cam: [0.07, 0.32, 0.46],  look: [0.07, 0.14, 0.13],  fov: 36, focus: 0.38 },
  { id: 5,  t0: 20.8,  t1: 25.0, name: "Bombay Silk Merchants & Silk Bolts",     type: "Culture Ensemble",   cam: [-0.05, 0.31, 0.45], look: [-0.05, 0.13, 0.13], fov: 35, focus: 0.36 },
  { id: 6,  t0: 25.0,  t1: 28.8, name: "Batavia Evening Twilight & Turn Prep",   type: "Reaction / POV",      cam: [0.0, 0.34, 0.48],   look: [0.0, 0.14, 0.13],   fov: 38, focus: 0.40 },

  // --- BABAK II: Perekaman Piringan Hitam 1927 (Spread 1) ---
  { id: 7,  t0: 28.8,  t1: 33.0, name: "Toko Populer 1927 Facade Sweep",         type: "Historical Climax",   cam: [-0.06, 0.32, 0.46], look: [-0.05, 0.15, 0.14], fov: 36, focus: 0.37 },
  { id: 8,  t0: 33.0,  t1: 37.5, name: "Brass Gramophone & Shellac 78 RPM",      type: "Extreme Macro Detail",cam: [-0.04, 0.29, 0.43], look: [-0.04, 0.13, 0.13], fov: 34, focus: 0.34 },
  { id: 9,  t0: 37.5,  t1: 42.0, name: "W.R. Soepratman Violin & Original Score", type: "Historical Macro",   cam: [0.05, 0.30, 0.44],  look: [0.05, 0.14, 0.13],  fov: 35, focus: 0.35 },

  // --- BABAK III: Benteng Tradisi Masa Kini (Spread 2) ---
  { id: 10, t0: 42.0,  t1: 46.5, name: "Pasar Baru Modern Arcade Promenade",     type: "Establishing Arcade",cam: [0.0, 0.34, 0.48],   look: [0.0, 0.14, 0.13],   fov: 38, focus: 0.40 },
  { id: 11, t0: 46.5,  t1: 51.0, name: "Harioms Bombay Bespoke Tailors & Wool",   type: "Artisan Tracking",    cam: [-0.06, 0.31, 0.45], look: [-0.06, 0.14, 0.13], fov: 35, focus: 0.36 },
  { id: 12, t0: 51.0,  t1: 55.0, name: "Vintage 35mm Analog Camera Showcase",    type: "Vintage Macro",       cam: [0.06, 0.30, 0.44],  look: [0.06, 0.13, 0.13],  fov: 34, focus: 0.35 },
  { id: 13, t0: 55.0,  t1: 58.5, name: "Gang Kelinci Steaming Noodle Bowl",      type: "Culinary Sensory",    cam: [0.01, 0.28, 0.42],  look: [0.01, 0.12, 0.13],  fov: 33, focus: 0.33 },
  { id: 14, t0: 58.5,  t1: 62.0, name: "Toko Sepatu Bata 1931 & Heritage Wall",  type: "Medium Architecture", cam: [0.07, 0.32, 0.46],  look: [0.07, 0.14, 0.13],  fov: 36, focus: 0.38 },

  // --- BABAK IV: Visi Revitalisasi 2027+ "Myeongdong Jakarta" (Spread 3) ---
  { id: 15, t0: 62.0,  t1: 67.0, name: "Restored Gateway & Warm Bistro Lights",   type: "Atmospheric Wide",    cam: [0.0, 0.35, 0.50],   look: [0.0, 0.14, 0.13],   fov: 38, focus: 0.42 },
  { id: 16, t0: 67.0,  t1: 72.0, name: "Myeongdong 24-Hr Street Food Carts",      type: "Street Food Medium",  cam: [0.06, 0.31, 0.45],  look: [0.06, 0.13, 0.13],  fov: 35, focus: 0.36 },
  { id: 17, t0: 72.0,  t1: 76.5, name: "Acoustic Live Busking Stage & Guitar",    type: "Cultural Performance",cam: [-0.02, 0.29, 0.43], look: [-0.02, 0.13, 0.13], fov: 34, focus: 0.34 },
  { id: 18, t0: 76.5,  t1: 81.0, name: "MRT Harmoni Wayfinding & Low Emission",   type: "Wayfinding Totem",    cam: [-0.08, 0.31, 0.45], look: [-0.08, 0.14, 0.13], fov: 35, focus: 0.36 },
  { id: 19, t0: 81.0,  t1: 85.5, name: "Vibrant Nightlife Promenade & Fashion",   type: "Nightlife Tracking",  cam: [0.0, 0.34, 0.48],   look: [0.0, 0.14, 0.13],   fov: 38, focus: 0.40 },

  // --- EPILOG & CLIMAX: 200 Tahun Passer Baroe (Spread 4) ---
  { id: 20, t0: 85.5,  t1: 95.5, name: "200-Year Historic Seal Climax",          type: "Monumental Climax",   cam: [0.0, 0.42, 0.62],   look: [0.0, 0.13, 0.14],   fov: 42, focus: 0.54 }
];
