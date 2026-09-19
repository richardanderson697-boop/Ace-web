import React, { useState, useMemo } from 'react';
import { 
  BookOpen, 
  Sparkles, 
  Radio, 
  MessageSquare, 
  Layers, 
  Compass, 
  Flame,
  CheckCircle2,
  TrendingUp,
  Headphones
} from 'lucide-react';
import { Book, FanFeedPost, DigitalOrder } from '../../types';
import { SearchFilterBar } from './SearchFilterBar';
import { BookCard } from './BookCard';
import { FanCommunityFeed } from './FanCommunityFeed';
import { BookDetailModal } from './BookDetailModal';

interface ReaderPortalProps {
  books: Book[];
  fanPosts: FanFeedPost[];
  activeTab: 'storefront' | 'community';
  onSelectTab: (tab: 'storefront' | 'community') => void;
  playingBookId: string | null;
  isPlayingAudio: boolean;
  onPlayBookSample: (book: Book) => void;
  onTogglePlay: () => void;
  onOrderCompleted: (order: DigitalOrder) => void;
  onTogglePostLike: (postId: string) => void;
  onAddPostComment: (postId: string, commentText: string) => void;
}

export const ReaderPortal: React.FC<ReaderPortalProps> = ({
  books,
  fanPosts,
  activeTab,
  onSelectTab,
  playingBookId,
  isPlayingAudio,
  onPlayBookSample,
  onTogglePlay,
  onOrderCompleted,
  onTogglePostLike,
  onAddPostComment
}) => {
  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedGenre, setSelectedGenre] = useState<string>('all');
  const [selectedLetter, setSelectedLetter] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('featured');

  // Modal state
  const [selectedBookForModal, setSelectedBookForModal] = useState<Book | null>(null);

  // Multi-attribute search filtering: title, genre category, or author name alphabetically
  const filteredAndSortedBooks = useMemo(() => {
    return books
      .filter((b) => {
        // Genre filter
        if (selectedGenre !== 'all') {
          if (selectedGenre === 'Audiobook') {
            if (!b.formats.includes('audiobook')) return false;
          } else if (b.genre !== selectedGenre) {
            return false;
          }
        }

        // Alphabetical Author Name letter filter
        if (selectedLetter !== '') {
          const authorLastName = b.author.split(' ').slice(-1)[0] || b.author;
          if (!authorLastName.toUpperCase().startsWith(selectedLetter.toUpperCase())) {
            return false;
          }
        }

        // Search query across title, genre, author name
        if (searchQuery.trim() !== '') {
          const q = searchQuery.toLowerCase();
          const matchTitle = b.title.toLowerCase().includes(q);
          const matchSubtitle = (b.subtitle || '').toLowerCase().includes(q);
          const matchAuthor = b.author.toLowerCase().includes(q);
          const matchGenre = b.genre.toLowerCase().includes(q);
          const matchNarrator = (b.narrator || '').toLowerCase().includes(q);
          if (!matchTitle && !matchSubtitle && !matchAuthor && !matchGenre && !matchNarrator) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'author-asc') return a.author.localeCompare(b.author);
        if (sortBy === 'title-asc') return a.title.localeCompare(b.title);
        if (sortBy === 'price-asc') return a.priceAudio - b.priceAudio;
        // Default featured
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      });
  }, [books, selectedGenre, selectedLetter, searchQuery, sortBy]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedGenre('all');
    setSelectedLetter('');
    setSortBy('featured');
  };

  const handleBuyFromPost = (bookId: string) => {
    const matchedBook = books.find(b => b.id === bookId);
    if (matchedBook) {
      setSelectedBookForModal(matchedBook);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8">
      
      {/* Hero Storefront Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950/60 border border-slate-800 p-6 sm:p-10 shadow-2xl">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-mono font-semibold tracking-wide">
            <Headphones className="w-3.5 h-3.5" />
            <span>DISCOVERY &amp; FAN COMMUNITY DASHBOARD</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
            Immersive Sci-Fi &amp; Audiobooks Direct From Authors.
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed">
            Sample studio master narration audio before you buy. Support independent creators who keep <strong className="text-emerald-400 font-mono">85% of royalties</strong> via the ACE Write-Sound ecosystem.
          </p>
          
          {/* Sub-tab pills */}
          <div className="pt-2 flex items-center space-x-3">
            <button
              onClick={() => onSelectTab('storefront')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'storefront'
                  ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                  : 'bg-slate-900/90 text-slate-300 hover:text-white border border-slate-700'
              }`}
            >
              Storefront &amp; Audio Discovery
            </button>
            <button
              onClick={() => onSelectTab('community')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center space-x-1.5 transition-all ${
                activeTab === 'community'
                  ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                  : 'bg-slate-900/90 text-slate-300 hover:text-white border border-slate-700'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>Fan Feed &amp; Serialized Drops</span>
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            </button>
          </div>
        </div>

        {/* Ambient background decoration */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-amber-500/10 via-indigo-500/5 to-transparent pointer-events-none" />
      </div>

      {/* Main Tab Content */}
      {activeTab === 'storefront' ? (
        <div>
          {/* Multi-attribute Search & Category Filter Chips & A-Z bar */}
          <SearchFilterBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedGenre={selectedGenre}
            onSelectGenre={setSelectedGenre}
            selectedLetter={selectedLetter}
            onSelectLetter={setSelectedLetter}
            sortBy={sortBy}
            onSortChange={setSortBy}
            onResetFilters={handleResetFilters}
          />

          {/* Results count indicator */}
          <div className="flex items-center justify-between text-xs text-slate-400 mb-4 px-1 font-mono">
            <span>
              Showing <strong className="text-white">{filteredAndSortedBooks.length}</strong> audiobooks &amp; releases
            </span>
            <span className="text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              ID3 Jacketed &amp; DRM Ready
            </span>
          </div>

          {/* Book Catalog Grid */}
          {filteredAndSortedBooks.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
              {filteredAndSortedBooks.map((book) => {
                const isPlayingThisBook = playingBookId === book.id && isPlayingAudio;
                return (
                  <BookCard
                    key={book.id}
                    book={book}
                    isPlayingSample={isPlayingThisBook}
                    onPlaySample={(b) => {
                      if (isPlayingThisBook) {
                        onTogglePlay();
                      } else {
                        onPlayBookSample(b);
                      }
                    }}
                    onSelectBook={(b) => setSelectedBookForModal(b)}
                  />
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16 bg-slate-900/40 rounded-2xl border border-slate-800 space-y-3">
              <Compass className="w-10 h-10 text-slate-500 mx-auto" />
              <h3 className="text-base font-bold text-white">No releases match your search</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Try clearing your search query or choosing a different genre or author letter.
              </p>
              <button
                onClick={handleResetFilters}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-amber-400 transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Fan Feed & Community Forum Tab */
        <FanCommunityFeed
          posts={fanPosts}
          onToggleLike={onTogglePostLike}
          onAddComment={onAddPostComment}
          onPlaySnippet={(title) => {
            const firstWithSample = books[0];
            if (firstWithSample) onPlayBookSample(firstWithSample);
          }}
          onBuyFromPost={handleBuyFromPost}
          catalogBooks={books}
        />
      )}

      {/* Book Detail Modal */}
      <BookDetailModal
        book={selectedBookForModal}
        isOpen={!!selectedBookForModal}
        onClose={() => setSelectedBookForModal(null)}
        isPlayingSample={playingBookId === selectedBookForModal?.id && isPlayingAudio}
        onToggleSample={(b) => {
          if (playingBookId === b.id && isPlayingAudio) {
            onTogglePlay();
          } else {
            onPlayBookSample(b);
          }
        }}
        onCompletePurchase={onOrderCompleted}
      />

    </div>
  );
};
