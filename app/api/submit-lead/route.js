import { nanoid } from 'nanoid';
import { saveReport } from '../../../lib/kv';

export async function POST(request) {
  try {
    const data = await request.json();

    const { contact, answers, catScores, totalPct, grade } = data;

    // Validate required fields
    if (!contact?.email || !answers || !catScores || totalPct === undefined || !grade) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Save report to KV
    const id = nanoid(8);
    const report = {
      answers,
      catScores,
      totalPct,
      grade,
      contact,
      createdAt: new Date().toISOString(),
    };
    await saveReport(id, report);

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const reportUrl = `${siteUrl}/report/${id}`;

    // Send to GHL webhook
    const webhookUrl = process.env.GHL_WEBHOOK_URL;
    if (webhookUrl) {
      try {
        await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            // Contact info
            firstName: contact.firstName || '',
            lastName: contact.lastName || '',
            email: contact.email,
            phone: contact.phone || '',
            companyName: contact.company || '',
            // Assessment results
            totalScore: totalPct,
            grade,
            reportUrl,
            // Category scores
            leadGeneration: catScores.lead,
            speedToLead: catScores.speed,
            followUpSystems: catScores.followup,
            reputation: catScores.reputation,
            scalability: catScores.scale,
            growthVision: catScores.vision,
            // Individual answers
            answers: answers.map(a => ({
              question: a.questionText,
              answer: a.answerText,
              category: a.category,
              score: a.score,
            })),
          }),
        });
      } catch (webhookErr) {
        console.error('GHL webhook failed:', webhookErr);
        // Don't block the user — report is still saved
      }
    } else {
      console.warn('GHL_WEBHOOK_URL not set — skipping webhook');
    }

    return Response.json({ id, reportUrl });
  } catch (error) {
    console.error('Error in submit-lead:', error);
    return Response.json({ error: 'Failed to process submission' }, { status: 500 });
  }
}
