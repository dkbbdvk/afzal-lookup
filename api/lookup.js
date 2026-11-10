module.exports = async (req, res) => {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { num } = req.query;

  if (!num) {
    return res.status(400).json({ error: "Missing 'num' parameter" });
  }

  try {
    const targetUrl = `https://true-call-check.vercel.app/api/web/lookup?num=${num}`;
    
    // API ko call karein
    const response = await fetch(targetUrl, {
      headers: {
        'Origin': 'https://truecallcheck.tech',
        'User-Agent': 'Mozilla/5.0'
      }
    });

    const data = await response.json();
    
    // Response wapas bhejein
    res.status(response.status).json(data);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
