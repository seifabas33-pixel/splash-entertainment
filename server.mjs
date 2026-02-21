import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// hotel data imported from separate module
import hotels from './data/hotels.js';

app.get('/hotels', (req, res) => {
  let html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Our Hotels - Splash Entertainment</title>
  <link rel="stylesheet" href="/styles.css">
</head>
<body>
  <h1>Where We Perform</h1>
  <p>Explore our partner resorts along Egypt's Red Sea coast. Each hotel features curated entertainment programs designed by Splash Entertainment.</p>
`;

  hotels.forEach(hotel => {
    html += `
  <section class="hotel">
    <h2>${hotel.name}</h2>
    <p>${hotel.description}</p>
    <ul>
      ${hotel.features.map(f => `<li>${f}</li>`).join('')}
    </ul>
    <a href="${hotel.link}">View Portfolio</a>
  </section>
`;
  });

  html += `
</body>
</html>`;

  res.send(html);
});

// JSON API for mobile or other clients
app.get('/api/hotels', (req, res) => {
  res.json(hotels);
});

app.listen(PORT, '127.0.0.1', () => {
  console.log(`Server listening on http://127.0.0.1:${PORT}`);
});

// run with `npm start` or `node server.mjs`
