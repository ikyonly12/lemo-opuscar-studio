// Story timeline for The Airplane Window Breather Hole

export const DUR = 99.0;

// Subtitle chunks (Clean, single-line, 2 to 5 words, strictly lower-third)
// [t0, t1, text]
export const SUBS = [
  [3.40, 5.20, "Pernahkah Anda memperhatikan"],
  [5.20, 6.40, "lubang jarum mungil di jendela"],
  [6.40, 7.25, "pesawat saat terbang?"],
  [8.50, 10.70, "Banyak penumpang cemas mengira jendela retak,"],
  [10.70, 13.00, "atau kabin mengalami kebocoran udara berbahaya."],
  [17.20, 19.40, "Padahal, lubang sekecil ini memikul rahasia"],
  [19.40, 22.00, "keselamatan terbesar dalam sejarah kedirgantaraan."],
  [26.80, 28.70, "Semua bermula dari tragedi kelam"],
  [28.70, 30.30, "tahun 1954 pada pesawat jet"],
  [30.30, 31.85, "komersial pertama di dunia,"],
  [31.85, 33.00, "de Havilland Comet."],
  [34.00, 35.80, "Pesawat jet tersebut tiba-tiba hancur"],
  [35.80, 37.85, "berkeping-keping di angkasa tanpa peringatan."],
  [42.50, 45.00, "Penyelidikan membuktikan: jendela persegi menciptakan"],
  [45.00, 47.15, "konsentrasi tegangan dahsyat di sudut-sudutnya"],
  [47.15, 48.45, "hingga badan pesawat robek."],
  [54.50, 57.50, "Sejak itu, seluruh jendela pesawat"],
  [57.50, 60.25, "diubah oval dengan tiga lapis akrilik."],
  [61.50, 63.80, "Lubang jarum ini dinamakan breather hole,"],
  [63.80, 65.50, "berada persis di kaca tengah"],
  [65.50, 66.80, "untuk mengalirkan tekanan udara."],
  [68.00, 70.30, "Dengan lubang ini, perbedaan tekanan udara"],
  [70.30, 72.70, "ditanggung aman oleh kaca terluar yang tebal."],
  [78.80, 81.80, "Selain tekanan, sirkulasi lubang ini juga"],
  [81.80, 83.50, "membuang kelembapan kabin agar kaca"],
  [83.50, 85.30, "tidak membeku pada suhu minus lima puluh derajat."],
  [89.50, 91.50, "Sebuah lubang jarum sederhana,"],
  [91.50, 93.70, "penjaga nyawa jutaan manusia di angkasa."]
];

// Character bubbles: [who, start, end, text]
export const BUB = [
  ['passenger', 15.0, 17.6, "Tunggu, apa jendela ini retak?!"],
  ['engineer', 39.5, 41.8, "Sudut tajam jendela merobek logam!"],
  ['passenger', 86.2, 88.8, "Pemandangannya sungguh menakjubkan."]
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
