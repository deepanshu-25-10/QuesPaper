import express from 'express';
import cors from 'cors';
import https from 'https';
import http from 'http';
import { URL } from 'url';
import { PAPERS_DATABASE } from '../server/papersData.js';

const app = express();
app.use(cors());
app.use(express.json());

// Intelligent NLP Query Parser & Matcher
function searchPapers(query, examFilter = null, yearFilter = null) {
  let baseList = PAPERS_DATABASE;

  if (examFilter && examFilter !== 'All') {
    baseList = baseList.filter(p => p.exam.toLowerCase().includes(examFilter.toLowerCase()));
  }

  if (yearFilter && yearFilter !== 'All') {
    baseList = baseList.filter(p => String(p.year) === String(yearFilter));
  }

  if (!query || !query.trim()) {
    return baseList;
  }

  const q = query.toLowerCase().trim();
  const tokens = q.split(/[\s,+/_-]+/).filter(Boolean);

  const scored = baseList.map(paper => {
    let score = 0;
    const paperText = `${paper.exam} ${paper.year} ${paper.session} ${paper.date} ${paper.shift} ${paper.shiftType} ${paper.questionPaper.title} ${paper.tags.join(' ')}`.toLowerCase();

    // Direct substring or exact tag match
    for (const tag of paper.tags) {
      if (q.includes(tag) || tag.includes(q)) {
        score += 60;
      }
    }

    // Individual token matching
    for (const token of tokens) {
      if (token === 's1' && paper.shift.toLowerCase().includes('shift 1')) score += 40;
      else if (token === 's2' && paper.shift.toLowerCase().includes('shift 2')) score += 40;
      else if (token === 'p1' && paper.shift.toLowerCase().includes('paper 1')) score += 40;
      else if (token === 'p2' && paper.shift.toLowerCase().includes('paper 2')) score += 40;
      else if (token === 'isc' && paper.exam.toLowerCase().includes('isc')) score += 50;
      else if (token === 'adv' || token === 'advance' || token === 'advanced') {
        if (paper.exam.toLowerCase().includes('advanced')) score += 50;
      }
      else if (token === 'main' || token === 'mains') {
        if (paper.exam.toLowerCase().includes('main')) score += 50;
      }
      else if (token === 'cs' || token === 'computer') {
        if (paperText.includes('computer')) score += 45;
      }
      else if (token === 'pe' || token === 'physical') {
        if (paperText.includes('physical')) score += 45;
      }
      else if (token === 'literature' || token === 'lit') {
        if (paperText.includes('literature')) score += 45;
      }
      else if (token === 'language' || token === 'lang') {
        if (paperText.includes('language')) score += 45;
      }
      else if (token === 'morning' && paper.shiftType.toLowerCase().includes('morning')) score += 25;
      else if (token === 'evening' && paper.shiftType.toLowerCase().includes('evening')) score += 25;
      else if (paperText.includes(token)) {
        score += 15;
      }
    }

    if (tokens.includes(String(paper.year))) {
      score += 35;
    }

    const dateMatch = paper.date.toLowerCase();
    for (const token of tokens) {
      if (dateMatch.startsWith(token) || dateMatch.includes(` ${token} `) || dateMatch.startsWith(`${token} `)) {
        score += 30;
      }
    }

    return { paper, score };
  });

  return scored
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .map(item => item.paper);
}

// Routes
app.get('/api/papers', (req, res) => {
  const { q, exam, year } = req.query;
  const results = searchPapers(q, exam, year);
  res.json({
    total: results.length,
    papers: results
  });
});

app.get('/api/paper/:id', (req, res) => {
  const paper = PAPERS_DATABASE.find(p => p.id === req.params.id);
  if (!paper) {
    return res.status(404).json({ error: 'Paper not found' });
  }
  res.json(paper);
});

app.get('/api/proxy-pdf', (req, res) => {
  const { url } = req.query;
  if (!url) {
    return res.status(400).send('Missing url parameter');
  }

  let parsedUrl;
  try {
    parsedUrl = new URL(url);
  } catch (err) {
    return res.status(400).send('Invalid URL');
  }

  const client = parsedUrl.protocol === 'https:' ? https : http;
  const options = {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'application/pdf,*/*',
    },
    rejectUnauthorized: false
  };

  const proxyReq = client.get(parsedUrl, options, (remoteRes) => {
    if (remoteRes.statusCode >= 300 && remoteRes.statusCode < 400 && remoteRes.headers.location) {
      return res.redirect(`/api/proxy-pdf?url=${encodeURIComponent(remoteRes.headers.location)}`);
    }

    res.setHeader('Content-Type', remoteRes.headers['content-type'] || 'application/pdf');
    if (remoteRes.headers['content-length']) {
      res.setHeader('Content-Length', remoteRes.headers['content-length']);
    }
    res.setHeader('Content-Disposition', 'inline');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 'public, max-age=86400');

    remoteRes.pipe(res);
  });

  proxyReq.on('error', (err) => {
    res.status(502).send('Error streaming PDF: ' + err.message);
  });
});

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    indexedPapers: PAPERS_DATABASE.length,
    platform: 'vercel-serverless'
  });
});

export default app;
