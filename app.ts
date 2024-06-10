import dotenv from 'dotenv';
import express from 'express';
import fetch from 'node-fetch';

const app = express();
const port = 3000;


// Typy dla process.env
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      API_URL: string;
      API_KEY: string;
    }
  }
}

dotenv.config({ path: '.env.development' });


// Konfiguracja API
const API_URL = process.env.API_URL || '';
const API_KEY = process.env.API_KEY || '';

let lastResponse: any = null;
let nextRequestTime: Date | null = null;
let lastRequestTime: Date | null = null;

// Funkcja do wykonywania żądania API
async function getListedItems() {
  const params = new URLSearchParams({
    per_page: '10',
    page: '1',
    search: '★ Gut Knife | Freehand (Factory New)',
    // order: 'market_value',
    // sort: 'asc',
    // auction: 'no',
    // price_min: '10',
    // price_max: '1000',
    // wear_min: '0.1',
    // wear_max: '0.5',
    // has_stickers: 'yes',
    // is_commodity: 'no'
  });

  const response = await fetch(`${API_URL}?${params.toString()}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${API_KEY}`
    }
  });

  if (!response.ok) {
    console.error('Error:', response.statusText);
    return;
  }

  lastResponse = await response.json();
  lastRequestTime = new Date();
  console.log('Listed Items:', lastResponse);
}

// Uruchomienie funkcji co 5 minut
setInterval(() => {
  getListedItems();
  nextRequestTime = new Date(Date.now() + 5 * 60 * 1000);
}, 5 * 60 * 1000);

// Pierwsze uruchomienie funkcji od razu po starcie
getListedItems();
nextRequestTime = new Date(Date.now() + 5 * 60 * 1000);

// Konfiguracja serwera Express
app.get('/', (req, res) => {
  res.send(`
    <html>
      <head>
        <title>CS2 Skin Price Comparison</title>
      </head>
      <body>
        <h1>CS2 Skin Price Comparison</h1>
        <div id="content">
          <h2>Last API Response:</h2>
          <pre id="response">${JSON.stringify(lastResponse, null, 2)}</pre>
          <h2>Last Request Time:</h2>
          <p id="lastRequestTime">${lastRequestTime ? lastRequestTime.toLocaleString() : 'No request made yet'}</p>
          <h2>Next Request In:</h2>
          <p id="timer"></p>
        </div>
        <script>
          function updateTimer() {
            const now = new Date();
            const timeRemaining = nextRequestTime - now;
            const minutes = Math.floor(timeRemaining / 60000);
            const seconds = ((timeRemaining % 60000) / 1000).toFixed(0);
            document.getElementById('timer').innerText = minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
            setTimeout(updateTimer, 1000);
          }

          const nextRequestTime = new Date("${nextRequestTime?.toISOString() || ''}");
          updateTimer();
        </script>
      </body>
    </html>
  `);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
});
