import { questions } from './questions';

export function calculateScores(answerIndices) {
  const cats = { lead: [], speed: [], followup: [], reputation: [], scale: [], vision: [] };

  questions.forEach((q, qi) => {
    const chosen = q.options[answerIndices[qi]];
    if (chosen) {
      cats[chosen.cat].push(chosen.score);
    }
  });

  function avg(arr) { return arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0; }

  const catScores = {
    lead: avg(cats.lead),
    speed: avg(cats.speed),
    followup: avg(cats.followup),
    reputation: avg(cats.reputation),
    scale: avg(cats.scale),
    vision: avg(cats.vision),
  };

  const totalScore = Object.values(cats).flat().reduce((a, b) => a + b, 0);
  const maxScore = questions.length * 4;
  const pct = Math.round((totalScore / maxScore) * 100);

  return { catScores, totalScore, maxScore, pct };
}

export function getGrade(pct) {
  if (pct >= 80) return { grade: 'Strong', gradeColor: 'var(--green)', gradeGlow: 'var(--green-glow)', ringColor: '#34D399' };
  if (pct >= 55) return { grade: 'Moderate Gaps', gradeColor: 'var(--amber)', gradeGlow: 'var(--amber-glow)', ringColor: '#FBBF24' };
  return { grade: 'Critical Gaps', gradeColor: 'var(--red)', gradeGlow: 'var(--red-glow)', ringColor: '#F87171' };
}

export function getLeakPct(pct) {
  if (pct >= 80) return 0.05;
  if (pct >= 55) return 0.18;
  return 0.35;
}

export const catMeta = {
  lead: { name: 'Lead Generation & Tracking', icon: '1' },
  speed: { name: 'Speed to Lead', icon: '2' },
  followup: { name: 'Follow-Up Systems', icon: '3' },
  reputation: { name: 'Reputation Management', icon: '4' },
  scale: { name: 'Scalability & Automation', icon: '5' },
  vision: { name: 'Growth Vision', icon: '6' },
};

const feedbackText = {
  lead: {
    low: "You don't have clear visibility into where your customers come from. That means you can't double down on what works or cut what doesn't. Every marketing dollar spent without tracking is a gamble.",
    mid: "You have some lead tracking in place but there are blind spots. Tightening this up would give you real data to make smarter growth decisions.",
    high: "Your lead sources are well-identified and diversified. This puts you in a strong position to optimize spend and scale what's working."
  },
  speed: {
    low: "Your response time is costing you deals. Research shows that responding within 5 minutes makes you 21x more likely to qualify a lead. Every hour of delay drops your odds dramatically.",
    mid: "Your response time is decent but not competitive. In most industries, the first business to respond wins the deal. Shaving even 30 minutes off your response time could move the needle.",
    high: "Your speed-to-lead is strong. This is a real competitive advantage that most businesses don't have."
  },
  followup: {
    low: "Leads that don't convert immediately are falling into a black hole. Without automated follow-up, you're leaving the easiest revenue on the table: people who already raised their hand.",
    mid: "You have some follow-up happening but it's inconsistent. Automating this one area typically produces the fastest ROI of any system change.",
    high: "Your follow-up system is working. Leads are being nurtured and nothing is slipping through the cracks."
  },
  reputation: {
    low: "You have no early warning system for unhappy customers. By the time you see a bad review, the damage is done. One negative review can cost you 30+ potential customers.",
    mid: "You're catching some issues but not all. A consistent feedback loop would protect your brand and turn problems into retention opportunities.",
    high: "You're actively managing your reputation. This builds compounding trust that makes every other part of your marketing work harder for you."
  },
  scale: {
    low: "Your business is running on manual effort. That means growth creates more stress, not more freedom. You're the bottleneck, and more leads would actually make things worse right now.",
    mid: "You have some automation but significant manual work remains. Closing these gaps would free up meaningful time and prepare you for the next level of growth.",
    high: "Your systems are built to scale. Growth would add revenue without proportionally adding chaos. That's the position every business should be in."
  },
  vision: {
    low: "Right now you're stuck in survival mode, reacting to problems instead of building toward something bigger. Fixing the operational gaps would free you to actually work on the business.",
    mid: "You have a clear sense of where you'd invest freed-up time. That vision is important because it means the operational improvements aren't just about efficiency; they're about getting you to the next stage.",
    high: "You have strong clarity on what growth looks like for you. The systems to support that vision are either in place or close to it."
  }
};

export function getCatFeedback(cat, score) {
  if (score <= 2) return feedbackText[cat].low;
  if (score <= 3) return feedbackText[cat].mid;
  return feedbackText[cat].high;
}

export const recTemplates = {
  lead: { title: "Install lead source tracking and attribution", desc: "Know exactly where every lead comes from so you can spend more on what works and cut what doesn't.<br><br>Most businesses are flying blind here, spending on channels that don't convert while underinvesting in the ones that do.<br><br>Proper attribution gives you a clear picture of your real cost per acquisition and lets you make data-driven budget decisions instead of guessing." },
  speed: { title: "Deploy instant lead response (AI receptionist + chat)", desc: "Respond to every inquiry in under 60 seconds, 24/7, with AI voice and chat agents that qualify and route leads automatically.<br><br>Studies show the first business to respond wins the deal up to 78% of the time.<br><br>An AI-powered front line means you never lose a prospect to a voicemail, a missed form submission, or an after-hours inquiry again." },
  followup: { title: "Build automated follow-up sequences", desc: "Create CRM-connected nurture workflows that re-engage cold leads on autopilot, so nothing sits untouched.<br><br>The average prospect needs 7-12 touchpoints before they buy, but most businesses give up after one or two.<br><br>Automated sequences keep you top of mind without adding hours to your week, and they convert leads you've already paid to acquire." },
  reputation: { title: "Set up a reputation management system", desc: "Automatically request reviews from happy customers and intercept unhappy ones before they go public.<br><br>A single negative review can deter 30+ potential customers, and most dissatisfied clients never complain directly -- they just leave a review and move on.<br><br>A proactive system turns your best customers into advocates and catches problems before they become public." },
  scale: { title: "Automate manual workflows and integrations", desc: "Connect your tools, eliminate repetitive tasks, and build systems that scale without adding headcount.<br><br>Right now, growth means more chaos. Every new lead or client adds more manual work to someone's plate.<br><br>Automation flips that equation so that more revenue doesn't automatically mean more stress, more hires, or more hours." },
};

export function getRecommendations(catScores) {
  const sorted = Object.entries(catScores)
    .filter(([k]) => k !== 'vision')
    .sort((a, b) => a[1] - b[1]);
  return sorted.slice(0, 3).map(([k]) => recTemplates[k]);
}

export function getCtaMessage(pct) {
  if (pct >= 80) return "Your systems are solid. A quick conversation could uncover the 10-20% optimization that separates good from great.";
  if (pct >= 55) return "You have real gaps, but they're fixable. A 20-minute call will map out exactly what to fix first and what kind of return to expect.";
  return "You're leaving significant money on the table. The good news: the fixes are straightforward. A focused conversation will show you the fastest path to recapturing that lost revenue.";
}
