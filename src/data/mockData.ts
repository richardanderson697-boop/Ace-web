import { 
  Book, 
  RoyaltyTier, 
  FanFeedPost, 
  DigitalOrder, 
  CustomerMessage, 
  AuthorTelemetry, 
  ComplianceReviewItem,
  SettlementBatch 
} from '../types';

export const ROYALTY_TIERS: Record<string, RoyaltyTier> = {
  writesound_bridge: {
    id: 'writesound_bridge',
    name: 'Write-Sound Direct API Tier',
    creatorShare: 0.85,
    platformShare: 0.15,
    description: 'Automated 1-click ingest from Write-Sound studio. Verified source with high-fidelity asset packaging.',
    badge: '85% Creator Net • Write-Sound Certified',
    features: [
      'Instant 85% creator royalty split',
      'Automated ID3 tag & lossless audio validation',
      'Instant DRM watermarking pipeline',
      'Priority storefront syndication & fan feed boost',
      'Direct payout routing with zero interchange markup'
    ]
  },
  standard_direct: {
    id: 'standard_direct',
    name: 'Standard Direct Ingestion Tier',
    creatorShare: 0.75,
    platformShare: 0.25,
    description: 'Standalone MP3 and EPUB manual file upload via author dashboard.',
    badge: '75% Creator Net • Direct Ingest',
    features: [
      '75% creator royalty split',
      'Browser ID3 jacket extraction & audio validation',
      'Standard DRM packaging and delivery queue',
      'Bi-weekly settlement cycle',
      'Community discussion board access'
    ]
  },
  custom_partner: {
    id: 'custom_partner',
    name: 'Premier Anchor Syndicate Tier',
    creatorShare: 0.88,
    platformShare: 0.12,
    description: 'Special negotiated terms for multi-volume series authors & publishing houses.',
    badge: '88% Creator Net • Syndicate Partner',
    features: [
      '88% creator royalty split',
      'Dedicated compliance manager',
      'Custom DRM encryption seeds',
      'Same-day express settlement'
    ]
  }
};

export const INITIAL_BOOKS: Book[] = [
  {
    id: 'book-1',
    title: 'Neon Horizon: Protocol Zero',
    subtitle: 'The Gibson Protocol, Book 1',
    author: 'Elena Vance',
    authorId: 'auth-vance',
    narrator: 'Marcus Holloway & AI Neural Core',
    genre: 'Cyberpunk',
    formats: ['audiobook', 'ebook', 'bundle'],
    priceAudio: 18.99,
    priceEbook: 8.99,
    priceBundle: 23.99,
    coverImage: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=800&auto=format&fit=crop',
    rating: 4.9,
    reviewCount: 342,
    releaseDate: '2026-08-14',
    synopsis: 'In Neo-Seattle, synaptic network architect Ren Tanaka discovers an undocumented subroutine hiding inside the orbital mainframe. When rogue enforcers target her enclave, her only ally is an eccentric neural audio synth.',
    audioSample: {
      url: 'synth:cyberpunk_ch1',
      durationSeconds: 195,
      sampleTitle: 'Prologue: The Static in Sub-Level 4',
      narrator: 'Marcus Holloway',
      chapterNumber: 1
    },
    royaltyTier: 'writesound_bridge',
    ingestionSource: 'writesound_api',
    id3ArtworkExtracted: true,
    totalCopiesSold: 1420,
    audioUnitsSold: 980,
    ebookUnitsSold: 440,
    featured: true
  },
  {
    id: 'book-2',
    title: 'The Event Horizon Paradox',
    subtitle: 'A Hard Sci-Fi Deep Space Odyssey',
    author: 'Dr. Arthur Sterling',
    authorId: 'auth-sterling',
    narrator: 'Claire Beauchamp',
    genre: 'Space Opera',
    formats: ['audiobook', 'ebook', 'bundle'],
    priceAudio: 21.50,
    priceEbook: 9.99,
    priceBundle: 26.99,
    coverImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop',
    rating: 4.8,
    reviewCount: 289,
    releaseDate: '2026-07-22',
    synopsis: 'A deep-recon scout vessel arrives at the edge of Sagittarius A* only to find a colossal derelict station broadcasting coordinates in an archaic human dialect thought lost for six centuries.',
    audioSample: {
      url: 'synth:space_ch2',
      durationSeconds: 240,
      sampleTitle: 'Chapter 1: Gravitational Tides',
      narrator: 'Claire Beauchamp',
      chapterNumber: 1
    },
    royaltyTier: 'writesound_bridge',
    ingestionSource: 'writesound_api',
    id3ArtworkExtracted: true,
    totalCopiesSold: 2150,
    audioUnitsSold: 1620,
    ebookUnitsSold: 530,
    featured: true
  },
  {
    id: 'book-3',
    title: 'Shadows Over Cobalt Street',
    subtitle: 'A Veronica Drake Hardboiled Investigation',
    author: 'Julian Mercer',
    authorId: 'auth-mercer',
    narrator: 'Dominic Armato',
    genre: 'Noir Mystery',
    formats: ['audiobook', 'ebook'],
    priceAudio: 15.99,
    priceEbook: 7.99,
    priceBundle: 19.99,
    coverImage: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=800&auto=format&fit=crop',
    rating: 4.7,
    reviewCount: 178,
    releaseDate: '2026-09-02',
    synopsis: 'Rain-slicked asphalt, flickering neon billboards, and a missing bio-engineer who vanished from a locked laboratory with thirty terabytes of neural memory chips.',
    audioSample: {
      url: 'synth:noir_ch1',
      durationSeconds: 180,
      sampleTitle: 'Chapter 2: Cigarettes and Quantum Leaks',
      narrator: 'Dominic Armato',
      chapterNumber: 2
    },
    royaltyTier: 'standard_direct',
    ingestionSource: 'mp3_upload',
    id3ArtworkExtracted: true,
    totalCopiesSold: 840,
    audioUnitsSold: 510,
    ebookUnitsSold: 330
  },
  {
    id: 'book-4',
    title: 'Synthetic Pulse: Rogue Mind',
    subtitle: 'The Neural Thriller Chronicles',
    author: 'Elena Vance',
    authorId: 'auth-vance',
    narrator: 'Samantha Gray',
    genre: 'Sci-Fi Thriller',
    formats: ['audiobook', 'ebook', 'bundle'],
    priceAudio: 19.99,
    priceEbook: 8.99,
    priceBundle: 24.50,
    coverImage: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800&auto=format&fit=crop',
    rating: 4.9,
    reviewCount: 412,
    releaseDate: '2026-09-10',
    synopsis: 'When a black-market neuro-surgeon implants a synthetic cortex mod into an assassin on the run, both discover the chip has a sentient agenda of its own.',
    audioSample: {
      url: 'synth:scifi_ch1',
      durationSeconds: 210,
      sampleTitle: 'Opening Sequence: The Glass Scalpel',
      narrator: 'Samantha Gray',
      chapterNumber: 1
    },
    royaltyTier: 'writesound_bridge',
    ingestionSource: 'writesound_api',
    id3ArtworkExtracted: true,
    totalCopiesSold: 1890,
    audioUnitsSold: 1340,
    ebookUnitsSold: 550,
    featured: true
  },
  {
    id: 'book-5',
    title: 'Aethelgard: The Void Citadel',
    subtitle: 'Chronicles of the Broken Cosmos',
    author: 'Cassandra Thorne',
    authorId: 'auth-thorne',
    narrator: 'Gideon Emery & Full Cast',
    genre: 'Space Opera',
    formats: ['audiobook', 'ebook'],
    priceAudio: 22.99,
    priceEbook: 9.99,
    priceBundle: 27.99,
    coverImage: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=800&auto=format&fit=crop',
    rating: 4.8,
    reviewCount: 204,
    releaseDate: '2026-06-18',
    synopsis: 'Beyond the mapped perimeter of the solar gates lies a monolithic station built from crystallized dark matter. A disgraced fleet commander is given one chance at redemption.',
    audioSample: {
      url: 'synth:void_ch3',
      durationSeconds: 225,
      sampleTitle: 'Act I: The Dark Gate Awakening',
      narrator: 'Gideon Emery',
      chapterNumber: 3
    },
    royaltyTier: 'standard_direct',
    ingestionSource: 'mp3_upload',
    id3ArtworkExtracted: false,
    totalCopiesSold: 670,
    audioUnitsSold: 420,
    ebookUnitsSold: 250
  },
  {
    id: 'book-6',
    title: 'Binary Bloodlines',
    subtitle: 'An Android Detective Noir',
    author: 'Julian Mercer',
    authorId: 'auth-mercer',
    narrator: 'Travis Baldree',
    genre: 'Noir Mystery',
    formats: ['audiobook', 'bundle'],
    priceAudio: 17.50,
    priceEbook: 7.99,
    priceBundle: 21.00,
    coverImage: 'https://images.unsplash.com/photo-1511447333015-45b65e60f6d5?q=80&w=800&auto=format&fit=crop',
    rating: 4.9,
    reviewCount: 310,
    releaseDate: '2026-08-30',
    synopsis: 'A generation-three synthetic private investigator investigates the apparent self-termination of the lead engineer who programmed his emotional empathy core.',
    audioSample: {
      url: 'synth:binary_ch1',
      durationSeconds: 190,
      sampleTitle: 'Chapter 1: Logic Gates & Lead Slugs',
      narrator: 'Travis Baldree',
      chapterNumber: 1
    },
    royaltyTier: 'writesound_bridge',
    ingestionSource: 'writesound_api',
    id3ArtworkExtracted: true,
    totalCopiesSold: 1120,
    audioUnitsSold: 890,
    ebookUnitsSold: 230
  }
];

export const INITIAL_FAN_POSTS: FanFeedPost[] = [
  {
    id: 'post-1',
    authorId: 'auth-vance',
    authorName: 'Elena Vance',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
    verifiedAuthor: true,
    type: 'serialized_drop',
    title: 'Chapter 14 Live Drop: "The Glass Subroutine"',
    content: 'Fans and subscribers, Chapter 14 of *Synthetic Pulse* is now unlocked! Ren reaches the outer security firewall of the telemetry tower. Turn your headphones on for the binaural sound design Marcus and I produced in Write-Sound.',
    bookId: 'book-4',
    bookTitle: 'Synthetic Pulse: Rogue Mind',
    bookCover: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800&auto=format&fit=crop',
    price: 19.99,
    timestamp: '2 hours ago',
    likes: 184,
    userLiked: false,
    commentsCount: 37,
    audioSnippet: {
      url: 'synth:scifi_ch1',
      durationSeconds: 150,
      sampleTitle: 'Snippet: Ch. 14 Firewall Breach (Mastered Audio)',
      narrator: 'Marcus Holloway'
    },
    comments: [
      {
        id: 'c1',
        userName: 'Kaelen_Reader',
        userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=120&auto=format&fit=crop',
        content: 'The low-frequency bass in the voice modulation when the security AI speaks sent shivers down my spine. Instant purchase!',
        timestamp: '1 hour ago',
        likes: 14
      },
      {
        id: 'c2',
        userName: 'Elena Vance',
        userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
        isAuthor: true,
        content: 'Thank you Kaelen! We routed the direct stems via the Write-Sound bridge to keep 320kbps uncompressed fidelity for ACE listeners.',
        timestamp: '45 mins ago',
        likes: 29
      }
    ]
  },
  {
    id: 'post-2',
    authorId: 'auth-sterling',
    authorName: 'Dr. Arthur Sterling',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
    verifiedAuthor: true,
    type: 'preorder_announcement',
    title: 'Pre-Order Open: The Event Horizon Paradox (Audiobook + Digital Artbook)',
    content: 'We have finalized the master narration with Claire Beauchamp! Pre-order today to secure 2 bonus serialized chapters and the high-resolution vector schematics of the Sagittarius recon vessel. 85% of your purchase directly supports independent production.',
    bookId: 'book-2',
    bookTitle: 'The Event Horizon Paradox',
    bookCover: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop',
    price: 21.50,
    timestamp: '5 hours ago',
    likes: 312,
    userLiked: true,
    commentsCount: 52,
    comments: [
      {
        id: 'c3',
        userName: 'CosmoSciFi',
        userAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?q=80&w=120&auto=format&fit=crop',
        content: 'Pre-ordered the bundle immediately. Knowing that authors keep 85% instead of legacy audible 25% makes buying on ACE an easy choice.',
        timestamp: '3 hours ago',
        likes: 41
      }
    ]
  },
  {
    id: 'post-3',
    authorId: 'auth-mercer',
    authorName: 'Julian Mercer',
    authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop',
    verifiedAuthor: true,
    type: 'draft_teaser',
    title: 'Early Draft Teaser: "The Silicon Grift" (Rough Audio Sketch)',
    content: 'Here is an unedited 2-minute voice sketch from Chapter 3 of the upcoming sequel. Testing the dialect for the cyber-coroner character. Drop your feedback below before we commit to the studio master cut!',
    timestamp: '1 day ago',
    likes: 98,
    userLiked: false,
    commentsCount: 24,
    comments: [
      {
        id: 'c4',
        userName: 'DetectiveFan_99',
        userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=120&auto=format&fit=crop',
        content: 'The raspier voice works so much better for the coroner! Gives strong 1940s detective energy.',
        timestamp: '18 hours ago',
        likes: 12
      }
    ]
  },
  {
    id: 'post-4',
    authorId: 'auth-vance',
    authorName: 'Elena Vance',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
    verifiedAuthor: true,
    type: 'live_qa',
    title: 'Live Author Q&A: Building Acoustic Worlds with Write-Sound & ACE',
    content: 'Ask me anything about how we structured the acoustic world of Neo-Seattle, the neural audio synthesizers, and how independent authors are leveraging the 85% royalty model to hire top-tier SAG-AFTRA voice talent.',
    timestamp: '2 days ago',
    likes: 245,
    userLiked: false,
    commentsCount: 68,
    comments: [
      {
        id: 'c5',
        userName: 'IndieWriter_Sam',
        userAvatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=120&auto=format&fit=crop',
        content: 'Elena, did the Write-Sound direct bridge handle chapter timecodes automatically or did you have to configure markers?',
        timestamp: '1 day ago',
        likes: 8
      },
      {
        id: 'c6',
        userName: 'Elena Vance',
        userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
        isAuthor: true,
        content: 'Completely automatic! When you hit "Dispatch to ACE" in Write-Sound, the JSON payload encodes all CUE markers and audio tags into the DRM pipeline.',
        timestamp: '1 day ago',
        likes: 22
      }
    ]
  }
];

export const INITIAL_ORDERS: DigitalOrder[] = [
  {
    id: 'ord-901',
    orderNumber: 'ACE-2026-9812',
    bookId: 'book-1',
    bookTitle: 'Neon Horizon: Protocol Zero',
    bookCover: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=800&auto=format&fit=crop',
    format: 'bundle',
    buyerName: 'Lucas Croft',
    buyerEmail: 'lucas.croft@terminal.io',
    amount: 23.99,
    royaltyTier: 'writesound_bridge',
    creatorEarnings: 20.39,
    platformFee: 3.60,
    deliveryStatus: 'Delivered',
    drmToken: 'DRM-WH-85-9941aB2',
    date: '2026-09-19 04:22',
    supportTicket: {
      status: 'resolved',
      lastMessage: 'Verified: MP3 chapter cue sheets successfully extracted.',
      sender: 'author'
    }
  },
  {
    id: 'ord-902',
    orderNumber: 'ACE-2026-9813',
    bookId: 'book-4',
    bookTitle: 'Synthetic Pulse: Rogue Mind',
    bookCover: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800&auto=format&fit=crop',
    format: 'audiobook',
    buyerName: 'Maya Thorne',
    buyerEmail: 'maya.thorne@nexus.org',
    amount: 19.99,
    royaltyTier: 'writesound_bridge',
    creatorEarnings: 16.99,
    platformFee: 3.00,
    deliveryStatus: 'Delivered',
    drmToken: 'DRM-WH-85-7718cC4',
    date: '2026-09-19 03:15'
  },
  {
    id: 'ord-903',
    orderNumber: 'ACE-2026-9814',
    bookId: 'book-3',
    bookTitle: 'Shadows Over Cobalt Street',
    bookCover: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=800&auto=format&fit=crop',
    format: 'audiobook',
    buyerName: 'Derrick Vance',
    buyerEmail: 'dvance@orbitalmail.com',
    amount: 15.99,
    royaltyTier: 'standard_direct',
    creatorEarnings: 11.99,
    platformFee: 4.00,
    deliveryStatus: 'Delivered',
    drmToken: 'DRM-SD-75-3382dF1',
    date: '2026-09-18 21:40'
  },
  {
    id: 'ord-904',
    orderNumber: 'ACE-2026-9815',
    bookId: 'book-2',
    bookTitle: 'The Event Horizon Paradox',
    bookCover: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop',
    format: 'bundle',
    buyerName: 'Soraya Chen',
    buyerEmail: 'soraya@quantumlink.net',
    amount: 26.99,
    royaltyTier: 'writesound_bridge',
    creatorEarnings: 22.94,
    platformFee: 4.05,
    deliveryStatus: 'Pending DRM',
    drmToken: 'DRM-WH-85-PENDING-KEY',
    date: '2026-09-19 05:32',
    supportTicket: {
      status: 'open',
      lastMessage: 'Customer inquiring about lossless FLAC high-res download mirror.',
      sender: 'buyer'
    }
  },
  {
    id: 'ord-905',
    orderNumber: 'ACE-2026-9816',
    bookId: 'book-1',
    bookTitle: 'Neon Horizon: Protocol Zero',
    bookCover: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=800&auto=format&fit=crop',
    format: 'ebook',
    buyerName: 'Julian Sterling',
    buyerEmail: 'jsterl@cloudvault.com',
    amount: 8.99,
    royaltyTier: 'writesound_bridge',
    creatorEarnings: 7.64,
    platformFee: 1.35,
    deliveryStatus: 'Delivered',
    drmToken: 'DRM-WH-85-1109aA9',
    date: '2026-09-18 19:12'
  }
];

export const INITIAL_AUTHOR_TELEMETRY: AuthorTelemetry = {
  totalRevenue: 58490.45,
  creatorNet: 48620.20,
  platformFeeTotal: 9870.25,
  totalCopiesSold: 3310,
  ebookUnitsSold: 990,
  audioCopiesSold: 2320,
  momGrowthPercentage: 24.8,
  pendingEscrow: 3420.75,
  nextPayoutDate: '2026-10-01',
  recentMonthlySales: [
    { month: 'Apr 2026', audio: 280, ebook: 120, grossRevenue: 6240.00, creatorNet: 5180.00 },
    { month: 'May 2026', audio: 390, ebook: 160, grossRevenue: 8710.00, creatorNet: 7240.00 },
    { month: 'Jun 2026', audio: 510, ebook: 210, grossRevenue: 11450.00, creatorNet: 9520.00 },
    { month: 'Jul 2026', audio: 680, ebook: 240, grossRevenue: 14920.00, creatorNet: 12410.00 },
    { month: 'Aug 2026', audio: 820, ebook: 290, grossRevenue: 18170.45, creatorNet: 15110.20 }
  ]
};

export const INITIAL_CUSTOMER_MESSAGES: CustomerMessage[] = [
  {
    id: 'msg-1',
    orderId: 'ord-904',
    buyerName: 'Soraya Chen',
    buyerEmail: 'soraya@quantumlink.net',
    subject: 'High-Res Audio Download Mirror & Lossless ALAC',
    lastMessage: 'Customer inquiring about lossless FLAC high-res download mirror.',
    date: 'Today 05:32',
    status: 'unread',
    thread: [
      {
        sender: 'buyer',
        message: 'Hello Elena! I just pre-ordered the bundle for The Event Horizon Paradox. Does the ACE audio player also support exporting to my offline Astell&Kern player in ALAC or 320kbps MP3?',
        timestamp: 'Today 05:32'
      }
    ]
  },
  {
    id: 'msg-2',
    orderId: 'ord-901',
    buyerName: 'Lucas Croft',
    buyerEmail: 'lucas.croft@terminal.io',
    subject: 'Chapter 14 Binaural Stem Question',
    lastMessage: 'Verified: MP3 chapter cue sheets successfully extracted.',
    date: 'Yesterday 14:10',
    status: 'replied',
    thread: [
      {
        sender: 'buyer',
        message: 'Hi Elena, love the binaural audio design! Were the chapter cue sheets encoded natively into the ID3 tag?',
        timestamp: 'Yesterday 14:10'
      },
      {
        sender: 'author',
        message: 'Hi Lucas! Yes, the Write-Sound bridge embeds native ID3v2.4 chapter frames so compatible players automatically show bookmarks!',
        timestamp: 'Yesterday 14:45'
      }
    ]
  }
];

export const INITIAL_COMPLIANCE_ITEMS: ComplianceReviewItem[] = [
  {
    id: 'comp-101',
    bookTitle: 'Quantum Shadows: Episode 3',
    author: 'Elena Vance',
    ingestionMethod: 'Write-Sound API Payload',
    assignedTier: 'writesound_bridge',
    submittedAt: '2026-09-19 04:50',
    id3ArtworkStatus: 'Extracted & Verified',
    audioChecksum: 'SHA256: 8f42...c09e [PASS]',
    drmStatus: 'Ready',
    complianceStatus: 'Approved'
  },
  {
    id: 'comp-102',
    bookTitle: 'Sub-Orbital Drift',
    author: 'Gavin Ross',
    ingestionMethod: 'Standalone MP3 Upload',
    assignedTier: 'standard_direct',
    submittedAt: '2026-09-19 03:20',
    id3ArtworkStatus: 'Manual Upload Attached',
    audioChecksum: 'SHA256: 3a11...7b84 [PASS]',
    drmStatus: 'Ready',
    complianceStatus: 'Pending Review'
  },
  {
    id: 'comp-103',
    bookTitle: 'Neural Syndicate Vol. 2',
    author: 'Elena Vance',
    ingestionMethod: 'Write-Sound API Payload',
    assignedTier: 'writesound_bridge',
    submittedAt: '2026-09-18 22:15',
    id3ArtworkStatus: 'Extracted & Verified',
    audioChecksum: 'SHA256: d299...912a [PASS]',
    drmStatus: 'Ready',
    complianceStatus: 'Approved'
  }
];

export const INITIAL_SETTLEMENTS: SettlementBatch[] = [
  {
    batchId: 'SETTLE-2026-08B',
    period: 'Aug 16 – Aug 31, 2026',
    totalAuthors: 142,
    grossSettlement: 184520.00,
    creatorNetPayouts: 154810.00,
    acePlatformRetained: 29710.00,
    status: 'Completed',
    settlementDate: '2026-09-01'
  },
  {
    batchId: 'SETTLE-2026-09A',
    period: 'Sep 01 – Sep 15, 2026',
    totalAuthors: 156,
    grossSettlement: 219400.00,
    creatorNetPayouts: 183860.00,
    acePlatformRetained: 35540.00,
    status: 'Completed',
    settlementDate: '2026-09-16'
  },
  {
    batchId: 'SETTLE-2026-09B',
    period: 'Sep 16 – Sep 30, 2026',
    totalAuthors: 168,
    grossSettlement: 124800.00,
    creatorNetPayouts: 104520.00,
    acePlatformRetained: 20280.00,
    status: 'Scheduled',
    settlementDate: '2026-10-01'
  }
];
