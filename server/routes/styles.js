import express from 'express';
import fs from 'fs';
import path from 'path';
import os from 'os';

const router = express.Router();
const lemoHome = process.env.LEMO_OPUSCAR_HOME || path.join(os.homedir(), 'lemo-opuscar');

router.get('/', (req, res) => {
  try {
    const catalogPath = path.join(lemoHome, 'styleboard', 'catalog.json');
    if (fs.existsSync(catalogPath)) {
      const data = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));
      // Enrich with poster availability and engine category
      const enriched = data.map(item => {
        const posterRel = path.join('styles', item.slug, 'poster.jpg');
        const posterExists = fs.existsSync(path.join(lemoHome, posterRel));
        return {
          ...item,
          posterUrl: posterExists ? `/api/styles/${item.slug}/poster` : null,
          engine: getEngineType(item.slug, item.cat_en)
        };
      });
      return res.json({ success: true, count: enriched.length, styles: enriched });
    } else {
      return res.status(404).json({ success: false, message: 'Catalog not found at ' + catalogPath });
    }
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.get('/:slug/poster', (req, res) => {
  const { slug } = req.params;
  const posterPath = path.join(lemoHome, 'styles', slug, 'poster.jpg');
  if (fs.existsSync(posterPath)) {
    res.sendFile(posterPath);
  } else {
    res.status(404).send('Poster not found');
  }
});

function getEngineType(slug, category) {
  const threeDStyles = ['brick-toy', 'paper-popup', 'exploded-teardown', 'isometric-infographic', 'backrooms', 'liminal-space'];
  const shaderStyles = ['crt-terminal', 'ascii-crt', 'thermal-camera', 'night-vision'];
  const vectorStyles = ['swiss-motion', 'transit-map', 'blueprint', 'chalkboard'];
  
  if (threeDStyles.includes(slug)) return 'Three.js 3D PBR';
  if (shaderStyles.includes(slug)) return 'WebGL2 Shaders';
  if (vectorStyles.includes(slug)) return 'Vector SVG / DOM';
  return 'HTML5 Canvas 2D';
}

export default router;

