'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { questions } from '../lib/questions';
import { calculateScores, getGrade, getLeakPct, catMeta, getCatFeedback, getRecommendations, getCtaMessage } from '../lib/scoring';
import FormModal from '../components/FormModal';

const LOGO_URL = 'https://storage.googleapis.com/msgsndr/6up9wDXtx61Gr1M5s6gX/media/665de415c6bcc81192e2ad03.png';
const letters = ['A', 'B', 'C', 'D'];

export default function QuizPage() {
  const [screen, setScreen] = useState('intro'); // intro | quiz | loading | results
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [resultsHtml, setResultsHtml] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [reportUrl, setReportUrl] = useState('');
  const resultsRef = useRef(null);
  const loadingTimerRef = useRef(null);

  // Save report to API after results are calculated
  const saveReport = useCallback(async (answerIndices) => {
    try {
      const answerDetails = questions.map((q, i) => ({
        questionIndex: i,
        optionIndex: answerIndices[i],
        questionText: q.text,
        answerText: q.options[answerIndices[i]].text,
        score: q.options[answerIndices[i]].score,
        category: q.options[answerIndices[i]].cat,
      }));

      const { catScores, pct } = calculateScores(answerIndices);
      const { grade } = getGrade(pct);

      const res = await fetch('/api/results', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers: answerDetails, catScores, totalPct: pct, grade }),
      });

      if (res.ok) {
        const data = await res.json();
        setReportUrl(data.reportUrl);
      }
    } catch (e) {
      console.error('Failed to save report:', e);
    }
  }, []);

  const buildResultsHtml = useCallback((answerIndices) => {
    const { catScores, pct } = calculateScores(answerIndices);
    const { grade, gradeColor } = getGrade(pct);
    const leakPct = getLeakPct(pct);
    const leakPctDisplay = Math.round(leakPct * 100);
    const recs = getRecommendations(catScores);
    const ctaMessage = getCtaMessage(pct);

    const tileCats = [
      { key: 'lead', label: 'Lead Generation' },
      { key: 'speed', label: 'Speed to Lead' },
      { key: 'followup', label: 'Follow-Up Systems' },
      { key: 'reputation', label: 'Reputation' },
      { key: 'scale', label: 'Scalability' },
      { key: 'vision', label: 'Growth Vision' },
    ];

    let html = `
      <div class="results-header">
        <div style="text-align:center; margin-bottom:24px;">
          <img src="${LOGO_URL}" alt="Accelerated Intelligence" style="max-width:180px; height:auto;" />
        </div>
        <div class="intro-badge">Your Results</div>
        <h1 class="results-title">Here's where your business stands.</h1>
        <p class="results-subtitle">Based on your answers, we've identified specific gaps in your lead capture, follow-up, and operational systems. Here's the full picture.</p>
      </div>
    `;

    // Category tiles grid
    html += `<div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:14px; margin-bottom:48px;">`;
    tileCats.forEach(tc => {
      const sc = catScores[tc.key];
      const p = Math.round((sc / 4) * 100);
      let tileColor, tileBg, tileBorder, tileIcon, tileStatus;
      if (p >= 75) {
        tileColor = '#34D399'; tileBg = 'rgba(52,211,153,0.08)'; tileBorder = 'rgba(52,211,153,0.25)';
        tileIcon = '&#10003;'; tileStatus = 'Strong';
      } else if (p >= 50) {
        tileColor = '#FBBF24'; tileBg = 'rgba(251,191,36,0.08)'; tileBorder = 'rgba(251,191,36,0.25)';
        tileIcon = '&#9888;'; tileStatus = 'Gaps';
      } else {
        tileColor = '#F87171'; tileBg = 'rgba(248,113,113,0.08)'; tileBorder = 'rgba(248,113,113,0.25)';
        tileIcon = '&#10007;'; tileStatus = 'Critical';
      }
      html += `
        <div style="background:${tileBg}; border:1px solid ${tileBorder}; border-radius:14px; padding:20px 14px; text-align:center;">
          <div style="font-size:28px; color:${tileColor}; margin-bottom:8px; line-height:1;">${tileIcon}</div>
          <div style="font-size:13px; font-weight:600; color:var(--text); margin-bottom:4px; line-height:1.3;">${tc.label}</div>
          <div style="font-size:11px; font-weight:700; color:${tileColor}; text-transform:uppercase; letter-spacing:0.06em;">${tileStatus}</div>
        </div>
      `;
    });
    html += `</div>`;

    // Category breakdown
    html += `<div class="breakdown-title">Breakdown by category</div>`;
    const catOrder = ['speed', 'followup', 'lead', 'reputation', 'scale'];
    catOrder.forEach(cat => {
      const sc = catScores[cat];
      const p = Math.round((sc / 4) * 100);
      let color = 'var(--green)';
      let bg = 'var(--green-glow)';
      if (p < 50) { color = 'var(--red)'; bg = 'var(--red-glow)'; }
      else if (p < 75) { color = 'var(--amber)'; bg = 'var(--amber-glow)'; }

      html += `
        <div class="category-card">
          <div class="cat-top">
            <div class="cat-name">${catMeta[cat].name}</div>
            <div class="cat-score-badge" style="color:${color}; background:${bg};">${p}%</div>
          </div>
          <div class="cat-bar">
            <div class="cat-bar-fill" style="background:${color};" data-width="${p}%"></div>
          </div>
          <div class="cat-detail">${getCatFeedback(cat, sc)}</div>
        </div>
      `;
    });

    // Revenue leak calculator
    html += `
      <div class="cost-section">
        <div class="cost-section-title">What are these gaps actually costing you?</div>
        <p style="font-size:14px; color:var(--text-dim); line-height:1.6; margin-bottom:20px;">Based on your score, we estimate roughly <strong style="color:var(--red);">${leakPctDisplay}%</strong> of your potential revenue is slipping through the cracks. Plug in your numbers below to see what that means in real dollars.</p>
        <div style="display:flex; flex-direction:column; gap:12px; max-width:360px; margin:0 auto 20px;">
          <div>
            <label style="font-size:12px; font-weight:600; color:var(--text-muted); text-transform:uppercase; letter-spacing:0.06em; display:block; margin-bottom:6px;">Avg deal / customer value ($)</label>
            <input type="number" id="calcDeal" placeholder="e.g. 2000" style="width:100%; padding:12px 16px; background:var(--surface-2); border:1px solid var(--border); border-radius:10px; font-size:15px; font-family:var(--font-body); color:var(--text); outline:none;" />
          </div>
          <div>
            <label style="font-size:12px; font-weight:600; color:var(--text-muted); text-transform:uppercase; letter-spacing:0.06em; display:block; margin-bottom:6px;">Leads per month</label>
            <input type="number" id="calcLeads" placeholder="e.g. 50" style="width:100%; padding:12px 16px; background:var(--surface-2); border:1px solid var(--border); border-radius:10px; font-size:15px; font-family:var(--font-body); color:var(--text); outline:none;" />
          </div>
        </div>
        <div id="calcResult" style="display:none;">
          <div style="font-size:13px; font-weight:600; text-transform:uppercase; letter-spacing:0.06em; color:var(--text-muted); margin-bottom:4px;">Estimated annual revenue at risk</div>
          <div id="calcNumber" class="cost-number"></div>
          <div class="cost-note">This is a conservative estimate based on the gap percentage from your assessment. The real number could be higher once you factor in lifetime customer value and referrals.</div>
        </div>
      </div>
    `;

    // Recommendations
    html += `
      <div class="recs-section">
        <h2 class="recs-title">Your top 3 fixes, ranked by impact</h2>
        <p class="recs-sub">If you only did three things, these would move the needle the most based on your specific gaps.</p>
    `;
    recs.forEach((rec, i) => {
      html += `
        <div class="rec-item">
          <div class="rec-num">${i + 1}</div>
          <div class="rec-content">
            <h4>${rec.title}</h4>
            <p>${rec.desc}</p>
          </div>
        </div>
      `;
    });
    html += `</div>`;

    // About section
    html += `
      <div style="margin-top:48px; padding:32px; background:var(--surface); border:1px solid var(--border); border-radius:20px;">
        <div style="text-align:center; margin-bottom:24px;">
          <img src="${LOGO_URL}" alt="Accelerated Intelligence" style="max-width:160px; height:auto; margin-bottom:16px;" />
        </div>
        <h2 style="font-family:var(--font-display); font-size:24px; color:var(--text); text-align:center; margin-bottom:16px;">Who fixes this stuff?</h2>
        <p style="font-size:16px; color:var(--text); line-height:1.75; text-align:center; max-width:520px; margin:0 auto 20px;">
          Accelerated Intelligence helps B2B companies and professional services firms stop leaking revenue and start scaling with AI-powered systems that actually work.
        </p>
        <p style="font-size:15px; color:var(--text); line-height:1.75; text-align:center; max-width:520px; margin:0 auto 24px;">
          Founded by Brad Costanzo -- 17+ years in direct response marketing, former Fractional CMO for multiple 7 and 8-figure companies, and someone who's built and sold two companies from scratch. He's not a tech vendor pitching software. He's a strategist who uses AI as the lever.
        </p>
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:14px; max-width:500px; margin:0 auto;">
          <div style="padding:16px; background:var(--surface-2); border-radius:12px; text-align:center;">
            <div style="font-size:13px; font-weight:600; color:var(--accent); text-transform:uppercase; letter-spacing:0.06em; margin-bottom:4px;">AI Lead Response</div>
            <div style="font-size:14px; color:var(--text-dim);">Voice + chat agents that respond in seconds, 24/7</div>
          </div>
          <div style="padding:16px; background:var(--surface-2); border-radius:12px; text-align:center;">
            <div style="font-size:13px; font-weight:600; color:var(--accent); text-transform:uppercase; letter-spacing:0.06em; margin-bottom:4px;">Automated Follow-Up</div>
            <div style="font-size:14px; color:var(--text-dim);">CRM-connected sequences that nurture every lead</div>
          </div>
          <div style="padding:16px; background:var(--surface-2); border-radius:12px; text-align:center;">
            <div style="font-size:13px; font-weight:600; color:var(--accent); text-transform:uppercase; letter-spacing:0.06em; margin-bottom:4px;">Reputation Systems</div>
            <div style="font-size:14px; color:var(--text-dim);">Proactive review gen + early warning for issues</div>
          </div>
          <div style="padding:16px; background:var(--surface-2); border-radius:12px; text-align:center;">
            <div style="font-size:13px; font-weight:600; color:var(--accent); text-transform:uppercase; letter-spacing:0.06em; margin-bottom:4px;">Workflow Automation</div>
            <div style="font-size:14px; color:var(--text-dim);">Eliminate manual busywork so growth doesn't break you</div>
          </div>
        </div>
      </div>
    `;

    // CTA
    html += `
      <div class="cta-section">
        <h2 class="cta-title">Let's fix this together.</h2>
        <p class="cta-desc">${ctaMessage}</p>
        <p style="font-size:15px; color:var(--text-dim); line-height:1.7; margin-bottom:28px; max-width:460px; margin-left:auto; margin-right:auto;">No pitch deck. No 90-minute webinar. Just a focused conversation about your specific gaps and what it would take to close them.</p>
        <button class="cta-btn" id="ctaBtn">
          Book a Free Strategy Call with Brad
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </button>
        <div class="cta-alt">Or email Brad directly at <a href="mailto:brad@acceleratedintelligence.ai">brad@acceleratedintelligence.ai</a></div>
      </div>
    `;

    return { html, leakPct };
  }, []);

  // Show results
  const showResults = useCallback((answerIndices) => {
    const { html, leakPct } = buildResultsHtml(answerIndices);
    setResultsHtml(html);
    setScreen('results');
    saveReport(answerIndices);

    // After render, animate bars and wire up calculator
    setTimeout(() => {
      document.querySelectorAll('.cat-bar-fill').forEach(bar => {
        setTimeout(() => { bar.style.width = bar.dataset.width; }, 300);
      });

      // Wire up revenue calculator
      const dealInput = document.getElementById('calcDeal');
      const leadsInput = document.getElementById('calcLeads');
      const calcFn = () => {
        const deal = parseFloat(dealInput?.value) || 0;
        const leads = parseFloat(leadsInput?.value) || 0;
        const resultEl = document.getElementById('calcResult');
        const numEl = document.getElementById('calcNumber');
        if (deal > 0 && leads > 0) {
          const annual = Math.round(leads * 12 * deal * leakPct / 1000) * 1000;
          numEl.textContent = '$' + annual.toLocaleString();
          resultEl.style.display = 'block';
        } else if (resultEl) {
          resultEl.style.display = 'none';
        }
      };
      dealInput?.addEventListener('input', calcFn);
      leadsInput?.addEventListener('input', calcFn);

      // Wire up CTA button
      const ctaBtn = document.getElementById('ctaBtn');
      ctaBtn?.addEventListener('click', () => setModalOpen(true));
    }, 200);

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [buildResultsHtml, saveReport]);

  // Loading screen animation
  const showLoading = useCallback(() => {
    setScreen('loading');
    window.scrollTo({ top: 0, behavior: 'smooth' });

    const statusMessages = [
      'Analyzing your responses...',
      'Evaluating lead generation systems...',
      'Calculating speed-to-lead metrics...',
      'Reviewing follow-up processes...',
      'Assessing online reputation signals...',
      'Measuring scalability potential...',
      'Comparing against industry benchmarks...',
      'Generating personalized recommendations...',
      'Finalizing your growth report...'
    ];

    const totalMs = 10000;
    const interval = 100;
    const steps = totalMs / interval;
    let step = 0;

    loadingTimerRef.current = setInterval(() => {
      step++;
      const progress = Math.min(Math.round((step / steps) * 100), 100);

      const bar = document.getElementById('loadingBarFill');
      const pctEl = document.getElementById('loadingPct');
      const status = document.getElementById('loadingStatus');
      const items = document.querySelectorAll('#loadingChecklist li');

      if (bar) bar.style.width = progress + '%';
      if (pctEl) pctEl.textContent = progress;

      const msgIndex = Math.min(Math.floor((progress / 100) * statusMessages.length), statusMessages.length - 1);
      if (status) status.textContent = statusMessages[msgIndex];

      const checkThreshold = Math.floor((progress / 100) * items.length);
      for (let i = 0; i < checkThreshold; i++) {
        items[i].classList.add('checked');
      }

      if (progress >= 100) {
        clearInterval(loadingTimerRef.current);
        items.forEach(i => i.classList.add('checked'));
        setTimeout(() => showResults(answers), 600);
      }
    }, interval);
  }, [answers, showResults]);

  useEffect(() => {
    return () => {
      if (loadingTimerRef.current) clearInterval(loadingTimerRef.current);
    };
  }, []);

  const selectOption = (idx) => {
    const newAnswers = [...answers];
    newAnswers[currentQ] = idx;
    setAnswers(newAnswers);
  };

  const nextQuestion = () => {
    if (answers[currentQ] === undefined) return;
    if (currentQ === questions.length - 1) {
      showLoading();
    } else {
      setCurrentQ(currentQ + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const prevQuestion = () => {
    if (currentQ > 0) {
      setCurrentQ(currentQ - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setScreen('intro');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const q = questions[currentQ];
  const selected = answers[currentQ] !== undefined ? answers[currentQ] : -1;
  const isLast = currentQ === questions.length - 1;

  return (
    <>
      <div className="container" id="app">

        {/* INTRO */}
        {screen === 'intro' && (
          <div className="intro-screen" id="introScreen">
            <div style={{ textAlign: 'center', marginBottom: '36px' }}>
              <img src={LOGO_URL} alt="Accelerated Intelligence" style={{ maxWidth: '220px', height: 'auto' }} />
            </div>
            <div className="intro-badge">Free Assessment</div>
            <h1 className="intro-title">Is your business <em>leaking revenue</em> without knowing it?</h1>
            <p className="intro-sub">Most businesses lose thousands every month to slow follow-up, broken processes, and gaps they can&apos;t see. This 3-minute assessment shows you exactly where the leaks are and what they&apos;re costing you.</p>
            <div className="intro-meta">
              <div className="intro-meta-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                3 minutes
              </div>
              <div className="intro-meta-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>
                10 questions
              </div>
              <div className="intro-meta-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                100% confidential
              </div>
            </div>
            <button className="start-btn" onClick={() => setScreen('quiz')}>
              Start the Assessment
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </button>
            <div className="intro-trust">
              <p>Built by Brad Costanzo of Accelerated Intelligence, AI implementation specialist. No fluff, no generic advice. Your results are based on the same diagnostic framework used in private consulting sessions with businesses generating $500K to $10M+ in annual revenue.</p>
            </div>
          </div>
        )}

        {/* QUESTIONS */}
        {screen === 'quiz' && (
          <div className="question-screen active" id="questionScreen">
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <img src={LOGO_URL} alt="Accelerated Intelligence" style={{ maxWidth: '180px', height: 'auto' }} />
            </div>
            <div className="progress-wrap">
              <div className="progress-top">
                <div className="progress-label" id="phaseLabel">{q.phase}</div>
                <div className="progress-count"><span>{currentQ + 1}</span> of <span>{questions.length}</span></div>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${((currentQ + 1) / questions.length) * 100}%` }}></div>
              </div>
            </div>
            <div style={{ paddingTop: '28px' }}>
              <div className="q-phase">{q.phase}</div>
              <div className="q-number">Question {q.number} of {questions.length}</div>
              <h2 className="q-text">{q.text}</h2>
              <div className="options">
                {q.options.map((opt, i) => (
                  <div key={i} className={`option ${selected === i ? 'selected' : ''}`} onClick={() => selectOption(i)}>
                    <div className="option-radio"></div>
                    <div className="option-label">{opt.text}</div>
                    <div className="option-letter">{letters[i]}</div>
                  </div>
                ))}
              </div>
              <div className="nav-row">
                <button className="nav-btn back" onClick={prevQuestion}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
                  Back
                </button>
                <button className="nav-btn next" disabled={selected === -1} onClick={nextQuestion}>
                  {isLast ? 'See My Results' : 'Next'}
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* LOADING */}
        {screen === 'loading' && (
          <div className="loading-screen active" id="loadingScreen">
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <img src={LOGO_URL} alt="Accelerated Intelligence" style={{ maxWidth: '180px', height: 'auto' }} />
            </div>
            <div className="loading-icon-wrap">
              <svg className="loading-spinner" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" opacity="0.3"/>
                <path d="M12 2v4"/>
              </svg>
            </div>
            <h2 className="loading-title">Analyzing your responses</h2>
            <p className="loading-status" id="loadingStatus">Analyzing your responses...</p>
            <div className="loading-progress-wrap">
              <div className="loading-bar"><div className="loading-bar-fill" id="loadingBarFill"></div></div>
              <div className="loading-pct"><span id="loadingPct">0</span>%</div>
            </div>
            <ul className="loading-checklist" id="loadingChecklist">
              {['Lead Generation', 'Speed to Lead', 'Follow-up Systems', 'Online Reputation', 'Scalability', 'Growth Vision'].map((item, i) => (
                <li key={i}>
                  <span className="check-icon"><svg viewBox="0 0 10 10" fill="none" stroke="#fff" strokeWidth="2"><path d="M2 5l2.5 2.5L8 3"/></svg></span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* RESULTS */}
        {screen === 'results' && (
          <div className="results-screen active" id="resultsScreen" ref={resultsRef} dangerouslySetInnerHTML={{ __html: resultsHtml }} />
        )}
      </div>

      <FormModal isOpen={modalOpen} onClose={() => setModalOpen(false)} reportUrl={reportUrl} />
    </>
  );
}
