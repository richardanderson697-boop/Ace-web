import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Layers, 
  DollarSign, 
  Zap, 
  CheckCircle2, 
  AlertTriangle, 
  Settings, 
  Sliders, 
  ArrowUpRight, 
  Users, 
  Cpu, 
  FileCheck, 
  Lock,
  RefreshCw,
  Sparkles,
  CreditCard
} from 'lucide-react';
import { RoyaltyTier, SettlementBatch, ComplianceReviewItem } from '../../types';
import { ROYALTY_TIERS, INITIAL_SETTLEMENTS, INITIAL_COMPLIANCE_ITEMS } from '../../data/mockData';

interface AdminGovernanceProps {
  // Can pass any needed global states or callback handlers
}

export const AdminGovernance: React.FC<AdminGovernanceProps> = () => {
  const [selectedTenant, setSelectedTenant] = useState<string>('all');
  const [activeAdminSection, setActiveAdminSection] = useState<'matrix' | 'settlements' | 'compliance' | 'stripe_ledger'>('matrix');
  
  // Tier matrix state (editable by platform admin)
  const [tiers, setTiers] = useState<Record<string, RoyaltyTier>>(ROYALTY_TIERS);
  const [editingTierId, setEditingTierId] = useState<string | null>(null);
  const [tempCreatorShare, setTempCreatorShare] = useState<number>(0.85);

  // Settlement batches state
  const [settlementBatches, setSettlementBatches] = useState<SettlementBatch[]>(INITIAL_SETTLEMENTS);
  const [isExecutingBatch, setIsExecutingBatch] = useState(false);

  // Compliance queue state
  const [complianceQueue, setComplianceQueue] = useState<ComplianceReviewItem[]>(INITIAL_COMPLIANCE_ITEMS);

  // Trigger automated settlement batch
  const handleExecuteSettlement = () => {
    setIsExecutingBatch(true);
    setTimeout(() => {
      const newBatch: SettlementBatch = {
        batchId: `SETTLE-2026-${Math.floor(100 + Math.random() * 900)}`,
        period: 'Current Bi-Weekly Cycle',
        totalAuthors: 174,
        grossSettlement: 146800.00,
        creatorNetPayouts: 122950.00,
        acePlatformRetained: 23850.00,
        status: 'Completed',
        settlementDate: new Date().toISOString().split('T')[0]
      };
      setSettlementBatches([newBatch, ...settlementBatches]);
      setIsExecutingBatch(false);
    }, 1200);
  };

  const handleApproveCompliance = (id: string) => {
    setComplianceQueue(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, complianceStatus: 'Approved' };
      }
      return item;
    }));
  };

  const handleSaveTier = (tierId: string) => {
    setTiers(prev => ({
      ...prev,
      [tierId]: {
        ...prev[tierId],
        creatorShare: tempCreatorShare,
        platformShare: Number((1 - tempCreatorShare).toFixed(2))
      }
    }));
    setEditingTierId(null);
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8">
      
      {/* Header & Multi-Tenant Isolation Switcher */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-teal-950/40 to-slate-900 border border-teal-900/50 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-emerald-400 font-bold">
            <ShieldCheck className="w-4 h-4" />
            <span>PLATFORM GOVERNANCE &amp; MULTI-TENANT ISOLATION</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-1">
            Master Tiered Royalty Administration
          </h1>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            Enforce automated revenue splits, multi-tenant partition boundaries, DRM watermarking integrity, and compliance ingestion audits.
          </p>
        </div>

        {/* Multi-Tenant Switcher */}
        <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1 w-full md:w-auto">
          <label className="block text-[10px] font-mono uppercase text-slate-400">
            Active Tenant Partition
          </label>
          <div className="flex items-center space-x-2">
            <Layers className="w-4 h-4 text-emerald-400" />
            <select
              value={selectedTenant}
              onChange={(e) => setSelectedTenant(e.target.value)}
              aria-label="Select active tenant partition"
              className="bg-transparent text-xs font-mono font-bold text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="all" className="bg-slate-900">All Master Tenants (Federated)</option>
              <option value="vance" className="bg-slate-900">Tenant: Elena Vance Autonomous Studio</option>
              <option value="sterling" className="bg-slate-900">Tenant: Sterling Deep Space Imprints</option>
              <option value="mercer" className="bg-slate-900">Tenant: Mercer Noir Press</option>
            </select>
          </div>
        </div>
      </div>

      {/* Sub-navigation tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 border-b border-slate-800 scrollbar-none">
        <button
          id="admin-tab-matrix"
          onClick={() => setActiveAdminSection('matrix')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            activeAdminSection === 'matrix'
              ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Tiered Royalty Architecture Matrix</span>
        </button>

        <button
          id="admin-tab-settlements"
          onClick={() => setActiveAdminSection('settlements')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            activeAdminSection === 'settlements'
              ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          <span>Automated Royalty Settlements</span>
        </button>

        <button
          id="admin-tab-compliance"
          onClick={() => setActiveAdminSection('compliance')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            activeAdminSection === 'compliance'
              ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <FileCheck className="w-4 h-4" />
          <span>Ingestion &amp; Catalog Compliance Review</span>
        </button>

        <button
          id="admin-tab-stripe-ledger"
          onClick={() => setActiveAdminSection('stripe_ledger')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            activeAdminSection === 'stripe_ledger'
              ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>Stripe Connect Multi-Tenant Ledger</span>
        </button>
      </div>

      {/* SECTION 1: TIERED ROYALTY ARCHITECTURE MATRIX */}
      {activeAdminSection === 'matrix' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Write-Sound Bridge Tier Card */}
            <div className="p-6 rounded-2xl bg-slate-900/90 border border-indigo-500/50 shadow-xl flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 text-xs font-mono font-bold flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    TIER 1 (FLAGGED)
                  </span>
                  <span className="text-xs font-mono text-emerald-400 font-bold">
                    {Math.round(tiers.writesound_bridge.creatorShare * 100)}% Creator Share
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white mt-3">
                  Write-Sound Direct API Tier
                </h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  {tiers.writesound_bridge.description}
                </p>

                <div className="mt-4 p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs font-mono">
                  <div className="flex items-center justify-between text-slate-300">
                    <span>Creator Split:</span>
                    <strong className="text-emerald-400 text-sm font-bold">
                      {Math.round(tiers.writesound_bridge.creatorShare * 100)}%
                    </strong>
                  </div>
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Platform Retained:</span>
                    <strong className="text-slate-200">
                      {Math.round(tiers.writesound_bridge.platformShare * 100)}%
                    </strong>
                  </div>
                  <div className="flex items-center justify-between text-slate-400 pt-1 border-t border-slate-900">
                    <span>Ingestion Trigger:</span>
                    <span className="text-amber-400">REST/GraphQL API</span>
                  </div>
                </div>

                <ul className="mt-4 space-y-2 text-xs text-slate-300">
                  {tiers.writesound_bridge.features.map((f, idx) => (
                    <li key={idx} className="flex items-start space-x-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-4 border-t border-slate-800">
                <button
                  onClick={() => {
                    setEditingTierId('writesound_bridge');
                    setTempCreatorShare(tiers.writesound_bridge.creatorShare);
                  }}
                  className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-mono text-slate-200 transition-colors"
                >
                  Configure Split Parameters
                </button>
              </div>
            </div>

            {/* Standard Direct Upload Tier Card */}
            <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 text-xs font-mono font-bold">
                    TIER 2 (STANDARD)
                  </span>
                  <span className="text-xs font-mono text-slate-200 font-bold">
                    {Math.round(tiers.standard_direct.creatorShare * 100)}% Creator Share
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white mt-3">
                  Standard Direct Ingestion Tier
                </h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  {tiers.standard_direct.description}
                </p>

                <div className="mt-4 p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs font-mono">
                  <div className="flex items-center justify-between text-slate-300">
                    <span>Creator Split:</span>
                    <strong className="text-slate-200 text-sm font-bold">
                      {Math.round(tiers.standard_direct.creatorShare * 100)}%
                    </strong>
                  </div>
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Platform Retained:</span>
                    <strong className="text-slate-200">
                      {Math.round(tiers.standard_direct.platformShare * 100)}%
                    </strong>
                  </div>
                  <div className="flex items-center justify-between text-slate-400 pt-1 border-t border-slate-900">
                    <span>Ingestion Trigger:</span>
                    <span className="text-slate-300">Standalone MP3 / ID3</span>
                  </div>
                </div>

                <ul className="mt-4 space-y-2 text-xs text-slate-300">
                  {tiers.standard_direct.features.map((f, idx) => (
                    <li key={idx} className="flex items-start space-x-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-slate-400 flex-shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-4 border-t border-slate-800">
                <button
                  onClick={() => {
                    setEditingTierId('standard_direct');
                    setTempCreatorShare(tiers.standard_direct.creatorShare);
                  }}
                  className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-mono text-slate-200 transition-colors"
                >
                  Configure Split Parameters
                </button>
              </div>
            </div>

            {/* Syndicate Custom Partner Tier Card */}
            <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-mono font-bold">
                    CUSTOM CONTRACT
                  </span>
                  <span className="text-xs font-mono text-amber-400 font-bold">
                    {Math.round(tiers.custom_partner.creatorShare * 100)}% Creator Share
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white mt-3">
                  Premier Anchor Syndicate Tier
                </h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  {tiers.custom_partner.description}
                </p>

                <div className="mt-4 p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs font-mono">
                  <div className="flex items-center justify-between text-slate-300">
                    <span>Creator Split:</span>
                    <strong className="text-amber-400 text-sm font-bold">
                      {Math.round(tiers.custom_partner.creatorShare * 100)}%
                    </strong>
                  </div>
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Platform Retained:</span>
                    <strong className="text-slate-200">
                      {Math.round(tiers.custom_partner.platformShare * 100)}%
                    </strong>
                  </div>
                  <div className="flex items-center justify-between text-slate-400 pt-1 border-t border-slate-900">
                    <span>Ingestion Trigger:</span>
                    <span className="text-slate-300">Publisher Master Seed</span>
                  </div>
                </div>

                <ul className="mt-4 space-y-2 text-xs text-slate-300">
                  {tiers.custom_partner.features.map((f, idx) => (
                    <li key={idx} className="flex items-start space-x-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-4 border-t border-slate-800">
                <button
                  onClick={() => {
                    setEditingTierId('custom_partner');
                    setTempCreatorShare(tiers.custom_partner.creatorShare);
                  }}
                  className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-mono text-slate-200 transition-colors"
                >
                  Configure Split Parameters
                </button>
              </div>
            </div>

          </div>

          {/* Edit Tier Modal */}
          {editingTierId && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full space-y-4">
                <h3 className="text-base font-bold text-white">
                  Edit Royalty Matrix: {tiers[editingTierId].name}
                </h3>
                
                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                    Creator Share Ratio (Current: {Math.round(tempCreatorShare * 100)}%)
                  </label>
                  <input
                    type="range"
                    min="0.50"
                    max="0.95"
                    step="0.01"
                    value={tempCreatorShare}
                    onChange={(e) => setTempCreatorShare(Number(e.target.value))}
                    aria-label="Adjust creator share percentage"
                    className="w-full accent-emerald-500"
                  />
                  <div className="flex justify-between text-xs font-mono text-slate-400 mt-1">
                    <span>Creator: {Math.round(tempCreatorShare * 100)}%</span>
                    <span>Platform Take: {Math.round((1 - tempCreatorShare) * 100)}%</span>
                  </div>
                </div>

                <div className="flex items-center justify-end space-x-3 pt-3">
                  <button
                    onClick={() => setEditingTierId(null)}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleSaveTier(editingTierId)}
                    className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs"
                  >
                    Save Tier Rule
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* SECTION 2: AUTOMATED ROYALTY SETTLEMENTS */}
      {activeAdminSection === 'settlements' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-white">Automated Batch Settlement Engine</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Executes multi-tenant revenue clearing, escrow release, and initiates direct ACH/SEPA wire transfers to connected author accounts.
              </p>
            </div>

            <button
              id="execute-settlement-btn"
              onClick={handleExecuteSettlement}
              disabled={isExecutingBatch}
              className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center space-x-2 transition-all shadow-md"
            >
              {isExecutingBatch ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Settling Multi-Tenant Balances...</span>
                </>
              ) : (
                <>
                  <Zap className="w-3.5 h-3.5 fill-current" />
                  <span>Execute Settlement Batch Now</span>
                </>
              )}
            </button>
          </div>

          {/* Settlement Batches Table */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="bg-slate-950/80 text-slate-400 font-mono border-b border-slate-800">
                    <th className="py-3 px-4">Batch Reference</th>
                    <th className="py-3 px-4">Accounting Period</th>
                    <th className="py-3 px-4">Active Authors</th>
                    <th className="py-3 px-4">Gross Platform Volume</th>
                    <th className="py-3 px-4">Author Net Disbursed</th>
                    <th className="py-3 px-4">ACE Retained Margin</th>
                    <th className="py-3 px-4 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono">
                  {settlementBatches.map(batch => (
                    <tr key={batch.batchId} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-white">{batch.batchId}</td>
                      <td className="py-3.5 px-4 text-slate-300">{batch.period}</td>
                      <td className="py-3.5 px-4 text-slate-300">{batch.totalAuthors} Authors</td>
                      <td className="py-3.5 px-4 text-slate-300">${batch.grossSettlement.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                      <td className="py-3.5 px-4 font-bold text-emerald-400">${batch.creatorNetPayouts.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                      <td className="py-3.5 px-4 text-slate-400">${batch.acePlatformRetained.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                      <td className="py-3.5 px-4 text-right">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          batch.status === 'Completed'
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                            : 'bg-amber-950 text-amber-300 border border-amber-800'
                        }`}>
                          {batch.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 3: INGESTION & CATALOG COMPLIANCE REVIEW */}
      {activeAdminSection === 'compliance' && (
        <div className="space-y-6">
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-300">
              Audit queue for uploaded MP3 files, ID3 embedded artwork extraction, and Write-Sound API cryptographic signatures.
            </span>
            <span className="font-mono text-emerald-400 font-semibold">
              Queue: {complianceQueue.length} Assets Registered
            </span>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="bg-slate-950/80 text-slate-400 font-mono border-b border-slate-800">
                    <th className="py-3 px-4">Title &amp; Author</th>
                    <th className="py-3 px-4">Ingestion Source</th>
                    <th className="py-3 px-4">Assigned Royalty Tier</th>
                    <th className="py-3 px-4">ID3 Artwork Inspection</th>
                    <th className="py-3 px-4">Lossless Checksum</th>
                    <th className="py-3 px-4">Compliance State</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono">
                  {complianceQueue.map(item => (
                    <tr key={item.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-3.5 px-4 font-sans">
                        <div className="font-bold text-white">{item.bookTitle}</div>
                        <div className="text-xs text-slate-400">By {item.author}</div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-mono ${
                          item.ingestionMethod.includes('Write-Sound') 
                            ? 'bg-indigo-950 text-indigo-300 border border-indigo-800' 
                            : 'bg-slate-800 text-slate-300'
                        }`}>
                          {item.ingestionMethod}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-bold text-emerald-400">
                          {item.assignedTier === 'writesound_bridge' ? '85% Tier (Write-Sound)' : '75% Tier (Standard)'}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="text-slate-300 flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          {item.id3ArtworkStatus}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-[11px] text-slate-400">
                        {item.audioChecksum}
                      </td>

                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          item.complianceStatus === 'Approved'
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                            : 'bg-amber-950 text-amber-300 border border-amber-800'
                        }`}>
                          {item.complianceStatus}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        {item.complianceStatus !== 'Approved' ? (
                          <button
                            onClick={() => handleApproveCompliance(item.id)}
                            className="px-2.5 py-1 rounded bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors"
                          >
                            Approve
                          </button>
                        ) : (
                          <span className="text-slate-500 text-xs">Syndicated</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 4: STRIPE CONNECT MULTI-TENANT MARKETPLACE LEDGER */}
      {activeAdminSection === 'stripe_ledger' && (
        <div className="space-y-6">
          
          {/* Top Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-[10px] font-mono uppercase text-slate-400">Total Stripe Volume</span>
              <div className="text-2xl font-bold font-mono text-white">$146,800.00</div>
              <span className="text-[11px] text-slate-400">Processed across all tenants</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-emerald-900/40 space-y-1">
              <span className="text-[10px] font-mono uppercase text-emerald-400">Author Direct Transfers</span>
              <div className="text-2xl font-bold font-mono text-emerald-400">$122,950.00</div>
              <span className="text-[11px] text-slate-400">85% &amp; 75% Creator Splits</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-indigo-900/40 space-y-1">
              <span className="text-[10px] font-mono uppercase text-indigo-300">ACE Application Fees</span>
              <div className="text-2xl font-bold font-mono text-indigo-300">$23,850.00</div>
              <span className="text-[11px] text-slate-400">Platform retained margin</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-[10px] font-mono uppercase text-slate-400">Active Connected Accounts</span>
              <div className="text-2xl font-bold font-mono text-amber-400">174 Accounts</div>
              <span className="text-[11px] text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> 100% KYC Verified
              </span>
            </div>
          </div>

          {/* Connected Accounts Breakdown Table */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">Multi-Tenant Stripe Connect Accounts</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Live destination accounts for instant reader checkout distribution and Write-Sound SSO authentication.
                </p>
              </div>
              <span className="px-2.5 py-1 rounded bg-indigo-500/20 text-indigo-300 font-mono text-xs font-bold">
                API Live Routing Active
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-[11px] font-mono uppercase text-slate-400">
                    <th className="py-3 px-4">Author / Tenant</th>
                    <th className="py-3 px-4">Auth Provider</th>
                    <th className="py-3 px-4">Stripe Account ID</th>
                    <th className="py-3 px-4">Royalty Tier</th>
                    <th className="py-3 px-4">Bank Payout Rail</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono">
                  <tr className="hover:bg-slate-950/40">
                    <td className="py-3.5 px-4 font-sans font-medium text-white">Elena Vance (Write-Sound Autonomous)</td>
                    <td className="py-3.5 px-4 text-indigo-300">Write-Sound SSO (JWT)</td>
                    <td className="py-3.5 px-4 text-amber-400">acct_ws_elena_vance_85</td>
                    <td className="py-3.5 px-4 text-emerald-400 font-bold">85% Creator Net</td>
                    <td className="py-3.5 px-4 text-slate-300">Chase Bank (•••• 9104)</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] font-bold">
                        Active / Instant Ready
                      </span>
                    </td>
                  </tr>

                  <tr className="hover:bg-slate-950/40">
                    <td className="py-3.5 px-4 font-sans font-medium text-white">Sterling Deep Space Imprints</td>
                    <td className="py-3.5 px-4 text-slate-400">Standard Direct Login</td>
                    <td className="py-3.5 px-4 text-amber-400">acct_sterling_direct_75</td>
                    <td className="py-3.5 px-4 text-slate-300 font-bold">75% Creator Net</td>
                    <td className="py-3.5 px-4 text-slate-300">Wells Fargo (•••• 4022)</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] font-bold">
                        Active / Daily Payouts
                      </span>
                    </td>
                  </tr>

                  <tr className="hover:bg-slate-950/40">
                    <td className="py-3.5 px-4 font-sans font-medium text-white">Mercer Noir Press</td>
                    <td className="py-3.5 px-4 text-indigo-300">Write-Sound SSO (JWT)</td>
                    <td className="py-3.5 px-4 text-amber-400">acct_ws_mercer_noir_85</td>
                    <td className="py-3.5 px-4 text-emerald-400 font-bold">85% Creator Net</td>
                    <td className="py-3.5 px-4 text-slate-300">Silicon Valley Bank (•••• 7811)</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] font-bold">
                        Active / Instant Ready
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Webhook Stream Simulator */}
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-xs space-y-3">
            <div className="flex items-center justify-between text-slate-400">
              <span className="flex items-center gap-2 font-bold text-slate-200">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Stripe Webhook Event Pipeline (Real-Time Ingestion)
              </span>
              <span className="text-[11px] text-slate-500">Endpoint: /api/stripe/webhook</span>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto">
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 flex items-center justify-between">
                <div>
                  <span className="text-emerald-400 font-bold">checkout.session.completed</span>
                  <span className="text-slate-500 ml-2">cs_test_ace_981a2</span>
                  <span className="text-slate-400 ml-2">— Gross $19.99 split: $16.99 to acct_ws_elena_vance_85, $3.00 app fee</span>
                </div>
                <span className="text-[10px] text-slate-500">2 min ago</span>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 flex items-center justify-between">
                <div>
                  <span className="text-indigo-400 font-bold">transfer.created</span>
                  <span className="text-slate-500 ml-2">tr_test_88bc21</span>
                  <span className="text-slate-400 ml-2">— Net author royalty $16.99 transferred to Connected Stripe Account</span>
                </div>
                <span className="text-[10px] text-slate-500">2 min ago</span>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 flex items-center justify-between">
                <div>
                  <span className="text-teal-400 font-bold">account.updated</span>
                  <span className="text-slate-500 ml-2">acct_ws_elena_vance_85</span>
                  <span className="text-slate-400 ml-2">— Payouts enabled, KYC verified, 1099-K compliance synced</span>
                </div>
                <span className="text-[10px] text-slate-500">1 hour ago</span>
              </div>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
