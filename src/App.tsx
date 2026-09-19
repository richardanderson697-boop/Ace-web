/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { UserRole, Book, DigitalOrder, CustomerMessage, FanFeedPost, AuthorTelemetry } from './types';
import { 
  INITIAL_BOOKS, 
  INITIAL_FAN_POSTS, 
  INITIAL_ORDERS, 
  INITIAL_CUSTOMER_MESSAGES, 
  INITIAL_AUTHOR_TELEMETRY 
} from './data/mockData';
import { Navbar } from './components/Navbar';
import { ReaderPortal } from './components/ReaderPortal/ReaderPortal';
import { AuthorWorkspace } from './components/AuthorPortal/AuthorWorkspace';
import { AdminGovernance } from './components/AdminPortal/AdminGovernance';
import { AudioPlayer } from './components/AudioPlayer';
import { LibraryModal } from './components/LibraryModal';

export default function App() {
  // Navigation & Role State
  const [currentRole, setCurrentRole] = useState<UserRole>('reader');
  const [activeReaderTab, setActiveReaderTab] = useState<'storefront' | 'community'>('storefront');

  // Core Data States
  const [books, setBooks] = useState<Book[]>(INITIAL_BOOKS);
  const [fanPosts, setFanPosts] = useState<FanFeedPost[]>(INITIAL_FAN_POSTS);
  const [orders, setOrders] = useState<DigitalOrder[]>(INITIAL_ORDERS);
  const [messages, setMessages] = useState<CustomerMessage[]>(INITIAL_CUSTOMER_MESSAGES);
  const [telemetry, setTelemetry] = useState<AuthorTelemetry>(INITIAL_AUTHOR_TELEMETRY);

  // Audio Preview Player State (Fixed Bottom)
  const [activeAudioBook, setActiveAudioBook] = useState<Book | null>(INITIAL_BOOKS[0]);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);

  // Reader Library Modal
  const [isLibraryOpen, setIsLibraryOpen] = useState<boolean>(false);

  // Handler: Sample Audio
  const handlePlayBookSample = (book: Book) => {
    setActiveAudioBook(book);
    setIsPlayingAudio(true);
  };

  const handleTogglePlay = () => {
    setIsPlayingAudio(prev => !prev);
  };

  const handleClosePlayer = () => {
    setIsPlayingAudio(false);
  };

  // Handler: Purchase Book
  const handleCompleteOrder = (newOrder: DigitalOrder) => {
    setOrders(prev => [newOrder, ...prev]);

    // Update telemetry
    setTelemetry(prev => ({
      ...prev,
      totalRevenue: prev.totalRevenue + newOrder.amount,
      creatorNet: prev.creatorNet + newOrder.creatorEarnings,
      platformFeeTotal: prev.platformFeeTotal + newOrder.platformFee,
      totalCopiesSold: prev.totalCopiesSold + 1,
      audioCopiesSold: newOrder.format === 'audiobook' ? prev.audioCopiesSold + 1 : prev.audioCopiesSold,
      ebookUnitsSold: newOrder.format === 'ebook' ? prev.ebookUnitsSold + 1 : prev.ebookUnitsSold,
      pendingEscrow: prev.pendingEscrow + newOrder.creatorEarnings
    }));

    // Increment unit counts on the book
    setBooks(prev => prev.map(b => {
      if (b.id === newOrder.bookId) {
        return {
          ...b,
          totalCopiesSold: b.totalCopiesSold + 1,
          audioUnitsSold: newOrder.format === 'audiobook' ? b.audioUnitsSold + 1 : b.audioUnitsSold,
          ebookUnitsSold: newOrder.format === 'ebook' ? b.ebookUnitsSold + 1 : b.ebookUnitsSold
        };
      }
      return b;
    }));
  };

  // Handler: Direct Publish Book from Author Workspace
  const handlePublishBook = (newBook: Book) => {
    setBooks(prev => [newBook, ...prev]);
    setActiveAudioBook(newBook);

    // Auto create a serialized drop announcement on the Fan Feed!
    const newPost: FanFeedPost = {
      id: `post-${Date.now()}`,
      authorId: newBook.authorId,
      authorName: newBook.author,
      authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
      verifiedAuthor: true,
      type: 'serialized_drop',
      title: `New Release Drop: "${newBook.title}"`,
      content: `I'm thrilled to announce that *${newBook.title}* is now live on the ACE Platform! Ingested directly via the ${newBook.royaltyTier === 'writesound_bridge' ? 'Write-Sound Direct API Bridge with lossless 320kbps master stems' : 'standalone MP3 upload pipeline'}. Sample the audio preview below!`,
      bookId: newBook.id,
      bookTitle: newBook.title,
      bookCover: newBook.coverImage,
      price: newBook.priceAudio,
      timestamp: 'Just now',
      likes: 1,
      userLiked: false,
      commentsCount: 0,
      comments: [],
      audioSnippet: newBook.audioSample
    };

    setFanPosts(prev => [newPost, ...prev]);
    alert(`Success! "${newBook.title}" has been published to ACE Storefront & Fan Feed with ${newBook.royaltyTier === 'writesound_bridge' ? '85%' : '75%'} royalty tier.`);
  };

  // Handler: Customer message reply
  const handleReplyMessage = (messageId: string, replyText: string) => {
    setMessages(prev => prev.map(msg => {
      if (msg.id === messageId) {
        return {
          ...msg,
          status: 'replied',
          lastMessage: replyText,
          thread: [
            ...msg.thread,
            {
              sender: 'author',
              message: replyText,
              timestamp: 'Just now'
            }
          ]
        };
      }
      return msg;
    }));
  };

  // Handler: Push DRM delivery
  const handleRetryDrmDelivery = (orderId: string) => {
    setOrders(prev => prev.map(ord => {
      if (ord.id === orderId) {
        return {
          ...ord,
          deliveryStatus: 'Delivered',
          drmToken: `DRM-WH-85-${Math.random().toString(36).substring(2, 9).toUpperCase()}`
        };
      }
      return ord;
    }));
  };

  // Handler: Instant Payout
  const handleRequestInstantPayout = (amount: number) => {
    setTelemetry(prev => ({
      ...prev,
      pendingEscrow: 0
    }));
  };

  // Handler: Fan feed post likes
  const handleTogglePostLike = (postId: string) => {
    setFanPosts(prev => prev.map(post => {
      if (post.id === postId) {
        const isLiked = post.userLiked;
        return {
          ...post,
          userLiked: !isLiked,
          likes: isLiked ? post.likes - 1 : post.likes + 1
        };
      }
      return post;
    }));
  };

  // Handler: Add comment to post
  const handleAddPostComment = (postId: string, commentText: string) => {
    setFanPosts(prev => prev.map(post => {
      if (post.id === postId) {
        const newComment = {
          id: `c-${Date.now()}`,
          userName: 'Reader You',
          userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=120&auto=format&fit=crop',
          content: commentText,
          timestamp: 'Just now',
          likes: 0
        };
        return {
          ...post,
          commentsCount: post.commentsCount + 1,
          comments: [...post.comments, newComment]
        };
      }
      return post;
    }));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      
      {/* Top Navbar */}
      <Navbar
        currentRole={currentRole}
        onSelectRole={setCurrentRole}
        activeReaderTab={activeReaderTab}
        onSelectReaderTab={setActiveReaderTab}
        cartCount={orders.length}
        onOpenCart={() => setIsLibraryOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-36">
        {currentRole === 'reader' && (
          <ReaderPortal
            books={books}
            fanPosts={fanPosts}
            activeTab={activeReaderTab}
            onSelectTab={setActiveReaderTab}
            playingBookId={activeAudioBook?.id || null}
            isPlayingAudio={isPlayingAudio}
            onPlayBookSample={handlePlayBookSample}
            onTogglePlay={handleTogglePlay}
            onOrderCompleted={handleCompleteOrder}
            onTogglePostLike={handleTogglePostLike}
            onAddPostComment={handleAddPostComment}
          />
        )}

        {currentRole === 'author' && (
          <AuthorWorkspace
            books={books}
            orders={orders}
            messages={messages}
            telemetry={telemetry}
            onPublishBook={handlePublishBook}
            onReplyMessage={handleReplyMessage}
            onRetryDrmDelivery={handleRetryDrmDelivery}
            onRequestInstantPayout={handleRequestInstantPayout}
          />
        )}

        {currentRole === 'admin' && (
          <AdminGovernance />
        )}
      </main>

      {/* Fixed Bottom Audio Preview Player */}
      {activeAudioBook && (
        <AudioPlayer
          currentBook={activeAudioBook}
          isPlaying={isPlayingAudio}
          onTogglePlay={handleTogglePlay}
          onClose={handleClosePlayer}
          onBuyBook={(book) => {
            // Quick trigger purchase
            handleCompleteOrder({
              id: `ord-${Date.now()}`,
              orderNumber: `ACE-2026-${Math.floor(1000 + Math.random() * 9000)}`,
              bookId: book.id,
              bookTitle: book.title,
              bookCover: book.coverImage,
              format: 'audiobook',
              buyerName: 'Current Reader (You)',
              buyerEmail: 'reader@aceplatform.io',
              amount: book.priceAudio,
              royaltyTier: book.royaltyTier,
              creatorEarnings: book.priceAudio * (book.royaltyTier === 'writesound_bridge' ? 0.85 : 0.75),
              platformFee: book.priceAudio * (book.royaltyTier === 'writesound_bridge' ? 0.15 : 0.25),
              deliveryStatus: 'Delivered',
              drmToken: `DRM-${book.royaltyTier === 'writesound_bridge' ? 'WH-85' : 'SD-75'}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
              date: new Date().toISOString().replace('T', ' ').substring(0, 16)
            });
            setIsLibraryOpen(true);
          }}
        />
      )}

      {/* Library / Orders Modal */}
      <LibraryModal
        isOpen={isLibraryOpen}
        onClose={() => setIsLibraryOpen(false)}
        orders={orders}
        onPlayBook={(bookId) => {
          const b = books.find(item => item.id === bookId);
          if (b) handlePlayBookSample(b);
        }}
        catalogBooks={books}
      />

    </div>
  );
}
