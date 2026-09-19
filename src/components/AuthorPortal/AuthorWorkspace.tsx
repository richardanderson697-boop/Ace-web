import React, { useState } from 'react';
import { 
  Upload, 
  BarChart3, 
  PackageCheck, 
  DollarSign, 
  Zap, 
  Sparkles,
  BookOpen,
  ArrowUpRight
} from 'lucide-react';
import { Book, DigitalOrder, CustomerMessage, AuthorTelemetry } from '../../types';
import { DirectIngestion } from './DirectIngestion';
import { AnalyticsTelemetry } from './AnalyticsTelemetry';
import { OrdersBoard } from './OrdersBoard';
import { PayoutDashboard } from './PayoutDashboard';

interface AuthorWorkspaceProps {
  books: Book[];
  orders: DigitalOrder[];
  messages: CustomerMessage[];
  telemetry: AuthorTelemetry;
  onPublishBook: (newBook: Book) => void;
  onReplyMessage: (messageId: string, replyText: string) => void;
  onRetryDrmDelivery: (orderId: string) => void;
  onRequestInstantPayout: (amount: number) => void;
}

export const AuthorWorkspace: React.FC<AuthorWorkspaceProps> = ({
  books,
  orders,
  messages,
  telemetry,
  onPublishBook,
  onReplyMessage,
  onRetryDrmDelivery,
  onRequestInstantPayout
}) => {
  const [activeTab, setActiveTab] = useState<'ingestion' | 'analytics' | 'orders' | 'payout'>('ingestion');

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8">
      
      {/* Author Workspace Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-mono font-bold">
              AUTHOR WORKSPACE
            </span>
            <span className="text-xs text-slate-400">Isolated Multi-Tenant Environment</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-1">
            Creator Studio: Elena Vance
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Direct MP3 &amp; Write-Sound Ingestion • High-Fidelity Lossless Stems • 85% &amp; 75% Tier Governance
          </p>
        </div>

        {/* Quick Author Switcher / Status */}
        <div className="flex items-center space-x-3 text-xs">
          <div className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-mono">Write-Sound Bridge: Online</span>
          </div>

          <div className="px-3 py-2 rounded-xl bg-indigo-950/60 border border-indigo-800/50 text-indigo-200 font-mono font-bold">
            85% Split Tier
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none border-b border-slate-800/80">
        <button
          id="author-tab-ingestion"
          onClick={() => setActiveTab('ingestion')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
            activeTab === 'ingestion'
              ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-slate-950 font-bold shadow-md'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Upload className="w-4 h-4" />
          <span>Upload &amp; Direct Ingestion</span>
        </button>

        <button
          id="author-tab-analytics"
          onClick={() => setActiveTab('analytics')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
            activeTab === 'analytics'
              ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Analytics &amp; Order Telemetry</span>
        </button>

        <button
          id="author-tab-orders"
          onClick={() => setActiveTab('orders')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
            activeTab === 'orders'
              ? 'bg-gradient-to-r from-slate-800 to-slate-700 text-white shadow-md'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <PackageCheck className="w-4 h-4" />
          <span>Orders &amp; Reader Messaging</span>
          {messages.some(m => m.status === 'unread') && (
            <span className="w-2 h-2 rounded-full bg-rose-500" />
          )}
        </button>

        <button
          id="author-tab-payout"
          onClick={() => setActiveTab('payout')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
            activeTab === 'payout'
              ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          <span>Direct Payout Dashboard</span>
        </button>
      </div>

      {/* Tab Panels */}
      <div>
        {activeTab === 'ingestion' && (
          <DirectIngestion onPublishBook={onPublishBook} />
        )}

        {activeTab === 'analytics' && (
          <AnalyticsTelemetry telemetry={telemetry} authorBooks={books} />
        )}

        {activeTab === 'orders' && (
          <OrdersBoard 
            orders={orders} 
            messages={messages} 
            onReplyMessage={onReplyMessage} 
            onRetryDrmDelivery={onRetryDrmDelivery} 
          />
        )}

        {activeTab === 'payout' && (
          <PayoutDashboard 
            telemetry={telemetry} 
            onRequestInstantPayout={onRequestInstantPayout} 
          />
        )}
      </div>

    </div>
  );
};
