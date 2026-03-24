export const questions = [
  {
    phase: "Phase 1: Current performance",
    number: 1,
    text: "Where do most of your customers find you right now?",
    options: [
      { text: "Referrals and word of mouth (almost entirely)", score: 2, cat: "lead" },
      { text: "Mix of referrals plus some online (Google, social, ads)", score: 3, cat: "lead" },
      { text: "Strong online presence with multiple lead sources", score: 4, cat: "lead" },
      { text: "Honestly, I'm not sure where most leads come from", score: 1, cat: "lead" },
    ]
  },
  {
    phase: "Phase 1: Current performance",
    number: 2,
    text: "How many inbound leads or inquiries does your team handle in a typical week?",
    options: [
      { text: "Fewer than 10", score: 2, cat: "lead" },
      { text: "10 to 30", score: 3, cat: "lead" },
      { text: "30 to 100+", score: 4, cat: "lead" },
      { text: "I don't have a reliable way to track this", score: 1, cat: "lead" },
    ]
  },
  {
    phase: "Phase 1: Current performance",
    number: 3,
    text: "If a high-value prospect reaches out at a busy time or after hours, what usually happens?",
    options: [
      { text: "They get an immediate response from a system or person", score: 4, cat: "speed" },
      { text: "Someone gets back to them within a few hours", score: 3, cat: "speed" },
      { text: "It depends on who's available. Could be hours, could be days.", score: 2, cat: "speed" },
      { text: "They probably don't hear back until the next business day, if at all", score: 1, cat: "speed" },
    ]
  },
  {
    phase: "Phase 2: Revenue leaks",
    number: 4,
    text: "What happens to leads that don't convert in the first week?",
    options: [
      { text: "They enter an automated nurture sequence and get followed up with", score: 4, cat: "followup" },
      { text: "Someone manually follows up when they remember", score: 2, cat: "followup" },
      { text: "They sit in a spreadsheet or CRM and mostly get forgotten", score: 1, cat: "followup" },
      { text: "We don't really have a process for this", score: 1, cat: "followup" },
    ]
  },
  {
    phase: "Phase 2: Revenue leaks",
    number: 5,
    text: "If a customer has a bad experience, what system catches it before it becomes a public review?",
    options: [
      { text: "We have an automated feedback loop that flags unhappy customers", score: 4, cat: "reputation" },
      { text: "We check in manually but it's not consistent", score: 2, cat: "reputation" },
      { text: "We usually find out when the bad review is already posted", score: 1, cat: "reputation" },
      { text: "We don't have anything in place for this", score: 1, cat: "reputation" },
    ]
  },
  {
    phase: "Phase 2: Revenue leaks",
    number: 6,
    text: "If your lead volume doubled overnight, could your team handle it without dropping the ball?",
    options: [
      { text: "Yes, our systems would scale with us", score: 4, cat: "scale" },
      { text: "We could manage short-term but it would get messy", score: 3, cat: "scale" },
      { text: "We'd be in trouble pretty quickly", score: 2, cat: "scale" },
      { text: "It would break us. We're already stretched.", score: 1, cat: "scale" },
    ]
  },
  {
    phase: "Phase 3: Growth readiness",
    number: 7,
    text: "How quickly does your team respond to a brand-new lead right now?",
    options: [
      { text: "Under 5 minutes, every time", score: 4, cat: "speed" },
      { text: "Usually within an hour", score: 3, cat: "speed" },
      { text: "Same day, most of the time", score: 2, cat: "speed" },
      { text: "It varies wildly depending on the day", score: 1, cat: "speed" },
    ]
  },
  {
    phase: "Phase 3: Growth readiness",
    number: 8,
    text: "When a prospect researches you online before making contact, what do they find?",
    options: [
      { text: "Strong, recent reviews plus professional web presence", score: 4, cat: "reputation" },
      { text: "Decent reviews but our online presence could be stronger", score: 3, cat: "reputation" },
      { text: "Mixed reviews or very few reviews", score: 2, cat: "reputation" },
      { text: "I'm not confident in what they'd find", score: 1, cat: "reputation" },
    ]
  },
  {
    phase: "Phase 3: Growth readiness",
    number: 9,
    text: "How much of your week is spent on tasks that a system could handle for you?",
    options: [
      { text: "Very little, we've automated most of the repetitive work", score: 4, cat: "scale" },
      { text: "A few hours each week on things that should be automated", score: 3, cat: "scale" },
      { text: "A significant chunk. A lot of what we do is still manual.", score: 2, cat: "scale" },
      { text: "Most of it. We're doing everything by hand.", score: 1, cat: "scale" },
    ]
  },
  {
    phase: "Phase 3: Growth readiness",
    number: 10,
    text: "If all of these gaps were fixed automatically, where would you invest your freed-up time?",
    options: [
      { text: "Growing revenue: new markets, partnerships, higher-ticket offers", score: 4, cat: "vision" },
      { text: "Improving customer experience and retention", score: 3, cat: "vision" },
      { text: "Finally taking time off without the business falling apart", score: 3, cat: "vision" },
      { text: "I'd just like to stop putting out fires every day", score: 2, cat: "vision" },
    ]
  }
];
