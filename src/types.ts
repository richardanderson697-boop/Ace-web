export type UserRole = 'reader' | 'author' | 'admin';

export type BookGenre = 
  | 'Sci-Fi Thriller' 
  | 'Cyberpunk' 
  | 'Space Opera' 
  | 'Noir Mystery' 
  | 'Audiobook' 
  | 'Dystopian Tech';

export type BookFormat = 'audiobook' | 'ebook' | 'bundle';

export type RoyaltyTierType = 'writesound_bridge' | 'standard_direct' | 'custom_partner';

export interface RoyaltyTier {
  id: RoyaltyTierType;
  name: string;
  creatorShare: number; // e.g., 0.85 or 0.75
  platformShare: number; // e.g., 0.15 or 0.25
  description: string;
  badge: string;
  features: string[];
}

export interface AudioSample {
  url: string;
  durationSeconds: number;
  sampleTitle: string;
  narrator: string;
  chapterNumber?: number;
}

export interface Book {
  id: string;
  title: string;
  subtitle?: string;
  author: string;
  authorId: string;
  narrator?: string;
  genre: BookGenre;
  formats: BookFormat[];
  priceAudio: number;
  priceEbook: number;
  priceBundle: number;
  coverImage: string;
  rating: number;
  reviewCount: number;
  releaseDate: string;
  synopsis: string;
  audioSample: AudioSample;
  royaltyTier: RoyaltyTierType;
  ingestionSource: 'mp3_upload' | 'writesound_api' | 'catalog_sync';
  id3ArtworkExtracted?: boolean;
  totalCopiesSold: number;
  audioUnitsSold: number;
  ebookUnitsSold: number;
  isPreOrder?: boolean;
  featured?: boolean;
}

export interface FanFeedPost {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  verifiedAuthor: boolean;
  type: 'serialized_drop' | 'draft_teaser' | 'preorder_announcement' | 'live_qa';
  title: string;
  content: string;
  bookId?: string;
  bookTitle?: string;
  bookCover?: string;
  price?: number;
  timestamp: string;
  likes: number;
  userLiked?: boolean;
  commentsCount: number;
  comments: FeedComment[];
  audioSnippet?: AudioSample;
  chapterNumber?: number;
}

export interface FeedComment {
  id: string;
  userName: string;
  userAvatar: string;
  isAuthor?: boolean;
  content: string;
  timestamp: string;
  likes: number;
}

export interface DigitalOrder {
  id: string;
  orderNumber: string;
  bookId: string;
  bookTitle: string;
  bookCover: string;
  format: BookFormat;
  buyerName: string;
  buyerEmail: string;
  amount: number;
  royaltyTier: RoyaltyTierType;
  creatorEarnings: number;
  platformFee: number;
  deliveryStatus: 'Delivered' | 'Pending DRM' | 'Processing' | 'Failed';
  drmToken: string;
  date: string;
  stripePaymentIntentId?: string;
  stripeTransferId?: string;
  stripeSplitBreakdown?: {
    gross: number;
    creatorNet: number;
    platformFee: number;
    destinationAccount: string;
    creatorPercentage: string;
  };
  supportTicket?: {
    status: 'open' | 'resolved';
    lastMessage: string;
    sender: 'buyer' | 'author';
  };
}

export interface WriteSoundAuthSession {
  authorId: string;
  authorName: string;
  authorEmail: string;
  token: string;
  sourceStudio: string;
  authenticatedVia: 'write-sound-direct-sso' | 'ace-credentials';
  stripeAccountId: string;
  stripeAccountStatus: 'active' | 'pending_verification' | 'restricted';
  stripeBankPreview: string;
  qualifiesFor85Percent: boolean;
  expiresAt: string;
}

export interface CustomerMessage {
  id: string;
  orderId: string;
  buyerName: string;
  buyerEmail: string;
  subject: string;
  lastMessage: string;
  date: string;
  status: 'unread' | 'read' | 'replied';
  thread: {
    sender: 'buyer' | 'author';
    message: string;
    timestamp: string;
  }[];
}

export interface AuthorTelemetry {
  totalRevenue: number;
  creatorNet: number;
  platformFeeTotal: number;
  totalCopiesSold: number;
  ebookUnitsSold: number;
  ebookCopiesSold?: number;
  audioCopiesSold: number;
  momGrowthPercentage: number;
  pendingEscrow: number;
  nextPayoutDate: string;
  recentMonthlySales: {
    month: string;
    audio: number;
    ebook: number;
    grossRevenue: number;
    creatorNet: number;
  }[];
}

export interface ComplianceReviewItem {
  id: string;
  bookTitle: string;
  author: string;
  ingestionMethod: 'Write-Sound API Payload' | 'Standalone MP3 Upload';
  assignedTier: RoyaltyTierType;
  submittedAt: string;
  id3ArtworkStatus: 'Extracted & Verified' | 'Manual Upload Attached' | 'Pending Inspection';
  audioChecksum: string;
  drmStatus: 'Ready' | 'Inspecting' | 'Flagged';
  complianceStatus: 'Pending Review' | 'Approved' | 'Flagged';
}

export interface SettlementBatch {
  batchId: string;
  period: string;
  totalAuthors: number;
  grossSettlement: number;
  creatorNetPayouts: number;
  acePlatformRetained: number;
  status: 'Completed' | 'Pending Execution' | 'Scheduled';
  settlementDate: string;
}
