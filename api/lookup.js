export default async function handler(req, res) {
  // CORS Headers set karein
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Preflight request handle karein
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { num } = req.query;

  if (!num) {
    return res.status(400).json({ error: "Missing 'num' parameter" });
  }

  try {
    // Asli API ko call karein
    const targetUrl = `https://true-call-check.vercel.app/api/web/lookup?num=${num}`;
    
    const response = await fetch(targetUrl, {
      headers: {
        'Origin': 'https://truecallcheck.tech', // Official origin (Access Denied se bachne ke liye)
        'User-Agent': 'Mozilla/5.0'
      }
    });

    const data = await response.json();

    // Response wapas frontend ko bhejein
    res.status(response.status).json(data);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
