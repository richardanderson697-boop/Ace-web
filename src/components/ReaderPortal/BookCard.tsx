import React from 'react';
import { 
  Headphones, 
  BookText, 
  Package, 
  Star, 
  Play, 
  Pause,
  Award,
  Sparkles
} from 'lucide-react';
import { Book } from '../../types';

interface BookCardProps {
  book: Book;
  isPlayingSample: boolean;
  onPlaySample: (book: Book) => void;
  onSelectBook: (book: Book) => void;
}

export const BookCard: React.FC<BookCardProps> = ({
  book,
  isPlayingSample,
  onPlaySample,
  onSelectBook
}) => {
  const isWriteSound = book.royaltyTier === 'writesound_bridge';

  return (
    <div 
      id={`book-card-${book.id}`}
      className="group relative flex flex-col bg-slate-900/70 border border-slate-800 hover:border-amber-500/50 rounded-2xl overflow-hidden shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-amber-500/5"
    >
      
      {/* Cover Image Container */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-slate-950">
        <img
          src={book.coverImage}
          alt={book.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          referrerPolicy="no-referrer"
        />

        {/* Royalty Tier Tag Overlay */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
          <span className="text-[10px] uppercase font-mono font-bold tracking-wider px-2 py-0.5 rounded-full bg-slate-950/80 backdrop-blur-md text-slate-200 border border-slate-700">
            {book.genre}
          </span>
          {isWriteSound ? (
            <span className="flex items-center gap-1 text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-emerald-950/90 text-emerald-300 border border-emerald-500/40 backdrop-blur-md shadow-sm">
              <Sparkles className="w-2.5 h-2.5 text-emerald-400" />
              85% Split
            </span>
          ) : (
            <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-full bg-slate-900/90 text-slate-300 border border-slate-700 backdrop-blur-md">
              75% Split
            </span>
          )}
        </div>

        {/* Audio sample overlay trigger */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
          <button
            id={`sample-audio-btn-${book.id}`}
            onClick={(e) => {
              e.stopPropagation();
              onPlaySample(book);
            }}
            className={`w-full py-2 px-3 rounded-xl flex items-center justify-center space-x-2 text-xs font-semibold shadow-lg backdrop-blur-md transition-all ${
              isPlayingSample
                ? 'bg-amber-500 text-slate-950'
                : 'bg-slate-900/90 hover:bg-amber-500 hover:text-slate-950 text-white border border-slate-700'
            }`}
          >
            {isPlayingSample ? (
              <>
                <Pause className="w-3.5 h-3.5 fill-current" />
                <span>Pause Sample</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Sample Audio ({book.audioSample.narrator ? 'Narrated' : 'Preview'})</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Card Body */}
      <div className="flex-1 p-4 flex flex-col justify-between space-y-3">
        
        <div>
          {/* Rating and Reviews */}
          <div className="flex items-center justify-between text-xs mb-1.5">
            <div className="flex items-center space-x-1 text-amber-400 font-medium">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span>{book.rating.toFixed(1)}</span>
              <span className="text-slate-400 font-normal">({book.reviewCount})</span>
            </div>
            {book.audioSample && (
              <span className="flex items-center space-x-1 text-slate-400 text-[11px]">
                <Headphones className="w-3 h-3 text-amber-400/80" />
                <span>Audiobook Ready</span>
              </span>
            )}
          </div>

          {/* Title and Subtitle */}
          <h3 
            onClick={() => onSelectBook(book)}
            className="text-base font-bold text-white leading-snug line-clamp-1 group-hover:text-amber-400 cursor-pointer transition-colors"
          >
            {book.title}
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            By <span className="text-slate-200 font-medium hover:underline cursor-pointer">{book.author}</span>
          </p>

          {book.narrator && (
            <p className="text-[11px] text-slate-400 truncate mt-0.5">
              Narrated by {book.narrator}
            </p>
          )}
        </div>

        {/* Pricing & Format Tags */}
        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
          <div>
            <div className="text-[10px] font-mono text-slate-400">AUDIOBOOK</div>
            <div className="text-sm font-bold text-amber-400 font-mono">
              ${book.priceAudio.toFixed(2)}
            </div>
          </div>

          <div className="flex items-center space-x-1.5">
            {book.formats.includes('ebook') && (
              <span className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] font-mono text-slate-300" title={`E-Book available for $${book.priceEbook.toFixed(2)}`}>
                EPUB
              </span>
            )}
            {book.formats.includes('bundle') && (
              <span className="px-1.5 py-0.5 rounded bg-indigo-950/60 border border-indigo-700/50 text-[10px] font-mono text-indigo-300" title={`Audio + EPUB Bundle for $${book.priceBundle.toFixed(2)}`}>
                BUNDLE
              </span>
            )}

            <button
              id={`view-book-details-${book.id}`}
              onClick={() => onSelectBook(book)}
              className="ml-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-white transition-colors"
            >
              Details
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
