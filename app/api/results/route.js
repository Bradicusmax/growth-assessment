import { nanoid } from 'nanoid';
import { saveReport } from '../../../lib/kv';

export async function POST(request) {
  try {
    const data = await request.json();

    // Validate required fields
    if (!data.answers || !data.catScores || data.totalPct === undefined || !data.grade) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const id = nanoid(8);
    const report = {
      ...data,
      createdAt: new Date().toISOString(),
    };

    await saveReport(id, report);

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const reportUrl = `${siteUrl}/report/${id}`;

    return Response.json({ id, reportUrl });
  } catch (error) {
    console.error('Error saving report:', error);
    return Response.json({ error: 'Failed to save report' }, { status: 500 });
  }
}
