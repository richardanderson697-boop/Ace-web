import React, { useState } from 'react';
import { 
  Upload, 
  FileAudio, 
  Image as ImageIcon, 
  Zap, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  Code2, 
  ShieldCheck, 
  ArrowRight,
  Disc,
  Radio,
  FileCheck,
  KeyRound,
  Lock,
  ExternalLink,
  CreditCard,
  UserCheck
} from 'lucide-react';
import { Book, BookGenre, RoyaltyTierType } from '../../types';

interface DirectIngestionProps {
  onPublishBook: (newBook: Book) => void;
}

export const DirectIngestion: React.FC<DirectIngestionProps> = ({ onPublishBook }) => {
  const [ingestMode, setIngestMode] = useState<'mp3_manual' | 'writesound_bridge'>('writesound_bridge');
  
  // MP3 Upload State
  const [uploadedMp3Name, setUploadedMp3Name] = useState<string | null>(null);
  const [mp3Duration, setMp3Duration] = useState<number>(185);
  const [isProcessingMp3, setIsProcessingMp3] = useState(false);
  const [extractId3Artwork, setExtractId3Artwork] = useState<boolean>(true);
  const [customCoverUrl, setCustomCoverUrl] = useState<string>('');
  
  // Book Metadata Form
  const [title, setTitle] = useState('Singularity Gate: The Outer Rim');
  const [subtitle, setSubtitle] = useState('Deep Space Protocol, Vol. 2');
  const [authorName, setAuthorName] = useState('Elena Vance');
  const [narratorName, setNarratorName] = useState('Samantha Gray');
  const [genre, setGenre] = useState<BookGenre>('Space Opera');
  const [priceAudio, setPriceAudio] = useState<number>(19.99);
  const [priceEbook, setPriceEbook] = useState<number>(8.99);
  const [priceBundle, setPriceBundle] = useState<number>(24.99);
  const [synopsis, setSynopsis] = useState('At the outer navigational beacon of the Centauri relay, a communications officer intercepts a telemetry burst from an uncatalogued dreadnought drifting inside a stellar nebula.');

  // Write-Sound Bridge Payload State
  const [isBridgeDispatched, setIsBridgeDispatched] = useState(false);
  const [isBridgeLoading, setIsBridgeLoading] = useState(false);
  const [showPayloadInspector, setShowPayloadInspector] = useState(false);
  const [showAuthExplanation, setShowAuthExplanation] = useState(false);

  // Write-Sound Studio Active SSO & Ingestion Payload
  const writeSoundPayload = {
    headers: {
      "Authorization": "Bearer ws_tok_elena_vance_2026_88b14a90f",
      "X-WriteSound-Author-ID": "auth_elena_vance",
      "X-WriteSound-Author-Email": "elena.vance@writesound.studio",
      "X-WriteSound-Stripe-Account": "acct_ws_elena_vance_85",
      "X-WriteSound-HMAC-Signature": "sha256=4e99f81a88b1390df7ac4d50821"
    },
    event: 'WRITESOUND_ASSET_DISPATCH',
    version: '2026.3.1',
    studioSourceId: 'WS-STUDIO-VANCE-881',
    authorIdentity: {
      authenticated: true,
      authProvider: 'write-sound-direct-sso',
      authorId: 'auth_elena_vance',
      authorName: authorName || 'Elena Vance',
      authorEmail: 'elena.vance@writesound.studio',
      stripeConnectedAccountId: 'acct_ws_elena_vance_85',
      stripeStatus: 'verified_kyc_instant_payouts_active'
    },
    assetPackage: {
      audioMasterChecksum: 'SHA256: 4e99f81a88b1390df7ac4',
      format: 'MPEG-4 AAC / 320kbps Lossless Stem Matched',
      sampleRateHz: 48000,
      embeddedChapters: 18,
      id3Metadata: {
        title: title || 'Singularity Gate: The Outer Rim',
        artist: authorName || 'Elena Vance',
        narrator: narratorName || 'Samantha Gray',
        year: 2026,
        jacketArtworkAttached: true
      }
    },
    royaltyContract: {
      tier: 'writesound_bridge',
      creatorNetRate: 0.85, // 85% Creator Direct Split
      acePlatformFeeRate: 0.15,
      stripeSplitConfig: {
        destinationAccount: 'acct_ws_elena_vance_85',
        applicationFeePercent: 15,
        currency: 'usd'
      }
    }
  };

  const handleSimulateMp3Drop = () => {
    setIsProcessingMp3(true);
    setTimeout(() => {
      setUploadedMp3Name('Singularity_Gate_Master_Ch1_48kHz_320k.mp3');
      setMp3Duration(210);
      setIsProcessingMp3(false);
    }, 900);
  };

  const handleDispatchWriteSoundBridge = async () => {
    setIsBridgeLoading(true);
    try {
      // Call backend write-sound verification endpoint
      const res = await fetch('/api/auth/write-sound-verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: 'ws_tok_elena_vance_2026_88b14a90f',
          authorId: 'auth_elena_vance',
          email: 'elena.vance@writesound.studio',
          authorName,
          stripeAccountId: 'acct_ws_elena_vance_85'
        })
      });
      await res.json();
    } catch (e) {
      console.warn('Direct bridge local sync:', e);
    }
    setTimeout(() => {
      setIsBridgeLoading(false);
      setIsBridgeDispatched(true);
    }, 800);
  };

  const handleSubmitPublish = (e: React.FormEvent) => {
    e.preventDefault();
    const assignedTier: RoyaltyTierType = ingestMode === 'writesound_bridge' ? 'writesound_bridge' : 'standard_direct';

    const newBook: Book = {
      id: `book-${Date.now()}`,
      title,
      subtitle,
      author: authorName,
      authorId: 'auth-vance',
      narrator: narratorName,
      genre,
      formats: ['audiobook', 'ebook', 'bundle'],
      priceAudio: Number(priceAudio),
      priceEbook: Number(priceEbook),
      priceBundle: Number(priceBundle),
      coverImage: customCoverUrl.trim() || (extractId3Artwork 
        ? 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?q=80&w=800&auto=format&fit=crop'
        : 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop'
      ),
      rating: 5.0,
      reviewCount: 1,
      releaseDate: new Date().toISOString().split('T')[0],
      synopsis,
      audioSample: {
        url: 'synth:space_ch2',
        durationSeconds: mp3Duration || 195,
        sampleTitle: 'Prologue: The Centauri Flare',
        narrator: narratorName,
        chapterNumber: 1
      },
      royaltyTier: assignedTier,
      ingestionSource: ingestMode === 'writesound_bridge' ? 'writesound_api' : 'mp3_upload',
      id3ArtworkExtracted: extractId3Artwork,
      totalCopiesSold: 0,
      audioUnitsSold: 0,
      ebookUnitsSold: 0,
      featured: true
    };

    onPublishBook(newBook);
  };

  return (
    <div className="space-y-8">
      
      {/* Top Banner: Ingestion Mode Selector */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-900/40 shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-mono font-bold">
                DIRECT PUBLISHING PIPELINE
              </span>
              <span className="text-xs text-slate-400">Multi-tenant Ingestion</span>
            </div>
            <h2 className="text-xl font-bold text-white mt-1">
              Select Ingestion Protocol &amp; Royalty Tier
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-xl">
              Audiobooks ingested directly from Write-Sound carry authenticated author credentials and qualify for the <strong className="text-emerald-400">85% Creator Tier</strong> with Stripe Connect instant splits.
            </p>
          </div>

          {/* Toggle buttons */}
          <div className="flex items-center p-1 bg-slate-950 rounded-xl border border-slate-800">
            <button
              id="ingest-tab-writesound"
              onClick={() => setIngestMode('writesound_bridge')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                ingestMode === 'writesound_bridge'
                  ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Write-Sound API Bridge (85%)</span>
            </button>
            <button
              id="ingest-tab-mp3"
              onClick={() => setIngestMode('mp3_manual')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                ingestMode === 'mp3_manual'
                  ? 'bg-gradient-to-r from-slate-800 to-slate-700 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <FileAudio className="w-4 h-4 text-slate-300" />
              <span>Direct MP3 File Upload (75%)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mode Specific Ingestion Section */}
      {ingestMode === 'writesound_bridge' ? (
        /* WRITE-SOUND DIRECT API BRIDGE WITH AUTHENTICATION & STRIPE TOKEN */
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-indigo-800/50 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-xl bg-indigo-900/50 border border-indigo-500/40 flex items-center justify-center text-indigo-400 shadow-inner">
                <Zap className="w-6 h-6 text-amber-400" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-base font-bold text-white">Write-Sound Direct API Bridge</h3>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/40 text-[11px] font-mono font-bold flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-emerald-400" />
                    Tier 1: 85% Split
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Automated 1-click dispatch directly from Write-Sound studio with cryptographic author identity and Stripe payout routing.
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowAuthExplanation(!showAuthExplanation)}
                className="px-3 py-1.5 rounded-lg bg-indigo-950/70 border border-indigo-800/50 hover:bg-indigo-900/80 text-indigo-300 text-xs font-medium flex items-center space-x-1.5 transition-colors"
              >
                <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>How Author Login Works</span>
              </button>

              <button
                onClick={() => setShowPayloadInspector(!showPayloadInspector)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono flex items-center space-x-1.5 transition-colors"
              >
                <Code2 className="w-3.5 h-3.5 text-indigo-400" />
                <span>{showPayloadInspector ? 'Hide Payload' : 'View Payload & Headers'}</span>
              </button>
            </div>
          </div>

          {/* Educational Architecture Box on Write-Sound Authentication */}
          {showAuthExplanation && (
            <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-950/60 to-slate-950 border border-indigo-500/40 text-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-indigo-200 flex items-center gap-2">
                  <KeyRound className="w-4 h-4 text-amber-400" />
                  Write-Sound Author Authentication Architecture
                </span>
                <span className="text-emerald-400 font-mono text-[11px]">Zero-Password SSO</span>
              </div>
              <p className="text-slate-300 leading-relaxed">
                When authors send their audiobooks directly from <strong>Write-Sound</strong>, they do not need to create or enter a separate password on ACE. Write-Sound attaches a signed cryptographic <strong>Author Identity JWT</strong> and the author's linked <strong>Stripe Connect Account ID</strong> directly in the API request headers.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 font-mono text-[11px]">
                <div className="p-2 rounded bg-slate-900/90 border border-slate-800">
                  <span className="text-amber-400 block font-bold">1. Write-Sound Session</span>
                  <span className="text-slate-400">Author exports master stems from their workstation.</span>
                </div>
                <div className="p-2 rounded bg-slate-900/90 border border-slate-800">
                  <span className="text-indigo-400 block font-bold">2. Signed Token</span>
                  <span className="text-slate-400">Transmits Author ID + Stripe Connect `acct_ws_...`.</span>
                </div>
                <div className="p-2 rounded bg-slate-900/90 border border-slate-800">
                  <span className="text-emerald-400 block font-bold">3. Auto 85% Split</span>
                  <span className="text-slate-400">ACE verifies signature; reader checkout routes 85% instantly.</span>
                </div>
              </div>
            </div>
          )}

          {/* Live Authenticated Session Card */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-950 border border-emerald-700/50 flex items-center justify-center text-emerald-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold text-white">Authenticated via Write-Sound Studio SSO</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-semibold">
                    VERIFIED
                  </span>
                </div>
                <div className="text-[11px] font-mono text-slate-400">
                  Author: <span className="text-slate-200">Elena Vance</span> (elena.vance@writesound.studio) • Stripe: <span className="text-indigo-400">acct_ws_elena_vance_85</span>
                </div>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] font-mono text-slate-400 block uppercase">Entitlement</span>
              <span className="text-xs font-bold font-mono text-emerald-400">85% Direct Creator Split</span>
            </div>
          </div>

          {/* Payload & Headers Inspector Drawer */}
          {showPayloadInspector && (
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-indigo-300 overflow-x-auto space-y-2">
              <div className="flex items-center justify-between text-slate-400 text-[11px]">
                <span>POST /api/v2/writesound/bridge/dispatch</span>
                <span className="text-emerald-400 font-bold">Content-Type: application/json</span>
              </div>
              <pre className="text-slate-300 max-h-64 overflow-y-auto">
                {JSON.stringify(writeSoundPayload, null, 2)}
              </pre>
            </div>
          )}

          {/* Bridge Dispatch Trigger */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-950 border border-indigo-800 flex items-center justify-center text-indigo-400">
                <Disc className="w-4 h-4 text-indigo-300" />
              </div>
              <div>
                <div className="text-xs font-semibold text-slate-200">
                  Ready to Dispatch Studio Package
                </div>
                <div className="text-[11px] text-slate-400">
                  18 Chapters • Lossless Stems • Validated ID3 Jacket Art • 85% Royalty Flagged
                </div>
              </div>
            </div>

            <button
              id="dispatch-writesound-bridge-btn"
              onClick={handleDispatchWriteSoundBridge}
              disabled={isBridgeLoading || isBridgeDispatched}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold flex items-center space-x-2 transition-all shadow-md ${
                isBridgeDispatched
                  ? 'bg-emerald-600 text-white cursor-default'
                  : isBridgeLoading
                  ? 'bg-indigo-700 text-slate-200 cursor-wait'
                  : 'bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950'
              }`}
            >
              {isBridgeLoading ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Verifying Write-Sound Token &amp; Stems...</span>
                </>
              ) : isBridgeDispatched ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Write-Sound Assets Synced (85% Tier Active)</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  <span>1-Click Dispatch from Write-Sound</span>
                </>
              )}
            </button>
          </div>
        </div>
      ) : (
        /* DIRECT MP3 FILE UPLOAD & ID3 ARTWORK */
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 shadow-inner">
                <FileAudio className="w-6 h-6 text-amber-400" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-base font-bold text-white">Direct MP3 Audio Ingestion</h3>
                  <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 text-[11px] font-mono font-medium">
                    Standard 75% Tier
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Upload standalone MP3 audiobook audio files directly through the dashboard with automatic ID3 metadata extraction.
                </p>
              </div>
            </div>
          </div>

          {/* Upload Dropzone */}
          <div 
            onClick={handleSimulateMp3Drop}
            className="border-2 border-dashed border-slate-700 hover:border-amber-500/80 bg-slate-950/60 hover:bg-slate-950 rounded-2xl p-8 text-center cursor-pointer transition-all group"
          >
            <div className="w-12 h-12 mx-auto rounded-full bg-slate-900 group-hover:bg-amber-500/20 text-slate-400 group-hover:text-amber-400 flex items-center justify-center transition-colors mb-3">
              {isProcessingMp3 ? (
                <span className="w-5 h-5 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
              ) : (
                <Upload className="w-5 h-5" />
              )}
            </div>

            {uploadedMp3Name ? (
              <div className="space-y-1">
                <div className="text-xs font-mono text-emerald-400 font-bold flex items-center justify-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  MP3 File Successfully Parsed &amp; Validated
                </div>
                <div className="text-sm font-semibold text-white">{uploadedMp3Name}</div>
                <div className="text-xs text-slate-400">
                  Bitrate: 320 kbps (CBR) • Sample Rate: 44.1 kHz • Duration: 3m 30s sample
                </div>
              </div>
            ) : (
              <div className="space-y-1">
                <div className="text-sm font-medium text-slate-200">
                  {isProcessingMp3 ? 'Parsing ID3 metadata and calculating checksum...' : 'Click to select or drop standalone MP3 audiobook files here'}
                </div>
                <p className="text-xs text-slate-400">
                  Supports MP3, M4B, AAC (Up to 2GB per volume). Automatic chapter boundary alignment.
                </p>
              </div>
            )}
          </div>

          {/* ID3 Cover Artwork Handling Toggle */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-slate-200 uppercase font-mono tracking-wider">
                  ID3 Cover Artwork Handling
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Choose whether to extract embedded jacket artwork from the MP3 ID3 header or attach a custom cover image.
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setExtractId3Artwork(true)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    extractId3Artwork 
                      ? 'bg-amber-500 text-slate-950 font-bold shadow' 
                      : 'bg-slate-900 text-slate-400 hover:text-white'
                  }`}
                >
                  Extract ID3 Artwork
                </button>
                <button
                  type="button"
                  onClick={() => setExtractId3Artwork(false)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    !extractId3Artwork 
                      ? 'bg-amber-500 text-slate-950 font-bold shadow' 
                      : 'bg-slate-900 text-slate-400 hover:text-white'
                  }`}
                >
                  Attach Custom Cover
                </button>
              </div>
            </div>

            {!extractId3Artwork && (
              <div className="pt-2 border-t border-slate-800 flex items-center space-x-3">
                <div className="flex-1">
                  <input
                    type="url"
                    value={customCoverUrl}
                    onChange={(e) => setCustomCoverUrl(e.target.value)}
                    placeholder="Enter custom image URL (e.g. https://images.unsplash.com/...)"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setCustomCoverUrl('https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800&auto=format&fit=crop')}
                  className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium whitespace-nowrap"
                >
                  Use Sample High-Res
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Metadata & Publishing Form */}
      <form onSubmit={handleSubmitPublish} className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-6">
        <div>
          <h3 className="text-base font-bold text-white">Book Release Metadata &amp; Pricing</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Configure catalog details, narrator billing, and pricing tiers for your reader community.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Book Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Subtitle / Series</label>
            <input
              type="text"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Author Name</label>
            <input
              type="text"
              required
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Narrator Credit</label>
            <input
              type="text"
              value={narratorName}
              onChange={(e) => setNarratorName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Primary Genre</label>
            <select
              value={genre}
              onChange={(e) => setGenre(e.target.value as BookGenre)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
            >
              <option value="Sci-Fi Thriller">Sci-Fi Thriller</option>
              <option value="Cyberpunk">Cyberpunk</option>
              <option value="Space Opera">Space Opera</option>
              <option value="Noir Mystery">Noir Mystery</option>
              <option value="Audiobook">Audiobook</option>
              <option value="Dystopian Tech">Dystopian Tech</option>
            </select>
          </div>

          {/* Pricing inputs */}
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">Audio ($)</label>
              <input
                type="number"
                step="0.50"
                value={priceAudio}
                onChange={(e) => setPriceAudio(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2 text-sm text-amber-400 font-mono font-bold focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">E-Book ($)</label>
              <input
                type="number"
                step="0.50"
                value={priceEbook}
                onChange={(e) => setPriceEbook(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2 text-sm text-slate-200 font-mono font-bold focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">Bundle ($)</label>
              <input
                type="number"
                step="0.50"
                value={priceBundle}
                onChange={(e) => setPriceBundle(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2 text-sm text-emerald-400 font-mono font-bold focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Synopsis &amp; Blurb</label>
          <textarea
            rows={3}
            value={synopsis}
            onChange={(e) => setSynopsis(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-amber-500"
          />
        </div>

        {/* Royalty Preview Bar before publish */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="text-slate-300">
              Contract Tier: <strong className="text-white">{ingestMode === 'writesound_bridge' ? '85% Creator Net (Write-Sound Bridge)' : '75% Creator Net (Direct Ingest)'}</strong>
            </span>
          </div>
          <div className="font-mono text-slate-400">
            Estimated Creator Net per Audio Unit: <strong className="text-emerald-400 font-bold">${(priceAudio * (ingestMode === 'writesound_bridge' ? 0.85 : 0.75)).toFixed(2)}</strong>
          </div>
        </div>

        {/* Publish Action */}
        <div className="flex items-center justify-end space-x-3 pt-2">
          <button
            type="submit"
            id="publish-book-btn"
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-bold text-sm shadow-lg shadow-orange-950/30 transition-all flex items-center space-x-2"
          >
            <span>Publish to ACE Storefront &amp; Fan Feed</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </form>

    </div>
  );
};
