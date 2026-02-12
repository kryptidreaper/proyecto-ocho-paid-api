const express = require('express');
const { paymentMiddleware } = require('x402-express');

const app = express();
app.use(express.json());

// === CLEAN TROJAN HOMEPAGE WITH ONLY MOVING BUY/SELL SIGNALS ===
app.get('/', async (req, res) => {
  let ethPrice = '—';
  try {
    const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd');
    const data = await response.json();
    ethPrice = data.ethereum.usd.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
  } catch {}

  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      <title>PROYECTO OCHO</title>
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;900&display=swap" rel="stylesheet">
      <style>
        * { margin:0; padding:0; box-sizing:border-box; }
        body {
          font-family: 'Inter', system-ui, sans-serif;
          background: #000;
          color: #fff;
          min-height: 100vh;
          overflow: hidden;
          position: relative;
        }
        header {
          padding: 2.5rem 8%;
          background: rgba(0,0,0,0.75);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(96,165,250,0.08);
          position: fixed;
          top: 0;
          width: 100%;
          z-index: 100;
        }
        .logo {
          font-size: 3.5rem;
          font-weight: 900;
          letter-spacing: -0.04em;
          color: #60a5fa;
          text-shadow: 0 0 30px rgba(96,165,250,0.4);
        }
        main {
          height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          z-index: 10;
        }
        .hero {
          text-align: center;
          max-width: 900px;
        }
        h1 {
          font-size: 7.5rem;
          font-weight: 900;
          letter-spacing: -0.06em;
          margin-bottom: 1.5rem;
          color: #fff;
          text-shadow: 0 0 50px rgba(255,255,255,0.15);
        }
        .tagline {
          font-size: 1.8rem;
          font-weight: 400;
          color: #a0a0a0;
          margin-bottom: 4rem;
        }
        .price {
          font-size: 4rem;
          font-weight: 800;
          color: #34d399;
          margin: 3rem 0;
          text-shadow: 0 0 40px rgba(52,211,153,0.4);
        }
        .cta {
          display: inline-block;
          background: transparent;
          color: #fff;
          font-size: 1.6rem;
          font-weight: 700;
          padding: 1.4rem 6rem;
          border: 2px solid #60a5fa;
          border-radius: 0;
          text-decoration: none;
          transition: all 0.4s;
          letter-spacing: 0.06em;
        }
        .cta:hover {
          background: #60a5fa;
          color: #000;
          box-shadow: 0 0 80px rgba(96,165,250,0.6);
        }
        footer {
          position: fixed;
          bottom: 3rem;
          left: 50%;
          transform: translateX(-50%);
          font-size: 1rem;
          color: #444;
          letter-spacing: 0.08em;
        }
        /* BUY/SELL pop-ups — more frequent & visible */
        .signal-popup {
          position: absolute;
          padding: 16px 32px;
          background: rgba(0,0,0,0.65);
          border: 2px solid;
          border-radius: 8px;
          font-size: 2.5rem;
          font-weight: 900;
          pointer-events: none;
          opacity: 0;
          transform: translateY(50px) scale(0.9);
          animation: popupRise 5s ease-out forwards;
          text-shadow: 0 0 30px currentColor;
          z-index: 5;
        }
        .signal-popup.buy { border-color: #34d399; color: #34d399; box-shadow: 0 0 40px #34d399; }
        .signal-popup.sell { border-color: #ef4444; color: #ef4444; box-shadow: 0 0 40px #ef4444; }
        @keyframes popupRise {
          0% { opacity: 0; transform: translateY(50px) scale(0.9); }
          10% { opacity: 1; transform: translateY(0) scale(1); }
          80% { opacity: 1; transform: translateY(-60px) scale(1); }
          100% { opacity: 0; transform: translateY(-120px) scale(0.9); }
        }
      </style>
    </head>
    <body>
      <header>
        <div class="logo">PROYECTO OCHO</div>
      </header>
      <main>
        <div class="hero">
          <h1>TRADING INTELLIGENCE</h1>
          <p class="tagline">Real-time signals. On-chain execution. Built for the future.</p>
          <div class="price">$0.01 USDC per signal</div>
          <a href="/api/signal" class="cta">Access Signal</a>
        </div>
      </main>
      <footer>
        © 2026 PROYECTO OCHO • SECURE • ON-CHAIN
      </footer>

      <script>
        // BUY/SELL pop-ups — faster & more frequent
        setInterval(() => {
          if (Math.random() < 0.12) { // increased frequency
            const popup = document.createElement('div');
            popup.className = 'signal-popup ' + (Math.random() > 0.5 ? 'buy' : 'sell');
            popup.innerText = Math.random() > 0.5 ? 'BUY' : 'SELL';
            popup.style.left = Math.random() * 90 + 5 + '%';
            popup.style.top = Math.random() * 90 + 5 + '%';
            document.body.appendChild(popup);
            setTimeout(() => popup.remove(), 5000); // faster fade
          }
        }, 1000); // every 1 second average — feels live
      </script>
    </body>
    </html>
  `);
});

// Payment middleware & protected endpoint (unchanged)
const PAY_TO = '0xf7649D9030A3e23591ECb1f70fae0944D84b9EA7';

const payment = paymentMiddleware(PAY_TO, {
  'GET /api/signal': {
    price: '$0.01',
    network: 'base',
    config: {
      description: 'PROYECTO OCHO premium real-time trading signal — live ETH/BTC insights',
    },
  },
});

app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.get('/api/signal', payment, async (req, res) => {
  try {
    const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd');
    const data = await response.json();
    const ethPrice = data.ethereum.usd;

    const signalText = ethPrice > 2500 
      ? `ETH is strong at $${ethPrice} — hold or buy dips`
      : `ETH is weak at $${ethPrice} — consider selling or waiting for bounce`;

    res.json({
      signal: signalText,
      current_eth_price_usd: ethPrice,
      timestamp: new Date().toISOString(),
      note: "PROYECTO OCHO real-time premium tip 💀"
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch live price' });
  }
});

app.listen(3000, () => {
  console.log('PROYECTO OCHO Paid API running on http://localhost:3000');
});