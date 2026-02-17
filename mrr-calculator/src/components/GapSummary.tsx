import type { CalculationResult } from '../utils/calculateMRRGap';
import { formatCurrency } from '../utils/calculateMRRGap';

interface GapSummaryProps {
    result: CalculationResult;
}

export const GapSummary = ({ result }: GapSummaryProps) => {
    const { mrr, netToBank, deductions } = result;

    // Calculate Taxes separately
    const taxAmount = deductions.vatCollected + deductions.usSalesTax;

    // Calculate Operational Deductions (Fees + Holds)
    // We can subtract tax form totalGap OR sum the specifics. Summing is clearer.
    const operationalDeductions =
        deductions.processorFees +
        deductions.refunds +
        deductions.chargebacks +
        deductions.rollingReserve;

    console.log('[DEBUG] GapSummary values:', { mrr, netToBank, taxAmount, operationalDeductions });

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {/* 1. Reported MRR */}
            <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <p className="text-xs font-medium text-gray-500 tracking-wide mb-1">
                    Starting MRR
                </p>
                <div className="text-2xl lg:text-3xl font-bold text-gray-900 tracking-tight font-mono tabular-nums">
                    {formatCurrency(mrr)}
                </div>
                <p className="text-xs text-gray-400 mt-2">
                    Gross revenue
                </p>
            </div>

            {/* 2. Deductions (Fees + Holds) */}
            <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <p className="text-xs font-medium text-gray-500 tracking-wide mb-1">
                    Deductions
                </p>
                <div className="text-2xl lg:text-3xl font-bold text-rose-500 tracking-tight font-mono tabular-nums">
                    {formatCurrency(operationalDeductions)}
                </div>
                <p className="text-xs text-gray-400 mt-2">
                    Fees, Refunds & Holds
                </p>
            </div>

            {/* 3. Taxes Collected */}
            <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <p className="text-xs font-medium text-gray-500 tracking-wide mb-1">
                    Taxes Collected
                </p>
                <div className="text-2xl lg:text-3xl font-bold text-gray-500 tracking-tight font-mono tabular-nums">
                    {formatCurrency(taxAmount)}
                </div>
                <p className="text-xs text-gray-400 mt-2">
                    VAT & Sales Tax
                </p>
            </div>

            {/* 4. Net to Bank */}
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
        </div>
    );
};

export default GapSummary;
