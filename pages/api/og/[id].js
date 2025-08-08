export default function handler(req, res) {
  const { id } = req.query;
  const name = (id || 'Municipality').toString().replace(/</g, '&lt;');
  const svg = `<?xml version="1.0" encoding="UTF-8"?><svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630"><rect width="100%" height="100%" fill="#111827"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#fff" font-family="Arial, sans-serif" font-size="56">${name}, Illinois</text></svg>`;
  res.setHeader('Content-Type', 'image/svg+xml');
  res.send(svg);
}