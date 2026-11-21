export const pages = [
  'Overview',
  'Video Studio',
  'Brand DNA',
  'Platform Content',
  'Content Calendar',
  'Analytics',
  'Claim Firewall',
  'Settings'
] as const

export type PageName = typeof pages[number]

export type PlatformCaptions = {
  reel?: string
  linkedin?: string
  whatsapp?: string
  youtube?: string
}

export type Clip = {
  id: number
  title: string
  time: string
  end: string
  seconds: number
  score: number
  kind: string
  excerpt: string
  why: string
  status: 'Pending' | 'Approved' | 'Rejected'
  audioProof?: string
  visualProof?: string
  brandFit?: string
  risk?: string
  languageMix?: string
  hookType?: string
  platformCaptions?: PlatformCaptions
}

export type SkippedSegment = {
  id: number
  time: string
  end: string
  reason: string
  clarity: number
  flag: string
}

export type Claim = {
  id: number
  text: string
  status: 'Verified from source' | 'Creator-approved' | 'Held for review'
  timestamp: string
  category: string
  evidence: string
  clipId?: number
}

export type GlossaryItem = {
  id: number
  term: string
  translation: string
  notes: string
  category: 'Slang' | 'Business' | 'Place' | 'Cultural'
}

export type Rule = {
  text: string
  source: string
  on: boolean
  clip?: number
  fresh?: boolean
  confidence?: string
}

export type Post = {
  id?: string
  day: number
  platform: string
  clip: number
  status: 'Draft' | 'Awaiting claim approval' | 'Approved' | 'Scheduled'
  time: string
}

export const initialClips: Clip[] = [
  {
    id: 1,
    title: 'Your first 10 customers',
    time: '02:14',
    end: '02:52',
    seconds: 38,
    score: 96,
    kind: 'Founder insight',
    excerpt: 'Our first ten customers came from conversations, not campaigns.',
    why: 'A concrete takeaway grounded in a personal founder experience.',
    status: 'Pending',
    audioProof: 'Emphasis peak at 02:21 · High vocal energy · 0.94 clarity',
    visualProof: 'Speaker direct close-up · engaging hand gesture · focused lighting',
    brandFit: 'Direct, warm Hyderabad founder tone · no marketing fluff',
    risk: 'Verified from source · No unbacked claims',
    languageMix: 'English 70% + Telugu 30%',
    hookType: 'Founder insight',
    platformCaptions: {
      reel: 'Stop running ads before you have 10 real conversations. Watch the founder breakdown. 💡 #EarlyStage #Startups',
      linkedin: 'Our first ten customers came from conversations, not campaigns.\n\nToo many founders overcomplicate early sales with complex funnels. Here is why unscalable personal conversations beat paid ads every time.\n\nTakeaway: Talk to 10 users this week.',
      whatsapp: 'మొదటి పది మంది కస్టమర్లు సంభాషణల ద్వారా వచ్చారు. Real conversations beat paid campaigns! 🚀'
    }
  },
  {
    id: 2,
    title: 'Why build in Hyderabad?',
    time: '05:32',
    end: '06:16',
    seconds: 44,
    score: 94,
    kind: 'Question hook',
    excerpt: 'Hyderabad lo enduku? Here, your first customers can become your closest collaborators.',
    why: 'An open question creates curiosity in the first three seconds.',
    status: 'Pending',
    audioProof: 'Inquisitive pitch contour at 05:33 · clear bilingual articulation',
    visualProof: 'Medium shot with chai glass · relaxed founder body language',
    brandFit: 'Conversational code-switched Telugu-English phrasing',
    risk: 'Verified from source recording',
    languageMix: 'Telugu 45% + English 55%',
    hookType: 'Question hook',
    platformCaptions: {
      reel: 'Hyderabad lo enduku? The collaborative founder community here is unmatched. ☕ #HyderabadStartups',
      linkedin: 'Why Hyderabad?\n\nBecause here, early adopters are not just users — they become your co-builders.\n\nA reflection on building in India\'s fastest growing tech ecosystem.',
      whatsapp: 'హైదరాబాద్‌లో కస్టమర్లే మా సహచరులయ్యారు. Collaborative ecosystem! 🏙️'
    }
  },
  {
    id: 3,
    title: 'The pivot that changed everything',
    time: '08:05',
    end: '08:56',
    seconds: 51,
    score: 92,
    kind: 'Storytelling',
    excerpt: 'We stopped adding features and listened to the one problem everyone mentioned.',
    why: 'A clear turning point gives this story a natural narrative arc.',
    status: 'Pending',
    audioProof: 'Paced cadence · vocal pause before the key insight at 08:22',
    visualProof: 'Speaker lean-in · dramatic emphasis framing',
    brandFit: 'Vulnerable founder storytelling without hype',
    risk: 'Verified from source recording',
    languageMix: 'English 85% + Telugu 15%',
    hookType: 'Storytelling',
    platformCaptions: {
      reel: 'We spent 6 months building the wrong features until this one conversation. 🔄 #PivotStory #Product',
      linkedin: 'We stopped adding features and listened to the one problem everyone mentioned.\n\nProduct building is about subtraction, not addition. What is one feature you recently removed?',
      whatsapp: 'కొత్త ఫీచర్లు కాకుండా అసలు సమస్యపై దృష్టి పెట్టాం. Subtraction over addition. 🎯'
    }
  },
  {
    id: 4,
    title: 'Pricing without the guesswork',
    time: '11:08',
    end: '11:46',
    seconds: 38,
    score: 88,
    kind: 'Founder insight',
    excerpt: 'We offer the best price in Hyderabad.',
    why: 'A punchy pricing take, with a comparison that needs creator review.',
    status: 'Pending',
    audioProof: 'Assertive vocal inflection at 11:12 · steady vocal pitch',
    visualProof: 'Presenter direct eye contact · gestures toward visual slide',
    brandFit: 'Bold positioning · requires Fact-Lock strict confirmation',
    risk: 'Held for review: Comparative claim unbacked by recording evidence',
    languageMix: 'English 80% + Telugu 20%',
    hookType: 'Founder insight',
    platformCaptions: {
      reel: 'Transparent pricing beats aggressive discounting every time. 💰 #PricingStrategy #Value',
      linkedin: 'Pricing without the guesswork:\n\nClear, transparent pricing builds long-term customer trust faster than seasonal discounts ever will.',
      whatsapp: 'ధర గురించి కస్టమర్లు ఏమన్నారు? Honest pricing wins. 📊'
    }
  },
  {
    id: 5,
    title: 'What makes feedback useful?',
    time: '14:20',
    end: '14:56',
    seconds: 36,
    score: 86,
    kind: 'Question hook',
    excerpt: 'Ask about the last time a problem happened, not whether someone likes your idea.',
    why: 'A practical question framework creators can implement immediately.',
    status: 'Approved',
    audioProof: 'High dynamic vocal contrast · emphasis on "last time" at 14:26',
    visualProof: 'Framing transition · clear facial expression',
    brandFit: 'Actionable guidance reflecting creator authority',
    risk: 'Verified from source recording',
    languageMix: 'English 75% + Telugu 25%',
    hookType: 'Question hook',
    platformCaptions: {
      reel: 'Stop asking if people like your idea. Ask this instead. 🧠 #CustomerResearch #UX',
      linkedin: 'Ask about the last time a problem happened, not whether someone likes your idea.\n\nPeople are terrible at predicting their future behavior, but great at recounting their past friction.',
      whatsapp: 'సమస్య చివరిసారి ఎప్పుడు వచ్చిందో అడగండి. Ask the right questions! ⚡'
    }
  },
  {
    id: 6,
    title: 'Keep your customer close',
    time: '17:42',
    end: '18:22',
    seconds: 40,
    score: 84,
    kind: 'Storytelling',
    excerpt: 'Every Friday, one founder sits with a customer and watches them work.',
    why: 'A repeatable operational habit anchors the closing story.',
    status: 'Approved',
    audioProof: 'Warm conversational cadence · steady audio levels',
    visualProof: 'Wide studio view · natural ambient environment',
    brandFit: 'Relatable and humanized entrepreneurship habit',
    risk: 'Creator-approved · Confirmed weekly recurring visit routine',
    languageMix: 'Telugu 40% + English 60%',
    hookType: 'Storytelling',
    platformCaptions: {
      reel: 'Every Friday, we sit and watch one customer work. Here is why. 🤝 #CustomerCentric',
      linkedin: 'Every Friday, one founder sits with a customer and watches them work.\n\nNo pitch deck. No feedback form. Just silent observation. It will change how you build.',
      whatsapp: 'ప్రతి శుక్రవారం ఒక కస్టమర్‌తో సమయం గడుపుతాం. Observation over opinion. 🌟'
    }
  }
]

export const initialSkippedSegments: SkippedSegment[] = [
  {
    id: 1,
    time: '12:10',
    end: '12:45',
    reason: 'Speech clarity was low and transcript confidence fell to 0.54.',
    clarity: 0.54,
    flag: 'Low clarity'
  },
  {
    id: 2,
    time: '07:15',
    end: '08:04',
    reason: 'Introductory chit-chat and microphone adjustment; hook potential below 70% threshold.',
    clarity: 0.88,
    flag: 'Low engagement'
  },
  {
    id: 3,
    time: '16:05',
    end: '17:40',
    reason: 'Technical logistics tangent and sponsor scheduling off-topic from core thesis.',
    clarity: 0.92,
    flag: 'Off-topic'
  }
]

export const initialClaims: Claim[] = [
  {
    id: 1,
    text: 'Our first ten customers came from conversations.',
    status: 'Verified from source',
    timestamp: '02:14',
    category: 'Customer acquisition',
    evidence: 'Source: Chai with the Founder · 02:14–02:52',
    clipId: 1
  },
  {
    id: 2,
    text: 'Every Friday, one founder sits with a customer.',
    status: 'Creator-approved',
    timestamp: '17:42',
    category: 'Operational habit',
    evidence: 'Creator confirmed the weekly customer visit habit · Clip 06',
    clipId: 6
  },
  {
    id: 3,
    text: 'We offer the best price in Hyderabad.',
    status: 'Held for review',
    timestamp: '11:08',
    category: 'Comparative pricing',
    evidence: 'Clip 04 · No comparative pricing survey or audit evidence in source recording.',
    clipId: 4
  }
]

export const initialGlossary: GlossaryItem[] = [
  {
    id: 1,
    term: 'Hyderabad lo enduku?',
    translation: 'Why in Hyderabad?',
    notes: 'Preserve authentic bilingual conversational phrasing; do not flatten to pure English.',
    category: 'Slang'
  },
  {
    id: 2,
    term: 'Chai with the Founder',
    translation: 'Show title',
    notes: 'Brand show name · Always keep verbatim with initial caps.',
    category: 'Business'
  },
  {
    id: 3,
    term: 'Baga / Chala bagundi',
    translation: 'Very good / Really well',
    notes: 'Colloquial emphasis marker · keep in Telugu subtitles for authenticity.',
    category: 'Cultural'
  },
  {
    id: 4,
    term: 'HITEC City',
    translation: 'Tech district in Hyderabad',
    notes: 'Local landmark · keep exact spelling for searchability.',
    category: 'Place'
  }
]

export const initialPosts: Post[] = [
  { day: 0, platform: 'Instagram Reel', clip: 1, status: 'Approved', time: '10:00' },
  { day: 1, platform: 'LinkedIn', clip: 6, status: 'Scheduled', time: '09:30' },
  { day: 2, platform: 'WhatsApp', clip: 5, status: 'Draft', time: '11:00' },
  { day: 3, platform: 'Instagram Reel', clip: 4, status: 'Awaiting claim approval', time: '14:00' }
]

export const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export const reasons = ['Too salesy', 'Wrong tone', 'Inaccurate', 'Too long']

export const lessons = [
  'Lead with a useful insight, not a sales pitch.',
  'Keep hooks conversational and grounded in local context.',
  'Use only source-supported statements in hooks.',
  'Keep the opening hook under eight words.'
]

export const revisions = [
  [
    'Ten customers, ten real conversations',
    'Why Hyderabad worked for us',
    'Listening before building',
    'What customers told us about pricing',
    'A better way to ask for feedback',
    'A weekly habit for founders'
  ],
  [
    'Let’s talk about our first customers',
    'So, why Hyderabad?',
    'Here’s why we changed course',
    'Let’s talk about pricing',
    'What did your customer actually say?',
    'One habit we kept'
  ],
  [
    'We started with ten conversations',
    'Our founder’s Hyderabad story',
    'One problem changed our roadmap',
    'A founder’s perspective on pricing',
    'Questions from customer interviews',
    'Inside our Friday customer visits'
  ],
  [
    'First customers, real conversations',
    'Why Hyderabad?',
    'The pivot that mattered',
    'Rethinking our price',
    'Ask better questions',
    'Listen every Friday'
  ]
]
