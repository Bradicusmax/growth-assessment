'use client';

import { useState } from 'react';
import FormModal from '../../../components/FormModal';

const LOGO_URL = 'https://storage.googleapis.com/msgsndr/6up9wDXtx61Gr1M5s6gX/media/665de415c6bcc81192e2ad03.png';

export default function ReportClient({ ctaMessage, reportId }) {
  const [modalOpen, setModalOpen] = useState(false);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || '';
  const reportUrl = `${siteUrl}/report/${reportId}`;

  return (
    <>
      {/* About Section */}
      <div style={{ marginTop: '48px', padding: '32px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '20px' }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <img src={LOGO_URL} alt="Accelerated Intelligence" style={{ maxWidth: '160px', height: 'auto', marginBottom: '16px' }} />
        </div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', color: 'var(--text)', textAlign: 'center', marginBottom: '16px' }}>Who fixes this stuff?</h2>
        <p style={{ fontSize: '16px', color: 'var(--text)', lineHeight: 1.75, textAlign: 'center', maxWidth: '520px', margin: '0 auto 20px' }}>
          Accelerated Intelligence helps B2B companies and professional services firms stop leaking revenue and start scaling with AI-powered systems that actually work.
        </p>
      </div>

      {/* CTA */}
      <div className="cta-section">
        <h2 className="cta-title">Let&apos;s fix this together.</h2>
        <p className="cta-desc">{ctaMessage}</p>
        <p style={{ fontSize: '15px', color: 'var(--text-dim)', lineHeight: 1.7, marginBottom: '28px', maxWidth: '460px', marginLeft: 'auto', marginRight: 'auto' }}>
          No pitch deck. No 90-minute webinar. Just a focused conversation about your specific gaps and what it would take to close them.
        </p>
        <button className="cta-btn" onClick={() => setModalOpen(true)}>
          Book a Free Strategy Call with Brad
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </button>
        <div className="cta-alt">Or email Brad directly at <a href="mailto:brad@acceleratedintelligence.ai">brad@acceleratedintelligence.ai</a></div>
      </div>

      <FormModal isOpen={modalOpen} onClose={() => setModalOpen(false)} reportUrl={reportUrl} />
    </>
  );
}
