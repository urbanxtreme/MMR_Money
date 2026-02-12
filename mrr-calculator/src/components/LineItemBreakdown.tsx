import type { CalculationResult, PaymentProcessor } from '../utils/calculateMRRGap';
import {
    formatCurrency,
    formatPercent,
    getProcessorDisplayName
} from '../utils/calculateMRRGap';

interface LineItemBreakdownProps {
    result: CalculationResult;
    processor: PaymentProcessor;
}

interface LineItem {
    name: string;
    amount: number;
    percentage: number;
    icon: string;
    color: string;
    bgColor: string;
    description: string;
    category: 'fee' | 'loss' | 'hold' | 'tax';
}

export const LineItemBreakdown = ({
    result,
    processor
}: LineItemBreakdownProps) => {
    const { mrr, deductions } = result;

    // Define all line items with their styling
    const lineItems: LineItem[] = [
        {
            name: `${getProcessorDisplayName(processor)} Fees`,
            amount: deductions.processorFees,
            percentage: mrr > 0 ? (deductions.processorFees / mrr) * 100 : 0,
            icon: '💳',
            color: 'text-rose-600',
            bgColor: 'bg-rose-50',
            description: 'Transaction processing fees charged per sale',
            category: 'fee'
        },
        {
            name: 'Refunds',
            amount: deductions.refunds,
            percentage: mrr > 0 ? (deductions.refunds / mrr) * 100 : 0,
            icon: '↩️',
            color: 'text-rose-600',
            bgColor: 'bg-rose-50',
            description: 'Money returned to customers who cancelled',
            category: 'loss'
        },
        {
            name: 'Chargebacks',
            amount: deductions.chargebacks,
            percentage: mrr > 0 ? (deductions.chargebacks / mrr) * 100 : 0,
            icon: '⚠️',
            color: 'text-rose-600',
            bgColor: 'bg-rose-50',
            description: 'Disputed transactions reversed by the bank',
            category: 'loss'
        },
        {
            name: 'Rolling Reserve',
            amount: deductions.rollingReserve,
            percentage: mrr > 0 ? (deductions.rollingReserve / mrr) * 100 : 0,
            icon: '⏳',
            color: 'text-orange-600',
            bgColor: 'bg-orange-50',
            description: '10% held for 90 days',
            category: 'hold'
        },
        {
            name: 'VAT Collected (EU/UK)',
            amount: deductions.vatCollected,
            percentage: mrr > 0 ? (deductions.vatCollected / mrr) * 100 : 0,
            icon: '🇪🇺',
            color: 'text-gray-600',
            bgColor: 'bg-gray-50',
            description: '20% VAT on EU/UK sales — never your revenue',
            category: 'tax'
        },
        {
            name: 'US Sales Tax',
            amount: deductions.usSalesTax,
            percentage: mrr > 0 ? (deductions.usSalesTax / mrr) * 100 : 0,
            icon: '🇺🇸',
            color: 'text-gray-600',
            bgColor: 'bg-gray-50',
            description: 'Average 8% sales tax on US transactions',
            category: 'tax'
        }
    ];

    // Filter to only show items with values
    const activeItems = lineItems.filter(item => item.amount > 0);

    return (
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            {/* Header */}
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Detailed Breakdown
            </h3>

            {/* Legend */}
            <div className="flex flex-wrap gap-4 mb-4 pb-4 border-b border-gray-100">
                <span className="text-xs text-rose-600 flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-rose-500 rounded-full" />
                    Fees & Losses
                </span>
                <span className="text-xs text-orange-600 flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-orange-500 rounded-full" />
                    Temporary Hold
                </span>
                <span className="text-xs text-gray-600 flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-gray-400 rounded-full" />
                    Taxes (Not Yours)
                </span>
            </div>

            {/* Line Items */}
            <div className="space-y-3">
                {activeItems.map((item) => (
                    <div
                        key={item.name}
                        className={`${item.bgColor} rounded-lg p-4 transition-all hover:shadow-sm`}
                    >
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex items-start gap-3 flex-1">
                                <span className="text-xl">{item.icon}</span>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <span className="font-medium text-gray-900">{item.name}</span>
                                        {item.category === 'tax' && (
                                            <span className="text-xs px-2 py-0.5 bg-gray-200 rounded-full text-gray-600">
                                                Not your revenue
                                            </span>
                                        )}
                                        {item.category === 'hold' && (
                                            <span className="text-xs px-2 py-0.5 bg-orange-200 rounded-full text-orange-700">
                                                Temporary
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">{item.description}</p>
                                </div>
                            </div>
                            <div className="text-right shrink-0">
                                <p className={`text-sm font-bold ${item.color}`}>
                                    -{formatCurrency(item.amount)}
                                </p>
                                <p className="text-xs text-gray-400">
                                    {formatPercent(item.percentage)}
                                </p>
                            </div>
                        </div>

                        {/* Progress bar */}
                        <div className="mt-3 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                            <div
                                className={`h-full rounded-full transition-all duration-500 ${item.category === 'fee' || item.category === 'loss' ? 'bg-rose-400' :
                                    item.category === 'hold' ? 'bg-orange-400' : 'bg-gray-400'
                                    }`}
                                style={{ width: `${Math.min(item.percentage * 3, 100)}%` }}
                            />
                        </div>
                    </div>
                ))}

                {activeItems.length === 0 && (
                    <div className="text-center py-8 text-gray-400">
                        Enter MRR and select a processor to see breakdown
                    </div>
                )}
            </div>

            {/* Totals */}
            <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                    <span className="text-gray-600">Total Deductions</span>
                    <span className="text-xl font-bold text-rose-600">
                        -{formatCurrency(result.totalGap)}
                    </span>
                </div>
                <div className="flex items-center justify-between mt-2">
                    <span className="text-gray-600">Net to Bank</span>
                    <span className="text-xl font-bold text-emerald-600">
                        {formatCurrency(result.netToBank)}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default LineItemBreakdown;
