import express from 'express';
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import os from 'os';

const router = express.Router();
const lemoHome = process.env.LEMO_OPUSCAR_HOME || path.join(os.homedir(), 'lemo-opuscar');

// Store active rendering jobs in memory
const jobs = new Map();

// Cloud Render Dispatcher via GitHub Actions
router.post('/cloud-dispatch', async (req, res) => {
  const { github_token, owner, repo, ref = 'main', inputs } = req.body;

  if (!github_token || !owner || !repo) {
    return res.status(400).json({
      success: false,
      message: 'GitHub Token, Owner, and Repo name are required to trigger Cloud Actions runner.'
    });
  }

  try {
    const url = `https://api.github.com/repos/${owner}/${repo}/actions/workflows/render.yml/dispatches`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/vnd.github+json',
        'Authorization': `Bearer ${github_token}`,
        'X-GitHub-Api-Version': '2022-11-28',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ref: ref,
        inputs: {
          style: inputs.style || 'paper-popup',
          aspect_ratio: inputs.aspect_ratio || '16:9',
          language: inputs.language || 'id',
          topic: inputs.topic || 'Unknown Invention'
        }
      })
    });

    if (response.status === 204 || response.status === 200) {
      return res.json({
        success: true,
        message: 'Successfully dispatched Cloud Render Farm job to GitHub Actions!',
        workflow_url: `https://github.com/${owner}/${repo}/actions`
      });
    } else {
      const errText = await response.text();
      return res.status(response.status).json({
        success: false,
        error: `GitHub API error (${response.status}): ${errText}`
      });
    }
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Keyframe Frame-Zero Inspector (Instant static JPEG)
router.get('/still', (req, res) => {
  const { style = 'paper-popup', t = 1.5 } = req.query;
  const demoPath = path.join(lemoHome, 'styles', style, 'demo');
  const stillScript = path.join(lemoHome, 'core', 'render', 'still.mjs');

  if (!fs.existsSync(demoPath)) {
    return res.status(404).json({ success: false, message: `Style demo not found for ${style}` });
  }

  // Run still.mjs
  const p = spawn('node', [stillScript, demoPath, String(t)], { cwd: lemoHome });
  p.on('close', (code) => {
    // Check if still was written to demoPath/stills/
    const stillsDir = path.join(demoPath, 'stills');
    if (fs.existsSync(stillsDir)) {
      const files = fs.readdirSync(stillsDir).filter(f => f.endsWith('.jpg') || f.endsWith('.png'));
      if (files.length > 0) {
        return res.sendFile(path.join(stillsDir, files[files.length - 1]));
      }
    }
    res.json({ success: code === 0, message: `Still rendered with exit code ${code}` });
  });
});

export default router;
