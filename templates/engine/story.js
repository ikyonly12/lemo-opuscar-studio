// Story timeline for The Airplane Window Breather Hole

export const DUR = 99.0;

// Subtitle chunks (generated from voices/dur.json and chunk_subtitles.py)
// [t0, t1, text]
export const SUBS = [
  [3.40, 5.71, "Pernahkah Anda memperhatikan lubang jarum"],
  [5.71, 7.40, "mungil di bagian bawah jendela"],
  [7.40, 8.58, "pesawat saat terbang?"],
  [9.20, 11.98, "Banyak penumpang cemas mengira jendela retak,"],
  [11.98, 14.88, "atau kabin mengalami kebocoran udara berbahaya."],
  [17.20, 20.35, "Padahal, lubang sekecil ini memikul rahasia"],
  [20.35, 23.12, "keselamatan terbesar dalam sejarah kedirgantaraan."],
  [26.50, 30.22, "Semua bermula dari tragedi kelam tahun 1954"],
  [30.22, 32.55, "pada pesawat jet komersial pertama di dunia,"],
  [32.55, 34.49, "de Havilland Comet."],
  [35.00, 37.82, "Pesawat jet tersebut tiba-tiba hancur"],
  [37.82, 40.41, "berkeping-keping di angkasa tanpa peringatan apa pun."],
  [43.50, 47.05, "Penyelidikan membuktikan: jendela persegi menciptakan"],
  [47.05, 49.25, "konsentrasi tegangan dahsyat di sudut-sudutnya"],
  [49.25, 50.88, "hingga badan pesawat robek."],
  [54.20, 57.65, "Sejak itu, seluruh jendela pesawat diubah menjadi oval"],
  [57.65, 59.85, "dan dirancang dengan tiga lapisan akrilik"],
  [59.85, 61.34, "berteknologi tinggi."],
  [61.80, 65.12, "Lubang jarum ini dinamakan breather hole,"],
  [65.12, 67.25, "berada persis di lapisan kaca tengah"],
  [67.25, 68.65, "untuk mengalirkan tekanan udara."],
  [69.00, 72.15, "Dengan lubang ini, perbedaan tekanan udara raksasa"],
  [72.15, 74.20, "ditanggung aman oleh kaca terluar"],
  [74.20, 75.32, "yang paling tebal."],
  [78.80, 82.55, "Selain menjaga tekanan, sirkulasi lubang ini juga membuang"],
  [82.55, 84.85, "kelembapan udara kabin agar kaca tidak membeku"],
  [84.85, 86.94, "pada suhu minus lima puluh derajat."],
  [89.80, 92.25, "Sebuah lubang jarum sederhana,"],
  [92.25, 94.60, "penjaga nyawa jutaan manusia yang melayang di angkasa."]
];

// Character bubbles: [who, start, end, text]
export const BUB = [
  ['passenger', 15.2, 17.0, "Tunggu, apa jendela ini retak?!"],
  ['engineer', 40.8, 43.2, "Sudut tajam jendela merobek logam!"],
  ['passenger', 87.2, 89.4, "Pemandangannya sungguh menakjubkan."]
];

// Chapters for overhead ribbon banners
export const CHAPTERS = [
  [3.0, 6.5, "BABAK I", "Misteri Lubang Kabin"],
  [26.0, 29.5, "BABAK II", "Tragedi Jendela Persegi 1954"],
  [53.8, 57.2, "BABAK III", "Tiga Lapis & Breather Hole"],
  [78.5, 82.0, "BABAK AKHIR", "Penyelamat Senyap di Ketinggian"]
];

// Title plaque on the front cover of the pop-up book
export const COVER_TITLE = "Rahasia Jendela Pesawat";
export const COVER_SUBTITLE = "The Airplane Window Breather Hole";

// Book mechanism timings
export const OPEN = [2.0, 4.4];                                     // cover opens
export const TURNS = [[23.6, 26.2], [51.2, 53.8], [75.8, 78.4]];   // three page turns
export const CLOSE = [95.0, 98.2];                                   // book closes cleanly
