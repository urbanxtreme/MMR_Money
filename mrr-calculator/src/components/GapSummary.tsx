import type { CalculationResult } from '../utils/calculateMRRGap';
import { formatCurrency, formatPercent } from '../utils/calculateMRRGap';

interface GapSummaryProps {
    result: CalculationResult;
}

export const GapSummary = ({ result }: GapSummaryProps) => {
    const { mrr, netToBank, totalGap, gapPercent } = result;

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Reported MRR */}
            <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <p className="text-xs font-medium text-gray-500 tracking-wide mb-1">
                    Reported MRR
                </p>
                <div className="text-2xl lg:text-3xl font-bold text-gray-900 tracking-tight font-mono tabular-nums">
                    {formatCurrency(mrr)}
                </div>
                <p className="text-xs text-gray-400 mt-2">
                    Gross revenue
                </p>
            </div>

            {/* Net to Bank */}
            <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <p className="text-xs font-medium text-gray-500 tracking-wide mb-1">
                    Net to Bank
                </p>
                <div className="text-2xl lg:text-3xl font-bold text-emerald-600 tracking-tight font-mono tabular-nums">
                    {formatCurrency(netToBank)}
                </div>
                <p className="text-xs text-gray-400 mt-2">
                    Actual deposit
                </p>
            </div>

            {/* Total Deductions */}
            <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <p className="text-xs font-medium text-gray-500 tracking-wide mb-1">
                    Total Deductions
                </p>
                <div className="text-2xl lg:text-3xl font-bold text-rose-500 tracking-tight font-mono tabular-nums">
                    {formatCurrency(totalGap)}
                </div>
                <p className="text-xs text-gray-400 mt-2">
                    Fees & Taxes
                </p>
            </div>

            {/* Gap Percent */}
            <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <p className="text-xs font-medium text-gray-500 tracking-wide mb-1">
                    Revenue Lost
                </p>
                <div className="text-2xl lg:text-3xl font-bold text-amber-500 tracking-tight font-mono tabular-nums">
                    {formatPercent(gapPercent)}
                </div>
                <p className="text-xs text-gray-400 mt-2">
                    of reported MRR
                </p>
            </div>
        </div>
    );
};

export default GapSummary;
