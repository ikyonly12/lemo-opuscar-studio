// Story timeline, camera choreography & subtitles for The Hidden Geometry of QWERTY

export const DUR = 104.5;

export const OPEN = [0.0, 2.5];
export const CLOSE = [101.5, 104.5];

export const PAGE_TURN_0 = [24.8, 27.2];
export const PAGE_TURN_1 = [50.4, 52.8];
export const PAGE_TURN_2 = [75.7, 78.1];

// Chapters for overhead ribbon banners
export const CHAPTERS = [
  [2.8, 7.5, "BABAK I", "Misteri Huruf Acak di Layar Kaca"],
  [27.5, 32.5, "BABAK II", "Bengkel Milwaukee 1873 & Krisis Tuas"],
  [53.0, 58.0, "BABAK III", "Matriks Anti-Macet & Kode Morse"],
  [78.5, 83.5, "BABAK IV", "Kutukan Memori Otot di Era Digital"]
];

// Character speech bubbles: [who, start, end, text]
export const BUB = [
  ['user', 13.4, 18.0, "Kenapa tidak berurutan saja A-B-C-D?"],
  ['sholes', 48.0, 50.2, "Tuasnya bertubrukan dan tersangkut lagi!"]
];

// Subtitle chunks (Clean, single-line, 2 to 5 words max, strictly lower-third)
export const SUBS = [
  [2.8, 3.42, "Setiap hari,"],
  [3.42, 4.86, "miliaran jari kita menari di"],
  [4.86, 6.4, "atas keyboard laptop dan layar"],
  [6.4, 7.38, "kaca ponsel cerdas."],

  [7.8, 9.02, "Namun pernahkah Anda heran,"],
  [9.02, 10.64, "mengapa susunan hurufnya begitu acak"],
  [10.64, 11.77, "dan huruf A diletakkan di"],
  [11.77, 12.95, "bawah kelingking terlemah?"],

  [13.4, 18.16, "Kenapa tidak berurutan seperti A-B-C-D?"],

  [18.6, 20.38, "Banyak orang percaya mitos bahwa"],
  [20.38, 22.16, "keyboard sengaja dibuat lambat."],
  [22.16, 24.38, "Padahal faktanya justru kebalikan total."],

  [27.5, 29.5, "Semua bermula dari krisis mekanis"],
  [29.5, 31.8, "di bengkel Milwaukee tahun 1873,"],
  [31.8, 34.5, "saat Christopher Sholes merakit mesin tik."],

  [35.0, 37.2, "Pada rancangan awal, batang huruf"],
  [37.2, 39.0, "menggantung melingkar di dalam keranjang"],
  [39.0, 40.06, "besi di bawah kertas."],

  [40.6, 42.8, "Kelemahannya fatal: saat tombol ditekan,"],
  [42.8, 45.2, "tuas besi berdekatan berayun bersamaan,"],
  [45.2, 47.65, "bertubrukan keras dan macet total."],

  [48.0, 49.93, "Tuasnya bertubrukan dan tersangkut lagi!"],

  [53.0, 55.2, "Untuk memecahkan kebuntuan mekanik ini,"],
  [55.2, 58.05, "Sholes membedah frekuensi pasangan huruf."],

  [58.5, 60.8, "Kombinasi umum seperti T-H, S-T,"],
  [60.8, 62.8, "dan E-R sengaja dipisahkan jauh"],
  [62.8, 64.56, "ke sisi keranjang yang berseberangan."],

  [65.0, 67.2, "Dengan posisi fisik yang berlawanan,"],
  [67.2, 69.91, "tuas besi tidak lagi bertubrukan."],

  [70.4, 72.8, "Susunan ini langsung diadopsi operator"],
  [72.8, 75.29, "telegraf Morse untuk mengetik kilat."],

  [78.3, 80.5, "Mesin tik Remington kemudian memproduksi"],
  [80.5, 82.62, "tata letak QWERTY ke seluruh dunia."],

  [83.1, 85.2, "Kini di era modern, tidak ada lagi"],
  [85.2, 87.86, "tuas besi yang bisa macet di layar ponsel."],

  [88.3, 90.8, "Namun tata letak alternatif seperti Dvorak"],
  [90.8, 92.5, "selalu gagal karena miliaran jari"],
  [92.5, 94.02, "telah terikat memori otot permanen."],

  [94.5, 97.2, "Sebuah solusi kemacetan mekanik 1873,"],
  [97.2, 100.98, "yang kini menjadi takdir digital manusia."]
];

// 19 Contextual Micro-Shots Schedule & Camera Spline Trajectory
// [shot_id, t_start, t_end, name, type, camPos, lookAt, fov, focus]
export const SHOTS = [
  // Spread 0 (Modern Desk)
  { id: 1,  t0: 0.0,   t1: 3.8,   name: "Establishing Desk & Book Open",   type: "Establishing Wide",  cam: [0.0, 0.44, 0.65],  look: [0.0, 0.12, 0.15], fov: 42, focus: 0.58 },
  { id: 2,  t0: 3.8,   t1: 7.5,   name: "Smartphone Pop-up Reveal",        type: "Subject Tracking",    cam: [0.06, 0.32, 0.42], look: [0.06, 0.15, 0.12], fov: 38, focus: 0.38 },
  { id: 3,  t0: 7.5,   t1: 11.0,  name: "Typist Character Reaction",       type: "Reaction Cut",        cam: [-0.08, 0.28, 0.38], look: [-0.08, 0.16, 0.14], fov: 36, focus: 0.34 },
  { id: 4,  t0: 11.0,  t1: 14.5,  name: "Macro Detail on Letter 'A'",      type: "Extreme Macro",       cam: [0.08, 0.24, 0.28], look: [0.08, 0.15, 0.12], fov: 30, focus: 0.26 },
  { id: 5,  t0: 14.5,  t1: 18.5,  name: "User Puzzled Speech Bubble",      type: "POV / Reaction",      cam: [-0.06, 0.26, 0.36], look: [-0.04, 0.16, 0.13], fov: 36, focus: 0.32 },
  { id: 6,  t0: 18.5,  t1: 24.8,  name: "Myth Debunking Wide Angle",       type: "Establishing Wide",   cam: [0.0, 0.36, 0.52],  look: [0.0, 0.14, 0.14], fov: 40, focus: 0.46 },

  // Spread 1 (1873 Milwaukee Machine Shop)
  { id: 7,  t0: 24.8,  t1: 27.2,  name: "Page Turn 0 to 1873 Workshop",    type: "Sweep Transition",    cam: [0.0, 0.40, 0.58],  look: [0.0, 0.14, 0.14], fov: 42, focus: 0.50 },
  { id: 8,  t0: 27.2,  t1: 31.0,  name: "Milwaukee Workshop Establishing", type: "Establishing Wide",  cam: [-0.04, 0.34, 0.48], look: [-0.02, 0.15, 0.13], fov: 38, focus: 0.42 },
  { id: 9,  t0: 31.0,  t1: 35.0,  name: "Christopher Sholes at Workbench", type: "Subject Tracking",    cam: [-0.09, 0.28, 0.38], look: [-0.09, 0.16, 0.15], fov: 34, focus: 0.34 },
  { id: 10, t0: 35.0,  t1: 40.5,  name: "Top-Down Circular Typebar Basket",type: "Isometric Diagram",   cam: [0.07, 0.42, 0.32], look: [0.07, 0.10, 0.12], fov: 36, focus: 0.38 },
  { id: 11, t0: 40.5,  t1: 45.0,  name: "Macro Typebars Clash & Spark",    type: "Extreme Macro",       cam: [0.07, 0.22, 0.24], look: [0.07, 0.12, 0.12], fov: 28, focus: 0.22 },
  { id: 12, t0: 45.0,  t1: 50.4,  name: "Sholes Frustrated Reaction Cut",  type: "Reaction Cut",        cam: [-0.09, 0.27, 0.36], look: [-0.09, 0.16, 0.15], fov: 34, focus: 0.32 },

  // Spread 2 (Digraph Frequency Matrix & Morse Telegraph)
  { id: 13, t0: 50.4,  t1: 52.8,  name: "Page Turn 1 to Telegraph Office", type: "Sweep Transition",    cam: [0.0, 0.40, 0.58],  look: [0.0, 0.14, 0.14], fov: 42, focus: 0.50 },
  { id: 14, t0: 52.8,  t1: 58.0,  name: "Digraph Frequency Matrix Board",  type: "Isometric Diagram",   cam: [-0.08, 0.30, 0.38], look: [-0.08, 0.15, 0.11], fov: 35, focus: 0.34 },
  { id: 15, t0: 58.0,  t1: 64.0,  name: "Macro Reallocation Vectors 180°", type: "Extreme Macro",       cam: [-0.06, 0.24, 0.29], look: [-0.06, 0.14, 0.11], fov: 30, focus: 0.26 },
  { id: 16, t0: 64.0,  t1: 70.0,  name: "Morse Operator Tapping Telegraph",type: "Subject Tracking",    cam: [0.09, 0.28, 0.37], look: [0.09, 0.15, 0.14], fov: 34, focus: 0.33 },
  { id: 17, t0: 70.0,  t1: 75.7,  name: "Flawless High-Speed Typing Cut",  type: "Establishing Wide",   cam: [0.0, 0.34, 0.50],  look: [0.0, 0.14, 0.13], fov: 38, focus: 0.44 },

  // Spread 3 (Modern Path Dependency & Epilogue)
  { id: 18, t0: 75.7,  t1: 78.1,  name: "Page Turn 2 to Modern Epilogue",  type: "Sweep Transition",    cam: [0.0, 0.40, 0.58],  look: [0.0, 0.14, 0.14], fov: 42, focus: 0.50 },
  { id: 19, t0: 78.1,  t1: 85.0,  name: "Remington to Smartphone Morph",   type: "Subject Tracking",    cam: [0.08, 0.30, 0.40], look: [0.08, 0.15, 0.13], fov: 36, focus: 0.36 },
  { id: 20, t0: 85.0,  t1: 92.0,  name: "Dvorak vs QWERTY Muscle Memory",  type: "Isometric Diagram",   cam: [-0.07, 0.29, 0.38], look: [-0.07, 0.15, 0.11], fov: 34, focus: 0.34 },
  { id: 21, t0: 92.0,  t1: 99.0,  name: "Global Digital Hands Collage",    type: "Establishing Wide",   cam: [0.0, 0.34, 0.48],  look: [0.0, 0.14, 0.12], fov: 38, focus: 0.42 },
  { id: 22, t0: 99.0,  t1: 104.5, name: "Book Closes on Walnut Desk",      type: "Epilogue Pullback",   cam: [0.0, 0.48, 0.72],  look: [0.0, 0.12, 0.15], fov: 44, focus: 0.65 }
];
