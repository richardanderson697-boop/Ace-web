import React from 'react';
import { 
  X, 
  ShoppingBag, 
  Play, 
  Download, 
  KeyRound, 
  CheckCircle2, 
  Clock, 
  ExternalLink,
  BookOpen
} from 'lucide-react';
import { DigitalOrder, Book } from '../types';

interface LibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: DigitalOrder[];
  onPlayBook: (bookId: string) => void;
  catalogBooks: Book[];
}

export const LibraryModal: React.FC<LibraryModalProps> = ({
  isOpen,
  onClose,
  orders,
  onPlayBook,
  catalogBooks
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div 
        id="reader-library-modal"
        className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-slate-100 space-y-6 max-h-[85vh] overflow-y-auto"
      >
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Your ACE Digital Library</h2>
              <p className="text-xs text-slate-400">
                Purchased master copies with verified DRM cryptographic keys.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close digital library modal"
            className="p-2 rounded-full bg-slate-950 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Orders List */}
        {orders.length > 0 ? (
          <div className="space-y-4">
            {orders.map(order => (
              <div 
                key={order.id}
                className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="flex items-center space-x-3">
                  <img 
                    src={order.bookCover} 
                    alt={order.bookTitle} 
                    className="w-12 h-16 rounded object-cover shadow border border-slate-700"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <span className="text-[10px] font-mono text-amber-400 uppercase font-semibold">
                      {order.format} Edition
                    </span>
                    <h4 className="text-sm font-bold text-white">
                      {order.bookTitle}
                    </h4>
                    <div className="text-xs text-slate-400 font-mono mt-0.5 flex items-center gap-1.5">
                      <KeyRound className="w-3 h-3 text-slate-400" />
                      <span>{order.drmToken}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
                  <button
                    onClick={() => {
                      onPlayBook(order.bookId);
                      onClose();
                    }}
                    className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center space-x-1.5 transition-colors"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Play</span>
                  </button>

                  <a
                    href="#download"
                    onClick={(e) => {
                      e.preventDefault();
                      alert(`Exporting high-resolution master copy for "${order.bookTitle}" (320kbps MP3 + ID3 embedded cover art).`);
                    }}
                    className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center space-x-1 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>MP3</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 space-y-3">
            <BookOpen className="w-10 h-10 text-slate-600 mx-auto" />
            <h3 className="text-base font-semibold text-slate-300">Your library is currently empty</h3>
            <p className="text-xs text-slate-400">
              Browse the Reader Storefront to sample and purchase audiobooks with direct 85% creator splits.
            </p>
          </div>
        )}

      </div>
    </div>
  );
};
