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

    const lineItems: LineItem[] = [
        {
            name: `${getProcessorDisplayName(processor)} Fees`,
            amount: deductions.processorFees,
            percentage: mrr > 0 ? (deductions.processorFees / mrr) * 100 : 0,
            icon: '💳',
            color: 'text-rose-400',
            bgColor: 'bg-rose-500/10',
            description: 'Transaction processing fees charged per sale',
            category: 'fee'
        },
        {
            name: 'Refunds',
            amount: deductions.refunds,
            percentage: mrr > 0 ? (deductions.refunds / mrr) * 100 : 0,
            icon: '↩️',
            color: 'text-rose-400',
            bgColor: 'bg-rose-500/10',
            description: 'Money returned to customers who cancelled or were unsatisfied',
            category: 'loss'
        },
        {
            name: 'Chargebacks',
            amount: deductions.chargebacks,
            percentage: mrr > 0 ? (deductions.chargebacks / mrr) * 100 : 0,
            icon: '⚠️',
            color: 'text-rose-400',
            bgColor: 'bg-rose-500/10',
            description: 'Disputed transactions reversed by the bank',
            category: 'loss'
        },
        {
            name: 'Rolling Reserve',
            amount: deductions.rollingReserve,
            percentage: mrr > 0 ? (deductions.rollingReserve / mrr) * 100 : 0,
            icon: '⏳',
            color: 'text-orange-400',
            bgColor: 'bg-orange-500/10',
            description: 'Stripe holds 10% for new accounts — you\'ll get this back after 6 months',
            category: 'hold'
        },
        {
            name: 'VAT Collected (EU/UK)',
            amount: deductions.vatCollected,
            percentage: mrr > 0 ? (deductions.vatCollected / mrr) * 100 : 0,
            icon: '🇪🇺',
            color: 'text-slate-400',
            bgColor: 'bg-slate-500/10',
            description: '20% VAT collected on EU/UK sales — this was never your revenue',
            category: 'tax'
        },
        {
            name: 'US Sales Tax',
            amount: deductions.usSalesTax,
            percentage: mrr > 0 ? (deductions.usSalesTax / mrr) * 100 : 0,
            icon: '🇺🇸',
            color: 'text-slate-400',
            bgColor: 'bg-slate-500/10',
            description: 'Estimated 8% average sales tax on US transactions',
            category: 'tax'
        }
    ];

    const activeItems = lineItems.filter(item => item.amount > 0);

    return (
        <div className="bg-slate-800/40 rounded-xl p-6 border border-slate-700/50 flex flex-col">
            <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                <div className="p-1.5 bg-purple-500/10 rounded-lg">
                    <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                    </svg>
                </div>
                Detailed Breakdown
            </h3>

            <div className="flex flex-wrap gap-3 mb-4 pb-4 border-b border-slate-700/50">
                <span className="text-xs text-rose-400 flex items-center gap-1">
                    <span className="w-2 h-2 bg-rose-500 rounded-full" />
                    Fees & Losses
                </span>
                <span className="text-xs text-orange-400 flex items-center gap-1">
                    <span className="w-2 h-2 bg-orange-500 rounded-full" />
                    Temporary Hold
                </span>
                <span className="text-xs text-slate-400 flex items-center gap-1">
                    <span className="w-2 h-2 bg-slate-500 rounded-full" />
                    Taxes (Not Yours)
                </span>
            </div>

            <div className="space-y-3">
                {activeItems.map((item, index) => (
                    <div
                        key={item.name}
                        className={`${item.bgColor} rounded-xl p-4 transition-all hover:scale-[1.01] border border-transparent hover:border-white/10`}
                        style={{ animationDelay: `${index * 50}ms` }}
                    >
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex items-start gap-3 flex-1">
                                <span className="text-2xl">{item.icon}</span>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <span className="font-medium text-white">{item.name}</span>
                                        {item.category === 'tax' && (
                                            <span className="text-xs px-2 py-0.5 bg-slate-700/50 rounded-full text-slate-400 whitespace-nowrap">
                                                Not your revenue
                                            </span>
                                        )}
                                        {item.category === 'hold' && (
                                            <span className="text-xs px-2 py-0.5 bg-orange-700/50 rounded-full text-orange-300 whitespace-nowrap">
                                                Temporary
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-xs text-slate-400 mt-1 line-clamp-1">{item.description}</p>
                                </div>
                            </div>
                            <div className="text-right shrink-0">
                                <p className={`text-sm font-bold ${item.color}`}>
                                    -{formatCurrency(item.amount)}
                                </p>
                                <p className="text-xs text-slate-500">
                                    {formatPercent(item.percentage)}
                                </p>
                            </div>
                        </div>

                        <div className="mt-3 h-1 bg-slate-700/50 rounded-full overflow-hidden">
                            <div
                                className={`h-full rounded-full transition-all duration-500 ${item.category === 'fee' || item.category === 'loss' ? 'bg-rose-500' :
                                    item.category === 'hold' ? 'bg-orange-500' : 'bg-slate-500'
                                    }`}
                                style={{ width: `${Math.min(item.percentage * 3, 100)}%` }}
                            />
                        </div>
                    </div>
                ))}

                {activeItems.length === 0 && (
                    <div className="text-center py-8 text-slate-500">
                        No deductions to display with current settings
                    </div>
                )}
            </div>

            <div className="mt-6 pt-4 border-t border-slate-700/50">
                <div className="flex items-center justify-between">
                    <span className="text-slate-400">Total Deductions</span>
                    <span className="text-xl font-bold text-rose-400">
                        -{formatCurrency(result.totalGap)}
                    </span>
                </div>
                <div className="flex items-center justify-between mt-2">
                    <span className="text-slate-400">Net to Bank</span>
                    <span className="text-xl font-bold text-emerald-400">
                        {formatCurrency(result.netToBank)}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default LineItemBreakdown;
