const express = require('express');

const app = express();

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/api/assets/sample', (req, res) => {
  const assets = [
    { id: 'asset-1', name: 'Landing Page UI Kit', price: 29 },
    { id: 'asset-2', name: 'SaaS Dashboard Template', price: 49 },
  ];

  res.json(assets);
});

if (require.main === module) {
  const port = process.env.PORT || 4000;
  app.listen(port, () => {    
    console.log(`Node microservice listening on port ${port}`);
  });
}

module.exports = app;
