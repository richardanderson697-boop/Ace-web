import React from 'react';
import { 
  TrendingUp, 
  Headphones, 
  BookOpen, 
  DollarSign, 
  ArrowUpRight, 
  BarChart3, 
  PieChart, 
  Calendar,
  Sparkles,
  Layers
} from 'lucide-react';
import { AuthorTelemetry, Book } from '../../types';

interface AnalyticsTelemetryProps {
  telemetry: AuthorTelemetry;
  authorBooks: Book[];
}

export const AnalyticsTelemetry: React.FC<AnalyticsTelemetryProps> = ({
  telemetry,
  authorBooks
}) => {
  const totalUnits = telemetry.totalCopiesSold || (telemetry.audioCopiesSold + telemetry.ebookUnitsSold);
  const audioPercent = Math.round((telemetry.audioCopiesSold / totalUnits) * 100) || 70;
  const ebookPercent = 100 - audioPercent;

  const maxGross = Math.max(...telemetry.recentMonthlySales.map(m => m.grossRevenue));

  return (
    <div className="space-y-6">
      
      {/* Top Telemetry KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Gross Revenue */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-mono uppercase">Gross Catalog Sales</span>
            <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
              <DollarSign className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-white">
            ${telemetry.totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="mt-1 flex items-center space-x-1.5 text-xs text-emerald-400 font-medium">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+{telemetry.momGrowthPercentage}% MoM Growth</span>
          </div>
        </div>

        {/* Creator Net Revenue */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-950/60 to-slate-900 border border-indigo-800/40 shadow-lg">
          <div className="flex items-center justify-between text-xs text-indigo-300">
            <span className="font-mono uppercase">Creator Net Payout (85%/75%)</span>
            <span className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-300">
              <Sparkles className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-emerald-400">
            ${telemetry.creatorNet.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="mt-1 text-xs text-slate-400">
            Effective take rate: <strong className="text-slate-200">83.1% Net</strong> across catalog
          </div>
        </div>

        {/* Total Copies Sold */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-mono uppercase">Total Copies Sold</span>
            <span className="p-1.5 rounded-lg bg-slate-800 text-slate-300">
              <BarChart3 className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-white">
            {telemetry.totalCopiesSold.toLocaleString()}
          </div>
          <div className="mt-1 text-xs text-slate-400 flex items-center gap-1">
            <span>Audiobooks + EPUB Units</span>
          </div>
        </div>

        {/* Pending Escrow */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-mono uppercase">Pending Escrow Settlement</span>
            <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
              <Calendar className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-white">
            ${telemetry.pendingEscrow.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="mt-1 text-xs text-slate-400">
            Next settlement: <strong className="text-slate-200">{telemetry.nextPayoutDate}</strong>
          </div>
        </div>

      </div>

      {/* Unit Breakdown: E-Book vs Audiobook */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Unit ratio card */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider">
                E-Book vs. Audiobook Units
              </h3>
              <PieChart className="w-4 h-4 text-slate-400" />
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Distribution of reader purchases across formats.
            </p>

            {/* Split Bar */}
            <div className="mt-6 space-y-2">
              <div className="h-4 w-full rounded-full bg-slate-800 overflow-hidden flex shadow-inner">
                <div 
                  className="h-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-700"
                  style={{ width: `${audioPercent}%` }}
                  title={`Audiobook: ${audioPercent}%`}
                />
                <div 
                  className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 transition-all duration-700"
                  style={{ width: `${ebookPercent}%` }}
                  title={`E-Book: ${ebookPercent}%`}
                />
              </div>

              <div className="flex items-center justify-between text-xs font-mono pt-1">
                <div className="flex items-center space-x-1.5 text-amber-400">
                  <Headphones className="w-3.5 h-3.5" />
                  <span>Audiobook ({audioPercent}%)</span>
                </div>
                <div className="flex items-center space-x-1.5 text-indigo-400">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>E-Book ({ebookPercent}%)</span>
                </div>
              </div>
            </div>

            {/* Metric counters */}
            <div className="mt-6 grid grid-cols-2 gap-3 pt-4 border-t border-slate-800/80">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <div className="text-[11px] font-mono text-slate-400">AUDIOBOOK UNITS</div>
                <div className="text-lg font-bold font-mono text-amber-400 mt-0.5">
                  {telemetry.audioCopiesSold.toLocaleString()}
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">Avg: $19.40 / unit</div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <div className="text-[11px] font-mono text-slate-400">E-BOOK UNITS</div>
                <div className="text-lg font-bold font-mono text-indigo-400 mt-0.5">
                  {telemetry.ebookUnitsSold.toLocaleString()}
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">Avg: $8.90 / unit</div>
              </div>
            </div>
          </div>

          <div className="mt-4 p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/20 text-xs text-emerald-300">
            Write-Sound syndicated titles are outperforming standard MP3s by <strong className="text-white">+38% higher average conversion</strong> in the fan feed.
          </div>
        </div>

        {/* Period Comparisons & MoM Growth Chart */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-lg space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider">
                Monthly Revenue &amp; Unit Telemetry
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Comparing Gross Platform Volume vs. Author Net Settlement over the last 5 operational periods.
              </p>
            </div>
            <div className="flex items-center space-x-3 text-xs font-mono">
              <span className="flex items-center gap-1 text-slate-400">
                <span className="w-2.5 h-2.5 rounded bg-slate-700" />
                Gross Sales
              </span>
              <span className="flex items-center gap-1 text-emerald-400">
                <span className="w-2.5 h-2.5 rounded bg-emerald-500" />
                Creator Net
              </span>
            </div>
          </div>

          {/* Visual bar chart */}
          <div className="h-44 flex items-end justify-between gap-3 pt-4 px-2">
            {telemetry.recentMonthlySales.map((monthData, idx) => {
              const grossHeight = (monthData.grossRevenue / maxGross) * 100;
              const netHeight = (monthData.creatorNet / maxGross) * 100;

              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 group">
                  <div className="w-full flex items-end justify-center gap-1.5 h-36">
                    {/* Gross Bar */}
                    <div 
                      className="w-5 bg-slate-700/80 rounded-t transition-all group-hover:bg-slate-600"
                      style={{ height: `${grossHeight}%` }}
                      title={`Gross: $${monthData.grossRevenue.toFixed(2)}`}
                    />
                    {/* Net Bar */}
                    <div 
                      className="w-5 bg-gradient-to-t from-emerald-600 to-teal-400 rounded-t transition-all group-hover:from-emerald-500 group-hover:to-teal-300"
                      style={{ height: `${netHeight}%` }}
                      title={`Creator Net: $${monthData.creatorNet.toFixed(2)}`}
                    />
                  </div>
                  <span className="text-[11px] font-mono text-slate-400">
                    {monthData.month.split(' ')[0]}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Monthly detail table */}
          <div className="overflow-x-auto pt-2 border-t border-slate-800">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="text-slate-400 font-mono border-b border-slate-800">
                  <th className="py-2">Period</th>
                  <th className="py-2">Audio Units</th>
                  <th className="py-2">E-Book Units</th>
                  <th className="py-2">Gross Sales</th>
                  <th className="py-2 text-right">Creator Net Payout</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {telemetry.recentMonthlySales.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-2 font-medium text-slate-200">{row.month}</td>
                    <td className="py-2 text-amber-400">{row.audio}</td>
                    <td className="py-2 text-indigo-400">{row.ebook}</td>
                    <td className="py-2 text-slate-300">${row.grossRevenue.toFixed(2)}</td>
                    <td className="py-2 text-right font-bold text-emerald-400">${row.creatorNet.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>

      </div>

    </div>
  );
};
