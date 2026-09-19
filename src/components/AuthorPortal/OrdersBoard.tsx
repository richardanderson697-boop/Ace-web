import React, { useState } from 'react';
import { 
  PackageCheck, 
  MessageSquare, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Send, 
  Search, 
  Filter, 
  KeyRound, 
  UserCheck, 
  ExternalLink 
} from 'lucide-react';
import { DigitalOrder, CustomerMessage } from '../../types';

interface OrdersBoardProps {
  orders: DigitalOrder[];
  messages: CustomerMessage[];
  onReplyMessage: (messageId: string, replyText: string) => void;
  onRetryDrmDelivery: (orderId: string) => void;
}

export const OrdersBoard: React.FC<OrdersBoardProps> = ({
  orders,
  messages,
  onReplyMessage,
  onRetryDrmDelivery
}) => {
  const [activeTab, setActiveTab] = useState<'orders' | 'messages'>('orders');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Messaging reply state
  const [selectedMessageId, setSelectedMessageId] = useState<string>(messages[0]?.id || '');
  const [replyInput, setReplyInput] = useState<string>('');

  const filteredOrders = orders.filter(ord => {
    const matchesStatus = statusFilter === 'all' || ord.deliveryStatus === statusFilter;
    const matchesSearch = ord.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ord.buyerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ord.bookTitle.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const selectedMsg = messages.find(m => m.id === selectedMessageId) || messages[0];

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyInput.trim() || !selectedMsg) return;
    onReplyMessage(selectedMsg.id, replyInput);
    setReplyInput('');
  };

  const getStatusBadge = (status: DigitalOrder['deliveryStatus']) => {
    switch (status) {
      case 'Delivered':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-mono font-semibold bg-emerald-950 text-emerald-300 border border-emerald-500/40 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            Delivered
          </span>
        );
      case 'Pending DRM':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-mono font-semibold bg-amber-950 text-amber-300 border border-amber-500/40 flex items-center gap-1.5 animate-pulse">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            Pending DRM
          </span>
        );
      case 'Processing':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-mono font-semibold bg-indigo-950 text-indigo-300 border border-indigo-500/40 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping" />
            Processing
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-mono font-semibold bg-rose-950 text-rose-300 border border-rose-500/40 flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
            Failed
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Tab Switcher & Summary Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
        <div className="flex items-center space-x-2">
          <button
            id="orders-tab-orders"
            onClick={() => setActiveTab('orders')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'orders'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <PackageCheck className="w-4 h-4" />
            <span>Digital Delivery Orders ({orders.length})</span>
          </button>

          <button
            id="orders-tab-messages"
            onClick={() => setActiveTab('messages')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'messages'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Customer Support &amp; Inquiries ({messages.length})</span>
            {messages.some(m => m.status === 'unread') && (
              <span className="w-2 h-2 rounded-full bg-rose-500" />
            )}
          </button>
        </div>

        {activeTab === 'orders' && (
          <div className="flex items-center space-x-2 text-xs">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search order #, buyer, title..."
                className="pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-400 text-xs focus:outline-none focus:border-amber-500"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              aria-label="Filter orders by digital delivery status"
              className="bg-slate-950 border border-slate-800 text-slate-300 py-1.5 px-3 rounded-xl text-xs focus:outline-none focus:border-amber-500 font-mono"
            >
              <option value="all">All Delivery States</option>
              <option value="Delivered">Delivered</option>
              <option value="Pending DRM">Pending DRM</option>
              <option value="Processing">Processing</option>
            </select>
          </div>
        )}
      </div>

      {activeTab === 'orders' ? (
        /* ORDERS BOARD TABLE */
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="bg-slate-950/80 text-slate-400 font-mono border-b border-slate-800">
                  <th className="py-3 px-4">Order ID &amp; Date</th>
                  <th className="py-3 px-4">Book Title &amp; Edition</th>
                  <th className="py-3 px-4">Customer &amp; Email</th>
                  <th className="py-3 px-4">Amount &amp; Split</th>
                  <th className="py-3 px-4">Delivery State</th>
                  <th className="py-3 px-4">DRM Token</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredOrders.map(ord => (
                  <tr key={ord.id} className="hover:bg-slate-800/30 transition-colors">
                    
                    <td className="py-3.5 px-4 font-mono">
                      <div className="font-bold text-white">{ord.orderNumber}</div>
                      <div className="text-[11px] text-slate-400">{ord.date}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center space-x-2.5">
                        <img 
                          src={ord.bookCover} 
                          alt={ord.bookTitle} 
                          className="w-7 h-9 rounded object-cover border border-slate-700"
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <div className="font-medium text-slate-200 line-clamp-1">{ord.bookTitle}</div>
                          <span className="uppercase text-[10px] font-mono text-amber-400 font-semibold">
                            {ord.format}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-medium text-slate-200">{ord.buyerName}</div>
                      <div className="text-[11px] text-slate-400 font-mono">{ord.buyerEmail}</div>
                    </td>

                    <td className="py-3.5 px-4 font-mono">
                      <div className="text-slate-200 font-bold">${ord.amount.toFixed(2)}</div>
                      <div className="text-emerald-400 text-[11px]">
                        Creator Net: +${ord.creatorEarnings.toFixed(2)}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      {getStatusBadge(ord.deliveryStatus)}
                    </td>

                    <td className="py-3.5 px-4 font-mono text-[11px] text-slate-300">
                      <span className="p-1 rounded bg-slate-950 border border-slate-800">
                        {ord.drmToken}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      {ord.deliveryStatus === 'Pending DRM' ? (
                        <button
                          onClick={() => onRetryDrmDelivery(ord.id)}
                          className="px-2.5 py-1 rounded bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs font-mono transition-colors"
                        >
                          Push DRM License
                        </button>
                      ) : (
                        <span className="text-[11px] font-mono text-slate-400">Verified</span>
                      )}
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* CUSTOMER MESSAGING & SUPPORT BOARD */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Messages list */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 space-y-2 overflow-y-auto max-h-[520px]">
            <div className="text-xs font-mono uppercase text-slate-400 mb-2 px-1">
              Active Reader Inquiries
            </div>
            {messages.map(msg => (
              <div
                key={msg.id}
                onClick={() => setSelectedMessageId(msg.id)}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                  selectedMessageId === msg.id
                    ? 'bg-slate-950 border-amber-500 shadow-md'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-bold text-white">{msg.buyerName}</span>
                  <span className="text-[10px] text-slate-400">{msg.date}</span>
                </div>
                <div className="text-xs font-medium text-amber-400 truncate">
                  {msg.subject}
                </div>
                <p className="text-xs text-slate-400 line-clamp-1 mt-1">
                  {msg.lastMessage}
                </p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-[10px] font-mono text-slate-400">
                    Order: {msg.orderId}
                  </span>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                    msg.status === 'unread' 
                      ? 'bg-rose-950 text-rose-300 border border-rose-800' 
                      : msg.status === 'replied'
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                      : 'bg-slate-800 text-slate-300'
                  }`}>
                    {msg.status.toUpperCase()}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Conversation Thread & Reply Panel */}
          <div className="md:col-span-2 bg-slate-900/80 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between space-y-4">
            {selectedMsg ? (
              <>
                <div className="border-b border-slate-800 pb-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-base font-bold text-white">{selectedMsg.subject}</h3>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Reader: <strong className="text-slate-200">{selectedMsg.buyerName}</strong> ({selectedMsg.buyerEmail})
                      </p>
                    </div>
                    <span className="text-xs font-mono text-amber-400">
                      Order: {selectedMsg.orderId}
                    </span>
                  </div>
                </div>

                {/* Messages in thread */}
                <div className="flex-1 space-y-3 max-h-[300px] overflow-y-auto pr-2">
                  {selectedMsg.thread.map((t, idx) => (
                    <div 
                      key={idx}
                      className={`p-3.5 rounded-xl text-xs space-y-1 ${
                        t.sender === 'author'
                          ? 'bg-amber-500/10 border border-amber-500/30 ml-8 text-amber-100'
                          : 'bg-slate-950 border border-slate-800 mr-8 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-bold">
                          {t.sender === 'author' ? 'You (Author)' : selectedMsg.buyerName}
                        </span>
                        <span className="text-slate-400 font-mono">{t.timestamp}</span>
                      </div>
                      <p className="leading-relaxed whitespace-pre-line">{t.message}</p>
                    </div>
                  ))}
                </div>

                {/* Reply composer */}
                <form onSubmit={handleSendReply} className="pt-3 border-t border-slate-800 flex items-center gap-2">
                  <input
                    type="text"
                    value={replyInput}
                    onChange={(e) => setReplyInput(e.target.value)}
                    placeholder="Type an official author response..."
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:border-amber-500"
                  />
                  <button
                    type="submit"
                    disabled={!replyInput.trim()}
                    className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-slate-950 font-bold rounded-xl text-xs transition-colors flex items-center space-x-1.5 shadow"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Reply</span>
                  </button>
                </form>
              </>
            ) : (
              <div className="flex items-center justify-center h-48 text-slate-400 text-xs">
                Select an inquiry to view the correspondence thread.
              </div>
            )}
          </div>

        </div>
      )}

    </div>
  );
};
