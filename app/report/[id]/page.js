import { getReport } from '../../../lib/kv';
import { catMeta, getCatFeedback, getRecommendations, getGrade, getLeakPct, getCtaMessage } from '../../../lib/scoring';
import ReportClient from './ReportClient';

const LOGO_URL = 'https://storage.googleapis.com/msgsndr/6up9wDXtx61Gr1M5s6gX/media/665de415c6bcc81192e2ad03.png';

export async function generateMetadata({ params }) {
  return {
    title: 'Your Growth Assessment Report | Accelerated Intelligence',
  };
}

export default async function ReportPage({ params }) {
  const { id } = await params;
  const report = await getReport(id);

  if (!report) {
    return (
      <div className="report-container">
        <div className="report-not-found">
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <img src={LOGO_URL} alt="Accelerated Intelligence" style={{ maxWidth: '180px', height: 'auto' }} />
          </div>
          <h1>Report Not Found</h1>
          <p>This report may have expired or the link may be incorrect. Assessment reports are available for 90 days.</p>
          <div style={{ marginTop: '32px' }}>
            <a href="/" className="cta-btn" style={{ textDecoration: 'none' }}>
              Take the Assessment
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </a>
          </div>
        </div>
      </div>
    );
  }

  const { answers, catScores, totalPct, grade } = report;
  const { gradeColor } = getGrade(totalPct);
  const leakPct = getLeakPct(totalPct);
  const leakPctDisplay = Math.round(leakPct * 100);
  const recs = getRecommendations(catScores);
  const ctaMessage = getCtaMessage(totalPct);

  const tileCats = [
    { key: 'lead', label: 'Lead Generation' },
    { key: 'speed', label: 'Speed to Lead' },
    { key: 'followup', label: 'Follow-Up Systems' },
    { key: 'reputation', label: 'Reputation' },
    { key: 'scale', label: 'Scalability' },
    { key: 'vision', label: 'Growth Vision' },
  ];

  const catOrder = ['speed', 'followup', 'lead', 'reputation', 'scale'];

  function getTileInfo(score) {
    const p = Math.round((score / 4) * 100);
    if (p >= 75) return { color: '#34D399', bg: 'rgba(52,211,153,0.08)', border: 'rgba(52,211,153,0.25)', icon: '\u2713', status: 'Strong' };
    if (p >= 50) return { color: '#FBBF24', bg: 'rgba(251,191,36,0.08)', border: 'rgba(251,191,36,0.25)', icon: '\u26A0', status: 'Gaps' };
    return { color: '#F87171', bg: 'rgba(248,113,113,0.08)', border: 'rgba(248,113,113,0.25)', icon: '\u2717', status: 'Critical' };
  }

  function getBarColor(score) {
    const p = Math.round((score / 4) * 100);
    if (p < 50) return { color: 'var(--red)', bg: 'var(--red-glow)' };
    if (p < 75) return { color: 'var(--amber)', bg: 'var(--amber-glow)' };
    return { color: 'var(--green)', bg: 'var(--green-glow)' };
  }

  return (
    <div className="report-container">
      {/* Header */}
      <div className="results-header">
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <img src={LOGO_URL} alt="Accelerated Intelligence" style={{ maxWidth: '180px', height: 'auto' }} />
        </div>
        <div className="intro-badge">Your Results</div>
        <h1 className="results-title">Here&apos;s where your business stands.</h1>
        <p className="results-subtitle">Based on your answers, we&apos;ve identified specific gaps in your lead capture, follow-up, and operational systems. Here&apos;s the full picture.</p>
      </div>

      {/* Category Tiles */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px', marginBottom: '48px' }}>
        {tileCats.map(tc => {
          const tile = getTileInfo(catScores[tc.key]);
          return (
            <div key={tc.key} style={{ background: tile.bg, border: `1px solid ${tile.border}`, borderRadius: '14px', padding: '20px 14px', textAlign: 'center' }}>
              <div style={{ fontSize: '28px', color: tile.color, marginBottom: '8px', lineHeight: 1 }}>{tile.icon}</div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)', marginBottom: '4px', lineHeight: 1.3 }}>{tc.label}</div>
              <div style={{ fontSize: '11px', fontWeight: 700, color: tile.color, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{tile.status}</div>
            </div>
          );
        })}
      </div>

      {/* Your Answers */}
      <div className="report-answers-section">
        <div className="report-answers-title">Your Answers</div>
        {answers.map((a, i) => (
          <div key={i} className="report-answer-card">
            <div className="report-answer-q">Q{i + 1}: {a.questionText}</div>
            <div className="report-answer-a">{a.answerText}</div>
          </div>
        ))}
      </div>

      {/* Category Breakdown */}
      <div className="breakdown-title">Breakdown by category</div>
      {catOrder.map(cat => {
        const sc = catScores[cat];
        const p = Math.round((sc / 4) * 100);
        const bar = getBarColor(sc);
        return (
          <div key={cat} className="category-card">
            <div className="cat-top">
              <div className="cat-name">{catMeta[cat].name}</div>
              <div className="cat-score-badge" style={{ color: bar.color, background: bar.bg }}>{p}%</div>
            </div>
            <div className="cat-bar">
              <div className="cat-bar-fill" style={{ background: bar.color, width: `${p}%` }}></div>
            </div>
            <div className="cat-detail">{getCatFeedback(cat, sc)}</div>
          </div>
        );
      })}

      {/* Revenue Leak */}
      <div className="cost-section">
        <div className="cost-section-title">Estimated revenue leak</div>
        <p style={{ fontSize: '14px', color: 'var(--text-dim)', lineHeight: 1.6, marginBottom: '12px' }}>
          Based on your score, we estimate roughly <strong style={{ color: 'var(--red)' }}>{leakPctDisplay}%</strong> of your potential revenue is slipping through the cracks.
        </p>
      </div>

      {/* Recommendations */}
      <div className="recs-section">
        <h2 className="recs-title">Your top 3 fixes, ranked by impact</h2>
        <p className="recs-sub">If you only did three things, these would move the needle the most based on your specific gaps.</p>
        {recs.map((rec, i) => (
          <div key={i} className="rec-item">
            <div className="rec-num">{i + 1}</div>
            <div className="rec-content">
              <h4>{rec.title}</h4>
              <p dangerouslySetInnerHTML={{ __html: rec.desc }} />
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <ReportClient ctaMessage={ctaMessage} reportId={id} />
    </div>
  );
}
