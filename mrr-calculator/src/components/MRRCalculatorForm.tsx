import type { ChangeEvent } from 'react';
import type { PaymentProcessor } from '../utils/calculateMRRGap';
import {
    getProcessorDisplayName,
    getProcessorFeeDescription
} from '../utils/calculateMRRGap';

interface MRRCalculatorFormProps {
    mrr: number | '';
    setMrr: (value: number | '') => void;
    processor: PaymentProcessor | '';
    setProcessor: (value: PaymentProcessor | '') => void;
    refundRate: number;
    setRefundRate: (value: number) => void;
    chargebackRate: number;
    setChargebackRate: (value: number) => void;
    euUkSalesPercent: number;
    setEuUkSalesPercent: (value: number) => void;
    usSalesPercent: number;
    setUsSalesPercent: (value: number) => void;
    isNewStripeAccount: boolean;
    setIsNewStripeAccount: (value: boolean) => void;
}

// Available payment processors
const PROCESSORS: PaymentProcessor[] = [
    'stripe',
    'paypal',
    'paddle',
    'lemon_squeezy',
    'other'
];

export const MRRCalculatorForm = ({
    mrr,
    setMrr,
    processor,
    setProcessor,
    refundRate,
    setRefundRate,
    chargebackRate,
    setChargebackRate,
    euUkSalesPercent,
    setEuUkSalesPercent,
    usSalesPercent,
    setUsSalesPercent,
    isNewStripeAccount,
    setIsNewStripeAccount
}: MRRCalculatorFormProps) => {

    // Handle MRR input change
    const handleMrrChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (value === '') {
            setMrr('');
            return;
        }

        const numValue = parseInt(value);
        if (!isNaN(numValue)) {
            setMrr(Math.min(numValue, 10000000));
        }
    };

    return (
        <div className="bg-slate-800/40 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
            <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                <div className="p-1.5 bg-emerald-500/10 rounded-lg">
                    <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                </div>
                Configuration
            </h2>

            <div className="space-y-6">
                <div>
                    <label
                        htmlFor="mrr-input"
                        className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2"
                    >
                        Monthly Recurring Revenue
                    </label>
                    <div className="relative group">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-lg font-medium group-focus-within:text-emerald-400 transition-colors">
                            $
                        </span>
                        <input
                            id="mrr-input"
                            type="number"
                            min={0}
                            max={10000000}
                            placeholder="Enter MRR..."
                            value={mrr}
                            onChange={handleMrrChange}
                            className="w-full bg-slate-900/50 border border-slate-700 rounded-lg py-3 pl-8 pr-4 text-white text-lg font-semibold focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-all outline-none placeholder-slate-600"
                            aria-label="Monthly Recurring Revenue in USD"
                        />
                    </div>
                </div>
                <div>
                    <label
                        htmlFor="processor-select"
                        className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2"
                    >
                        Payment Processor
                    </label>
                    <select
                        id="processor-select"
                        value={processor}
                        onChange={(e) => setProcessor(e.target.value as PaymentProcessor)}
                        className={`w-full bg-slate-900/50 border border-slate-700 rounded-lg py-3 px-4 text-white focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-all outline-none cursor-pointer appearance-none ${processor === '' ? 'text-slate-500' : 'text-white'}`}
                    >
                        <option value="" disabled className="text-slate-500 bg-slate-900">Select a processor...</option>
                        {PROCESSORS.map((p) => (
                            <option key={p} value={p} className="bg-slate-900 text-white">
                                {getProcessorDisplayName(p)}
                            </option>
                        ))}
                    </select>
                    <p className="text-xs text-slate-500 mt-1.5 flex items-center gap-1.5">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {processor ? getProcessorFeeDescription(processor) : 'Select a processor to see fees'}
                    </p>
                </div>

                <div className="h-px bg-slate-700/50 my-2" />
                <div>
                    <label
                        htmlFor="refund-slider"
                        className="flex justify-between text-sm font-medium text-slate-300 mb-3"
                    >
                        <span>Refund Rate</span>
                        <span className="text-emerald-400 font-mono">{refundRate}%</span>
                    </label>
                    <input
                        id="refund-slider"
                        type="range"
                        min={0}
                        max={10}
                        step={0.5}
                        value={refundRate}
                        onChange={(e) => setRefundRate(parseFloat(e.target.value))}
                        className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer slider-thumb-sm"
                    />
                </div>
                <div>
                    <label
                        htmlFor="chargeback-slider"
                        className="flex justify-between text-sm font-medium text-slate-300 mb-3"
                    >
                        <span>Chargeback Rate</span>
                        <span className="text-orange-400 font-mono">{chargebackRate}%</span>
                    </label>
                    <input
                        id="chargeback-slider"
                        type="range"
                        min={0}
                        max={5}
                        step={0.1}
                        value={chargebackRate}
                        onChange={(e) => setChargebackRate(parseFloat(e.target.value))}
                        className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer slider-thumb-sm"
                    />
                </div>
                <div>
                    <label
                        htmlFor="eu-slider"
                        className="flex justify-between text-sm font-medium text-slate-300 mb-3"
                    >
                        <span>Sales in EU/UK</span>
                        <span className="text-blue-400 font-mono">{euUkSalesPercent}%</span>
                    </label>
                    <input
                        id="eu-slider"
                        type="range"
                        min={0}
                        max={100}
                        step={5}
                        value={euUkSalesPercent}
                        onChange={(e) => setEuUkSalesPercent(parseInt(e.target.value))}
                        className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer slider-thumb-sm"
                    />
                </div>
                <div>
                    <label
                        htmlFor="us-slider"
                        className="flex justify-between text-sm font-medium text-slate-300 mb-3"
                    >
                        <span>Sales in US</span>
                        <span className="text-purple-400 font-mono">{usSalesPercent}%</span>
                    </label>
                    <input
                        id="us-slider"
                        type="range"
                        min={0}
                        max={100}
                        step={5}
                        value={usSalesPercent}
                        onChange={(e) => setUsSalesPercent(parseInt(e.target.value))}
                        className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer slider-thumb-sm"
                    />
                </div>
                <div className={`p-4 rounded-xl border transition-all ${processor === 'stripe'
                    ? 'bg-slate-900/50 border-slate-600'
                    : 'bg-slate-900/20 border-slate-800 opacity-50'
                    }`}>
                    <label
                        htmlFor="new-stripe-toggle"
                        className="flex items-center justify-between cursor-pointer"
                    >
                        <div className="flex items-center gap-3">
                            <span className="text-lg">🆕</span>
                            <div>
                                <span className="text-sm font-medium text-slate-300 block">
                                    New Stripe Account
                                </span>
                                <span className="text-xs text-slate-500">
                                    &lt; 6 months (10% reserve)
                                </span>
                            </div>
                        </div>
                        <div className="relative">
                            <input
                                id="new-stripe-toggle"
                                type="checkbox"
                                checked={isNewStripeAccount}
                                onChange={(e) => setIsNewStripeAccount(e.target.checked)}
                                disabled={processor !== 'stripe'}
                                className="sr-only"
                            />
                            <div className={`w-12 h-6 rounded-full transition-all flex items-center p-0.5 ${isNewStripeAccount && processor === 'stripe'
                                ? 'bg-emerald-500'
                                : 'bg-slate-700'
                                }`}>
                                <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${isNewStripeAccount && processor === 'stripe'
                                    ? 'translate-x-6'
                                    : 'translate-x-0'
                                    }`} />
                            </div>
                        </div>
                    </label>
                </div>
            </div>
        </div>
    );
};

export default MRRCalculatorForm;
