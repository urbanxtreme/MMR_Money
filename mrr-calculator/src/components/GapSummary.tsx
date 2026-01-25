/**
 * Gap Summary Component
 * 
 * Displays the key metrics in large, easy-to-read numbers:
 * - Original MRR
 * - Net to Bank
 * - Total Gap
 * - Gap Percentage
 */

import type { CalculationResult } from '../utils/calculateMRRGap';
import { formatCurrency, formatPercent } from '../utils/calculateMRRGap';

interface GapSummaryProps {
    result: CalculationResult;
}

export const GapSummary = ({ result }: GapSummaryProps) => {
    const { mrr, netToBank, totalGap, gapPercent } = result;

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Metric Card: MRR */}
            <div className="bg-slate-800/40 rounded-xl p-5 border border-slate-700/50 hover:border-slate-600 transition-colors group">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1 group-hover:text-emerald-400 transition-colors">
                    Reported MRR
                </p>
                <div className="text-2xl lg:text-3xl font-bold text-white tracking-tight font-mono tabular-nums truncate">
                    {formatCurrency(mrr)}
                </div>
                <p className="text-xs text-slate-500 mt-2">
                    Gross revenue
                </p>
            </div>

            {/* Metric Card: Net to Bank */}
            <div className="bg-slate-800/40 rounded-xl p-5 border border-slate-700/50 hover:border-slate-600 transition-colors group">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1 group-hover:text-blue-400 transition-colors">
                    Net to Bank
                </p>
                <div className="text-2xl lg:text-3xl font-bold text-white tracking-tight font-mono tabular-nums truncate">
                    {formatCurrency(netToBank)}
                </div>
                <p className="text-xs text-slate-500 mt-2">
                    Actual deposit
                </p>
            </div>

            {/* Metric Card: Total Gap */}
            <div className="bg-slate-800/40 rounded-xl p-5 border border-slate-700/50 hover:border-slate-600 transition-colors group">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1 group-hover:text-rose-400 transition-colors">
                    Total Deductions
                </p>
                <div className="text-2xl lg:text-3xl font-bold text-rose-500 tracking-tight font-mono tabular-nums truncate">
                    {formatCurrency(totalGap)}
                </div>
                <p className="text-xs text-slate-500 mt-2">
                    Fees & Taxes
                </p>
            </div>

            {/* Metric Card: Gap Rate */}
            <div className="bg-slate-800/40 rounded-xl p-5 border border-slate-700/50 hover:border-slate-600 transition-colors group">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1 group-hover:text-amber-400 transition-colors">
                    Efficiency Rate
                </p>
                <div className="text-2xl lg:text-3xl font-bold text-amber-500 tracking-tight font-mono tabular-nums truncate">
                    {formatPercent(gapPercent)}
                </div>
                <p className="text-xs text-slate-500 mt-2">
                    Revenue lost
                </p>
            </div>
        </div>
    );
};

export default GapSummary;
