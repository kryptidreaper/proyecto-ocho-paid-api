const express = require('express');
const { paymentMiddleware } = require('x402-express');

const app = express();
app.use(express.json());

const PAY_TO = '0xf7649D9030A3e23591ECb1f70fae0944D84b9EA7';  // Your wallet

const payment = paymentMiddleware(PAY_TO, {
  'GET /api/signal': {
    price: '$0.01',
    network: 'base',
    config: {
      description: 'PROYECTO OCHO premium trading signal',
    },
  },
});

// Free test
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// Paid endpoint
app.get('/api/signal', payment, (req, res) => {
  res.json({
    signal: 'ETH hold above $2500 — buy dip, PROYECTO OCHO tip 💀',
    time: new Date().toISOString(),
  });
});

app.listen(3000, () => {
  console.log('PROYECTO OCHO Paid API running on http://localhost:3000');
});