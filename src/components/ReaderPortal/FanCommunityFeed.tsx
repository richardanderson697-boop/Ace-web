import React, { useState } from 'react';
import { 
  Heart, 
  MessageSquare, 
  Play, 
  Pause, 
  Sparkles, 
  ShoppingBag, 
  Send, 
  Calendar, 
  Mic, 
  BookOpen, 
  HelpCircle,
  Share2,
  CheckCircle2
} from 'lucide-react';
import { FanFeedPost, FeedComment, Book } from '../../types';

interface FanCommunityFeedProps {
  posts: FanFeedPost[];
  onToggleLike: (postId: string) => void;
  onAddComment: (postId: string, commentText: string) => void;
  onPlaySnippet: (snippetTitle: string) => void;
  onBuyFromPost: (bookId: string) => void;
  catalogBooks: Book[];
}

export const FanCommunityFeed: React.FC<FanCommunityFeedProps> = ({
  posts,
  onToggleLike,
  onAddComment,
  onPlaySnippet,
  onBuyFromPost,
  catalogBooks
}) => {
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [expandedThreads, setExpandedThreads] = useState<Record<string, boolean>>({
    'post-1': true // default open first thread
  });
  const [playingSnippetId, setPlayingSnippetId] = useState<string | null>(null);

  const filteredPosts = posts.filter(post => {
    if (activeFilter === 'all') return true;
    return post.type === activeFilter;
  });

  const toggleThread = (postId: string) => {
    setExpandedThreads(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  const handleCommentSubmit = (postId: string, e: React.FormEvent) => {
    e.preventDefault();
    const text = commentInputs[postId]?.trim();
    if (!text) return;
    onAddComment(postId, text);
    setCommentInputs(prev => ({ ...prev, [postId]: '' }));
    // Ensure thread is expanded
    setExpandedThreads(prev => ({ ...prev, [postId]: true }));
  };

  const getTypeBadge = (type: FanFeedPost['type']) => {
    switch (type) {
      case 'serialized_drop':
        return {
          label: 'Serialized Chapter Drop',
          icon: <BookOpen className="w-3.5 h-3.5" />,
          color: 'bg-amber-500/20 text-amber-300 border-amber-500/30'
        };
      case 'draft_teaser':
        return {
          label: 'Early Draft Teaser',
          icon: <Mic className="w-3.5 h-3.5" />,
          color: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
        };
      case 'preorder_announcement':
        return {
          label: 'Pre-Order Announcement',
          icon: <Calendar className="w-3.5 h-3.5" />,
          color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
        };
      case 'live_qa':
        return {
          label: 'Live Author Q&A',
          icon: <HelpCircle className="w-3.5 h-3.5" />,
          color: 'bg-rose-500/20 text-rose-300 border-rose-500/30'
        };
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      
      {/* Feed Sub-navigation / Filter chips */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 border-b border-slate-800 scrollbar-none">
        <button
          onClick={() => setActiveFilter('all')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            activeFilter === 'all'
              ? 'bg-amber-500 text-slate-950 shadow-md'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          All Activity
        </button>
        <button
          onClick={() => setActiveFilter('serialized_drop')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-all ${
            activeFilter === 'serialized_drop'
              ? 'bg-amber-500 text-slate-950 shadow-md'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Serialized Chapter Drops</span>
        </button>
        <button
          onClick={() => setActiveFilter('draft_teaser')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-all ${
            activeFilter === 'draft_teaser'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Mic className="w-3.5 h-3.5" />
          <span>Early Draft Teasers</span>
        </button>
        <button
          onClick={() => setActiveFilter('preorder_announcement')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-all ${
            activeFilter === 'preorder_announcement'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>Pre-Order Announcements</span>
        </button>
        <button
          onClick={() => setActiveFilter('live_qa')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-all ${
            activeFilter === 'live_qa'
              ? 'bg-rose-600 text-white shadow-md'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Author Q&amp;A</span>
        </button>
      </div>

      {/* Feed Posts List */}
      <div className="space-y-6">
        {filteredPosts.map(post => {
          const badge = getTypeBadge(post.type);
          const isThreadExpanded = !!expandedThreads[post.id];
          const isPlayingThisSnippet = playingSnippetId === post.id;

          return (
            <article 
              key={post.id}
              id={`fan-post-${post.id}`}
              className="bg-slate-900/80 border border-slate-800 hover:border-slate-700/80 rounded-2xl p-5 sm:p-6 shadow-xl text-slate-100 transition-all"
            >
              {/* Author & Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <img 
                      src={post.authorAvatar} 
                      alt={post.authorName}
                      className="w-11 h-11 rounded-full object-cover border border-slate-700 shadow-md"
                      referrerPolicy="no-referrer"
                    />
                    {post.verifiedAuthor && (
                      <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center shadow" title="Verified ACE Author">
                        <CheckCircle2 className="w-3 h-3 stroke-[3]" />
                      </span>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-white text-sm sm:text-base">{post.authorName}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-mono">
                        Author
                      </span>
                    </div>
                    <span className="text-xs text-slate-400">{post.timestamp}</span>
                  </div>
                </div>

                {/* Post Type Badge */}
                <div className={`flex items-center space-x-1.5 text-xs font-mono font-medium px-2.5 py-1 rounded-full border ${badge.color}`}>
                  {badge.icon}
                  <span>{badge.label}</span>
                </div>
              </div>

              {/* Title & Body */}
              <div className="mt-4">
                <h3 className="text-lg font-bold text-white tracking-tight">
                  {post.title}
                </h3>
                <p className="mt-2 text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                  {post.content}
                </p>
              </div>

              {/* Audio Snippet Card (if serialized drop or teaser) */}
              {post.audioSnippet && (
                <div className="mt-4 p-3.5 rounded-xl bg-slate-950 border border-amber-500/20 flex items-center justify-between gap-3">
                  <div className="flex items-center space-x-3 min-w-0">
                    <button
                      onClick={() => {
                        if (isPlayingThisSnippet) {
                          setPlayingSnippetId(null);
                        } else {
                          setPlayingSnippetId(post.id);
                          onPlaySnippet(post.audioSnippet?.sampleTitle || 'Sample');
                        }
                      }}
                      className="w-10 h-10 rounded-full bg-amber-500 hover:bg-amber-400 text-slate-950 flex items-center justify-center flex-shrink-0 transition-transform active:scale-95"
                      aria-label="Play sample snippet"
                    >
                      {isPlayingThisSnippet ? (
                        <Pause className="w-4 h-4 fill-current" />
                      ) : (
                        <Play className="w-4 h-4 fill-current ml-0.5" />
                      )}
                    </button>
                    <div className="min-w-0">
                      <div className="text-xs font-mono text-amber-400 font-semibold">
                        AUDIO SNIPPET ({Math.round((post.audioSnippet.durationSeconds || 120) / 60)} MIN)
                      </div>
                      <div className="text-sm font-semibold text-white truncate">
                        {post.audioSnippet.sampleTitle}
                      </div>
                    </div>
                  </div>

                  <span className="text-xs font-mono text-slate-400 hidden sm:inline-block">
                    Master 320kbps
                  </span>
                </div>
              )}

              {/* Direct Conversion Book Action Attachment */}
              {post.bookId && (
                <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-slate-950 to-slate-900 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center space-x-3 w-full sm:w-auto">
                    {post.bookCover && (
                      <img 
                        src={post.bookCover} 
                        alt={post.bookTitle || 'Book'} 
                        className="w-12 h-16 rounded object-cover shadow border border-slate-700"
                        referrerPolicy="no-referrer"
                      />
                    )}
                    <div>
                      <div className="text-xs text-amber-400 font-mono font-medium">
                        DIRECT AUTHOR CONVERSION
                      </div>
                      <h4 className="text-sm font-bold text-white">
                        {post.bookTitle}
                      </h4>
                      <p className="text-xs text-slate-400">
                        Author receives 85% creator net on ACE Platform
                      </p>
                    </div>
                  </div>

                  <button
                    id={`feed-buy-button-${post.id}`}
                    onClick={() => post.bookId && onBuyFromPost(post.bookId)}
                    className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center space-x-2 shadow-md transition-colors"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>
                      {post.type === 'preorder_announcement' ? 'Pre-Order Now' : 'Purchase Master Copy'} • ${post.price?.toFixed(2) || '19.99'}
                    </span>
                  </button>
                </div>
              )}

              {/* Engagement Bar */}
              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                <div className="flex items-center space-x-4">
                  <button
                    id={`like-post-btn-${post.id}`}
                    onClick={() => onToggleLike(post.id)}
                    className={`flex items-center space-x-1.5 py-1 px-2.5 rounded-lg transition-colors ${
                      post.userLiked 
                        ? 'text-rose-400 bg-rose-950/30' 
                        : 'hover:text-rose-400 hover:bg-slate-800/60'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${post.userLiked ? 'fill-current' : ''}`} />
                    <span className="font-mono font-medium">{post.likes}</span>
                  </button>

                  <button
                    onClick={() => toggleThread(post.id)}
                    className="flex items-center space-x-1.5 py-1 px-2.5 rounded-lg hover:text-amber-400 hover:bg-slate-800/60 transition-colors"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span className="font-mono font-medium">{post.comments.length} Comments</span>
                  </button>
                </div>

                <div className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  <span>Direct Author Ecosystem</span>
                </div>
              </div>

              {/* Discussion Thread & Comments */}
              {isThreadExpanded && (
                <div className="mt-4 pt-4 border-t border-slate-800/60 space-y-3">
                  
                  {/* Comments list */}
                  <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                    {post.comments.map(c => (
                      <div 
                        key={c.id} 
                        className={`p-3 rounded-xl text-xs space-y-1 ${
                          c.isAuthor 
                            ? 'bg-amber-950/30 border border-amber-500/30' 
                            : 'bg-slate-950 border border-slate-800/60'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <img 
                              src={c.userAvatar} 
                              alt={c.userName} 
                              className="w-5 h-5 rounded-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                            <span className="font-semibold text-slate-200">{c.userName}</span>
                            {c.isAuthor && (
                              <span className="text-[10px] font-mono bg-amber-500 text-slate-950 font-bold px-1.5 py-0.2 rounded">
                                AUTHOR
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-slate-400">{c.timestamp}</span>
                        </div>
                        <p className="text-slate-300 leading-relaxed pl-7">
                          {c.content}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Add Comment Input */}
                  <form onSubmit={(e) => handleCommentSubmit(post.id, e)} className="flex items-center gap-2 pt-1">
                    <input
                      type="text"
                      value={commentInputs[post.id] || ''}
                      onChange={(e) => setCommentInputs({ ...commentInputs, [post.id]: e.target.value })}
                      placeholder="Write a message or reply to the author..."
                      className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:border-amber-500"
                    />
                    <button
                      type="submit"
                      disabled={!commentInputs[post.id]?.trim()}
                      className="px-3.5 py-2 bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-slate-950 font-bold rounded-xl text-xs transition-colors flex items-center space-x-1"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Reply</span>
                    </button>
                  </form>

                </div>
              )}

            </article>
          );
        })}
      </div>

    </div>
  );
};
