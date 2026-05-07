import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'POST') {
    const { email, data } = req.body;
    try {
      await redis.set(`data:${email}`, data);
      return res.status(200).json({ success: true, message: 'Data synced to cloud' });
    } catch (error) {
      return res.status(500).json({ success: false, message: 'Sync failed' });
    }
  }

  if (req.method === 'GET') {
    const { email } = req.query;
    try {
      const data = await redis.get(`data:${email}`);
      return res.status(200).json({ success: true, data });
    } catch (error) {
      return res.status(500).json({ success: false, message: 'Fetch failed' });
    }
  }
}
