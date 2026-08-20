export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRFToken, X-Cookie, Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { targetUrl, method, payload } = req.body;
    const csrfToken = req.headers['x-csrftoken'] || '';
    const cookie = req.headers['x-cookie'] || '';

    const headers = {
      'X-CSRFToken': csrfToken,
      'X-Requested-With': 'XMLHttpRequest',
      'X-IG-App-ID': '936619743392459',
      'Cookie': cookie,
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    };

    const fetchOptions = {
      method: method || 'GET',
      headers: headers
    };

    if (method === 'POST') {
      headers['Content-Type'] = 'application/x-www-form-urlencoded';
      if (payload) fetchOptions.body = payload;
    }

    const response = await fetch(targetUrl, fetchOptions);
    const data = await response.text();
    res.status(response.status).send(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
