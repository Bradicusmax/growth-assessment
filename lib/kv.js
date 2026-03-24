import { kv } from '@vercel/kv';

const REPORT_TTL = 60 * 60 * 24 * 90; // 90 days in seconds

export async function saveReport(id, data) {
  await kv.set(`report:${id}`, JSON.stringify(data), { ex: REPORT_TTL });
}

export async function getReport(id) {
  const data = await kv.get(`report:${id}`);
  if (!data) return null;
  return typeof data === 'string' ? JSON.parse(data) : data;
}
