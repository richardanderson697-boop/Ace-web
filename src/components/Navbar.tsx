import React from 'react';
import { 
  BookOpen, 
  PenTool, 
  ShieldCheck, 
  Headphones, 
  ShoppingBag, 
  Layers
} from 'lucide-react';
import { UserRole } from '../types';

interface NavbarProps {
  currentRole: UserRole;
  onSelectRole: (role: UserRole) => void;
  activeReaderTab: 'storefront' | 'community';
  onSelectReaderTab: (tab: 'storefront' | 'community') => void;
  cartCount: number;
  onOpenCart: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRole,
  onSelectRole,
  activeReaderTab,
  onSelectReaderTab,
  cartCount,
  onOpenCart
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-slate-950/95 backdrop-blur-md border-b border-slate-800 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo & Name */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-orange-600 to-indigo-600 p-0.5 shadow-lg shadow-orange-950/30">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Headphones className="w-5 h-5 text-amber-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xl font-bold tracking-tight text-white font-mono">ACE</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 font-semibold tracking-wide">
                PLATFORM
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">Author • Community • Ecosystem</p>
          </div>
        </div>

        {/* Portal Switcher (Reader, Author, Admin) */}
        <nav className="flex items-center p-1 bg-slate-900 border border-slate-800 rounded-xl shadow-inner">
          <button
            id="nav-reader-portal"
            onClick={() => onSelectRole('reader')}
            className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
              currentRole === 'reader'
                ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Reader Portal</span>
          </button>

          <button
            id="nav-author-workspace"
            onClick={() => onSelectRole('author')}
            className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
              currentRole === 'author'
                ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <PenTool className="w-4 h-4" />
            <span>Author Workspace</span>
          </button>

          <button
            id="nav-admin-governance"
            onClick={() => onSelectRole('admin')}
            className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
              currentRole === 'admin'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Admin Governance</span>
          </button>
        </nav>

        {/* Secondary Portal Sub-actions or Cart */}
        <div className="flex items-center space-x-3">
          {currentRole === 'reader' && (
            <div className="hidden md:flex items-center bg-slate-900/80 p-0.5 rounded-lg border border-slate-800 text-xs">
              <button
                onClick={() => onSelectReaderTab('storefront')}
                className={`px-3 py-1 rounded-md transition-colors ${
                  activeReaderTab === 'storefront'
                    ? 'bg-slate-800 text-amber-400 font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Storefront
              </button>
              <button
                onClick={() => onSelectReaderTab('community')}
                className={`px-3 py-1 rounded-md transition-colors ${
                  activeReaderTab === 'community'
                    ? 'bg-slate-800 text-amber-400 font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Fan Feed &amp; Forum
              </button>
            </div>
          )}

          {currentRole === 'author' && (
            <div className="hidden lg:flex items-center space-x-2 text-xs text-indigo-300 bg-indigo-950/50 border border-indigo-800/60 px-2.5 py-1 rounded-lg">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Write-Sound Bridge: <strong className="text-emerald-400">Connected (85% Tier)</strong></span>
            </div>
          )}

          {currentRole === 'admin' && (
            <div className="hidden lg:flex items-center space-x-2 text-xs text-emerald-300 bg-emerald-950/40 border border-emerald-800/50 px-2.5 py-1 rounded-lg">
              <Layers className="w-3.5 h-3.5 text-emerald-400" />
              <span>Multi-Tenant Isolation: <strong>Active</strong></span>
            </div>
          )}

          {/* Cart / Purchases */}
          <button
            id="cart-trigger-button"
            onClick={onOpenCart}
            aria-label={`Shopping Cart (${cartCount} items)`}
            className="relative p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition-colors"
          >
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-amber-500 text-slate-950 text-xs font-bold flex items-center justify-center shadow-md">
                {cartCount}
              </span>
            )}
          </button>
        </div>

      </div>
    </header>
  );
};
