// Story timeline, camera choreography & subtitles for The Hidden Geometry of QWERTY
// Broadcast Three.js r170 simulation with DQ - Documenter Native Indonesian Voiceover

export const DUR = 117.07;

export const OPEN = [0.0, 2.4];
export const CLOSE = [114.27, 117.07];

export const PAGE_TURN_0 = [25.59, 27.79];
export const PAGE_TURN_1 = [53.85, 56.05];
export const PAGE_TURN_2 = [83.05, 85.25];

// Chapters for overhead ribbon banners
export const CHAPTERS = [
  [2.5, 7.5, "BABAK I", "Misteri Huruf Acak di Layar Kaca"],
  [28.0, 33.0, "BABAK II", "Bengkel Milwaukee 1873 & Krisis Tuas"],
  [56.5, 61.5, "BABAK III", "Matriks Anti-Macet & Kode Morse"],
  [85.5, 90.5, "BABAK IV", "Kutukan Memori Otot di Era Digital"]
];

// Character speech bubbles: [who, start, end, text]
export const BUB = [
  ['user', 15.38, 18.69, "Kenapa tidak berurutan saja A-B-C-D?"],
  ['sholes', 51.15, 53.55, "Tuasnya bertubrukan dan tersangkut lagi!"]
];

// Subtitle chunks (Clean, single-line, 2 to 5 words max, strictly lower-third)
export const SUBS = [
  [2.5, 3.23, "Setiap hari,"],
  [3.23, 4.94, "miliaran jari kita menari di"],
  [4.94, 6.77, "atas keyboard laptop dan layar"],
  [6.77, 7.93, "kaca ponsel cerdas."],
  [8.23, 9.85, "Namun pernahkah Anda heran,"],
  [9.85, 12.02, "mengapa susunan hurufnya begitu acak"],
  [12.02, 13.52, "dan huruf A diletakkan di"],
  [13.52, 15.08, "bawah kelingking terlemah?"],
  [15.38, 18.69, "Kenapa tidak berurutan saja seperti A-B-C-D?"],
  [18.99, 20.93, "Banyak orang percaya mitos bahwa"],
  [20.93, 22.87, "keyboard sengaja dibuat lambat ."],
  [22.87, 25.29, "Padahal faktanya justru kebalikan total."],
  [27.99, 30.25, "Semua bermula dari krisis mekanis"],
  [30.25, 32.44, "di bengkel Milwaukee tahun 1873,"],
  [32.44, 35.04, "saat Christopher Latham Sholes merakit"],
  [35.04, 36.27, "mesin tik pertama."],
  [36.57, 37.66, "Pada rancangan awal,"],
  [37.66, 39.95, "batang-batang huruf dari logam menggantung"],
  [39.95, 41.76, "melingkar di dalam keranjang besi"],
  [41.76, 42.63, "di bawah kertas."],
  [42.93, 45.87, "Kelemahannya fatal: saat tombol ditekan cepat,"],
  [45.87, 48.68, "tuas-tuas besi berdekatan berayun bersamaan,"],
  [48.68, 49.83, "bertubrukan keras,"],
  [49.83, 50.85, "dan macet total."],
  [51.15, 53.55, "Tuasnya bertubrukan dan tersangkut lagi!"],
  [56.25, 58.05, "Untuk memecahkan kebuntuan ini,"],
  [58.05, 60.37, "Sholes membedah frekuensi pasangan huruf"],
  [60.37, 62.52, "yang paling sering diketik berurutan."],
  [62.82, 64.77, "Kombinasi umum seperti T-H, S-T,"],
  [64.77, 66.78, "dan E-R sengaja dipisahkan sejauh"],
  [66.78, 69.52, "mungkin ke sisi keranjang yang berseberangan."],
  [69.82, 71.96, "Dengan posisi fisik yang berlawanan,"],
  [71.96, 74.16, "tuas-tuas besi tidak lagi bertubrukan"],
  [74.16, 75.76, "saat berayun ke pita tinta."],
  [76.06, 78.37, "Susunan ini langsung diadopsi operator"],
  [78.37, 80.56, "telegraf kode Morse yang membutuhkan"],
  [80.56, 82.75, "pengetikan kilat tanpa pernah macet."],
  [85.45, 87.89, "Mesin tik Remington kemudian memproduksi"],
  [87.89, 89.78, "tata letak QWERTY secara massal"],
  [89.78, 91.3, "ke seluruh penjuru dunia."],
  [91.6, 92.79, "Kini di era modern,"],
  [92.79, 94.29, "tidak ada lagi tuas besi"],
  [94.29, 96.04, "maupun kabel yang bisa macet"],
  [96.04, 98.04, "di balik kaca layar sentuh kita."],
  [98.34, 100.36, "Namun tata letak alternatif yang"],
  [100.36, 102.07, "lebih efisien selalu gagal,"],
  [102.07, 104.22, "karena miliaran jari manusia telah"],
  [104.22, 106.05, "terikat memori otot permanen."],
  [106.35, 109.53, "Sebuah solusi kemacetan mekanik tahun 1873,"],
  [109.53, 111.9, "yang kini menjadi takdir digital"],
  [111.9, 113.97, "jemari seluruh umat manusia."]
];

// 22 Contextual Micro-Shots Schedule & Continuous Spline Trajectory
// [shot_id, t_start, t_end, name, type, camPos, lookAt, fov, focus]
// All camera distances calibrated to >= 0.354m to prevent papercut pixelation
export const SHOTS = [
  // Spread 0 (Modern Studio)
  { id: 1,  t0: 0.0,    t1: 4.2,    name: "Establishing Desk & Book Open",   type: "Establishing Wide",  cam: [0.0, 0.44, 0.65],   look: [0.0, 0.12, 0.15],  fov: 42, focus: 0.59 },
  { id: 2,  t0: 4.2,    t1: 8.2,    name: "Smartphone Pop-up Reveal",        type: "Subject Tracking",    cam: [0.05, 0.34, 0.48],  look: [0.05, 0.14, 0.13], fov: 38, focus: 0.40 },
  { id: 3,  t0: 8.2,    t1: 12.0,   name: "Typist Character Reaction",       type: "Reaction Cut",        cam: [-0.07, 0.32, 0.46], look: [-0.07, 0.15, 0.14], fov: 36, focus: 0.36 },
  { id: 4,  t0: 12.0,   t1: 15.4,   name: "Medium Close-up on Letter 'A'",   type: "Medium Close-Up",     cam: [0.05, 0.32, 0.46],  look: [0.05, 0.14, 0.13], fov: 36, focus: 0.38 },
  { id: 5,  t0: 15.4,   t1: 19.0,   name: "User Puzzled Speech Bubble",      type: "POV / Reaction",      cam: [-0.05, 0.32, 0.46], look: [-0.04, 0.15, 0.13], fov: 36, focus: 0.37 },
  { id: 6,  t0: 19.0,   t1: 25.59,  name: "Myth Debunking Wide Angle",       type: "Establishing Wide",   cam: [0.0, 0.36, 0.52],   look: [0.0, 0.14, 0.14],  fov: 40, focus: 0.44 },

  // Spread 1 (1873 Milwaukee Machine Shop)
  { id: 7,  t0: 25.59,  t1: 27.79,  name: "Page Turn 0 to 1873 Workshop",    type: "Sweep Transition",    cam: [0.0, 0.40, 0.58],   look: [0.0, 0.14, 0.14],  fov: 42, focus: 0.51 },
  { id: 8,  t0: 27.79,  t1: 32.0,   name: "Milwaukee Workshop Establishing", type: "Establishing Wide",  cam: [-0.04, 0.34, 0.48],  look: [-0.02, 0.15, 0.13], fov: 38, focus: 0.40 },
  { id: 9,  t0: 32.0,   t1: 36.5,   name: "Christopher Sholes at Workbench", type: "Subject Tracking",    cam: [-0.08, 0.32, 0.46], look: [-0.08, 0.15, 0.14], fov: 36, focus: 0.36 },
  { id: 10, t0: 36.5,   t1: 42.8,   name: "Top-Down Circular Typebar Basket",type: "Isometric Diagram",   cam: [0.06, 0.40, 0.44],  look: [0.06, 0.12, 0.13], fov: 36, focus: 0.42 },
  { id: 11, t0: 42.8,   t1: 48.0,   name: "Medium Close-up Typebars Clash",  type: "Medium Close-Up",     cam: [0.06, 0.32, 0.45],  look: [0.06, 0.13, 0.13], fov: 36, focus: 0.37 },
  { id: 12, t0: 48.0,   t1: 53.85,  name: "Sholes Frustrated Reaction Cut",  type: "Reaction Cut",        cam: [-0.08, 0.32, 0.45], look: [-0.08, 0.15, 0.14], fov: 36, focus: 0.35 },

  // Spread 2 (Digraph Frequency Matrix & Morse Telegraph)
  { id: 13, t0: 53.85,  t1: 56.05,  name: "Page Turn 1 to Telegraph Office", type: "Sweep Transition",    cam: [0.0, 0.40, 0.58],   look: [0.0, 0.14, 0.14],  fov: 42, focus: 0.51 },
  { id: 14, t0: 56.05,  t1: 62.5,   name: "Digraph Frequency Matrix Board",  type: "Isometric Diagram",   cam: [-0.07, 0.32, 0.46], look: [-0.07, 0.15, 0.12], fov: 36, focus: 0.38 },
  { id: 15, t0: 62.5,   t1: 69.5,   name: "Reallocation Vectors Separation", type: "Medium Close-Up",     cam: [-0.05, 0.32, 0.45], look: [-0.05, 0.15, 0.12], fov: 36, focus: 0.37 },
  { id: 16, t0: 69.5,   t1: 76.0,   name: "Morse Operator Tapping Telegraph",type: "Subject Tracking",    cam: [0.08, 0.32, 0.46],  look: [0.08, 0.15, 0.14], fov: 36, focus: 0.36 },
  { id: 17, t0: 76.0,   t1: 83.05,  name: "Flawless High-Speed Typing Cut",  type: "Establishing Wide",   cam: [0.0, 0.34, 0.50],   look: [0.0, 0.14, 0.13],  fov: 38, focus: 0.42 },

  // Spread 3 (Modern Path Dependency & Epilogue)
  { id: 18, t0: 83.05,  t1: 85.25,  name: "Page Turn 2 to Modern Epilogue",  type: "Sweep Transition",    cam: [0.0, 0.40, 0.58],   look: [0.0, 0.14, 0.14],  fov: 42, focus: 0.51 },
  { id: 19, t0: 85.25,  t1: 92.0,   name: "Remington to Smartphone Morph",   type: "Subject Tracking",    cam: [0.07, 0.32, 0.46],  look: [0.07, 0.15, 0.13], fov: 36, focus: 0.37 },
  { id: 20, t0: 92.0,   t1: 99.0,   name: "Dvorak vs QWERTY Muscle Memory",  type: "Isometric Diagram",   cam: [-0.06, 0.32, 0.46], look: [-0.06, 0.15, 0.12], fov: 36, focus: 0.38 },
  { id: 21, t0: 99.0,   t1: 106.5,  name: "Global Digital Hands Collage",    type: "Establishing Wide",   cam: [0.0, 0.34, 0.48],   look: [0.0, 0.14, 0.12],  fov: 38, focus: 0.41 },
  { id: 22, t0: 106.5,  t1: 117.07, name: "Book Closes on Walnut Desk",      type: "Epilogue Pullback",   cam: [0.0, 0.48, 0.72],   look: [0.0, 0.12, 0.15],  fov: 44, focus: 0.67 }
];
