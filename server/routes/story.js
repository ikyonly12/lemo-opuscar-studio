import express from 'express';
import fs from 'fs';
import path from 'path';
import os from 'os';

const router = express.Router();
const pluginHistoryPath = 'C:\\Users\\Kenzie kafi\\.gemini\\config\\plugins\\lemo-opuscar\\history.json';
const homeHistoryPath = path.join(os.homedir(), 'lemo-opuscar', 'history.json');

function getHistory() {
  try {
    const targetPath = fs.existsSync(pluginHistoryPath) ? pluginHistoryPath : homeHistoryPath;
    if (fs.existsSync(targetPath)) {
      return JSON.parse(fs.readFileSync(targetPath, 'utf8'));
    }
  } catch (e) {
    console.error('Error reading history:', e);
  }
  return { selected_stories: [] };
}

function saveHistory(entry) {
  try {
    const targetPath = fs.existsSync(pluginHistoryPath) ? pluginHistoryPath : homeHistoryPath;
    const history = getHistory();
    history.selected_stories.push(entry);
    fs.writeFileSync(targetPath, JSON.stringify(history, null, 2), 'utf8');
    return true;
  } catch (e) {
    console.error('Error saving history:', e);
    return false;
  }
}

router.get('/history', (req, res) => {
  res.json(getHistory());
});

// Pitch 3 modern-relatable story ideas
router.post('/pitch', (req, res) => {
  const history = getHistory();
  const pastTitles = new Set(history.selected_stories.map(s => s.title.toLowerCase()));

  // Fresh candidate pool following Lemo-Opuscar formula
  const candidatePool = [
    {
      id: 'traffic-light-yellow-physics',
      title: 'The Dilemma Zone: The Mathematical Trap Behind Yellow Traffic Lights',
      topic: 'The 1960s Gazis-Herman-Maradudin mathematical proof demonstrating the physical impossibility of stopping or clearing an intersection at certain speeds, giving birth to the universal yellow-light timing standard.',
      recommended_styles: ['swiss-motion', 'blueprint', 'chalkboard'],
      rationale: 'Clean typographic diagrams and vector road layout vectors match mathematical kinematic formulas perfectly.'
    },
    {
      id: 'keyboard-qwerty-typewriter-jam',
      title: 'The Slowdown Myth: How Telegraph Morsecodes Built QWERTY',
      topic: 'Why the myth of slowing down fast typists is false, and how E. Remington & Sons designed the 1873 Sholes layout to optimize acoustic decoding of high-speed transatlantic Morse code telegrams.',
      recommended_styles: ['exploded-teardown', 'archive-lighttable', 'paper-popup'],
      rationale: 'Exploded mechanical linkages and archival telegraph papers capture 19th century industrial engineering.'
    },
    {
      id: 'barcode-bullseye-scanner-laser',
      title: 'From Sand Dunes to Supermarkets: The Laser That Saved Retail',
      topic: 'How Norman Joseph Woodland drew Morse code in Miami sand in 1948, creating the bullseye circular barcode that failed under hot incandescent bulbs until helium-neon lasers unlocked the 1974 Wrigley gum pack scan.',
      recommended_styles: ['crt-terminal', 'isometric-infographic', 'circuit-board'],
      rationale: 'Retro optical scans and precision line grids reflect the dawn of modern laser automation.'
    },
    {
      id: 'airplane-black-box-orange',
      title: 'The Flight Recorder Mystery: Why the Black Box is Painted Dayglo Orange',
      topic: 'David Warren 1953 Aeronautical Research Laboratories invention of the magnetic wire crash recorder, the aviation establishment skepticism, and the optical contrast physics dictating bright orange paint.',
      recommended_styles: ['blueprint', 'briefing-board', 'exploded-teardown'],
      rationale: 'Aeronautical CAD diagrams and military briefing boards ground the investigation in real aircraft telemetry.'
    },
    {
      id: 'ballpoint-pen-high-altitude-war',
      title: 'The 30,000-Foot Ball: How WWII Bombers Made the Biro Pen Immortal',
      topic: 'Why Laszlo Biro fountain pen alternative was ignored until RAF pilots found fountain pens burst under unpressurized bomber cockpits, turning capillary ink tubes into critical wartime equipment.',
      recommended_styles: ['exploded-teardown', 'watercolor-brush', 'copperplate-engraving'],
      rationale: 'Capillary ink fluid dynamics and brass ball-bearing tolerances shine in exploded macro visuals.'
    }
  ];

  // Filter out any past topics
  const available = candidatePool.filter(c => !pastTitles.has(c.title.toLowerCase())).slice(0, 3);

  res.json({
    success: true,
    stories: available
  });
});

router.post('/select', (req, res) => {
  const { story, style, aspect_ratio, language } = req.body;
  if (!story || !story.title) {
    return res.status(400).json({ success: false, message: 'Story payload is required' });
  }

  const entry = {
    id: story.id || 'custom-' + Date.now(),
    title: story.title,
    topic: story.topic,
    style: style || 'paper-popup',
    aspect_ratio: aspect_ratio || '16:9',
    language: language || 'id',
    selected_at: new Date().toISOString()
  };

  saveHistory(entry);
  res.json({ success: true, saved: entry });
});

export default router;
