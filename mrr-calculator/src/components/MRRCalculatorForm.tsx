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
        <div className="space-y-3">
            {/* Header */}
            <div>
                <h2 className="text-base font-semibold text-gray-900">Configuration</h2>
                <p className="text-xs text-gray-500">Enter your revenue details</p>
            </div>

            {/* MRR Input */}
            <div>
                <label
                    htmlFor="mrr-input"
                    className="block text-xs font-medium text-gray-700 mb-1"
                >
                    Monthly Recurring Revenue
                </label>
                <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-base">
                        $
                    </span>
                    <input
                        id="mrr-input"
                        type="number"
                        min={0}
                        max={10000000}
                        placeholder="10,000"
                        value={mrr}
                        onChange={handleMrrChange}
                        className="w-full bg-white border border-gray-300 rounded-lg py-2 pl-8 pr-4 text-gray-900 text-base font-medium focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all outline-none placeholder-gray-400"
                        aria-label="Monthly Recurring Revenue in USD"
                    />
                </div>
            </div>

            {/* Payment Processor */}
            <div>
                <label
                    htmlFor="processor-select"
                    className="block text-xs font-medium text-gray-700 mb-1"
                >
                    Payment Processor
                </label>
                <select
                    id="processor-select"
                    value={processor}
                    onChange={(e) => setProcessor(e.target.value as PaymentProcessor)}
                    className={`w-full bg-white border border-gray-300 rounded-lg py-2 px-3 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all outline-none cursor-pointer ${processor === '' ? 'text-gray-400' : 'text-gray-900'}`}
                >
                    <option value="" disabled className="text-gray-400">Select processor...</option>
                    {PROCESSORS.map((p) => (
                        <option key={p} value={p} className="text-gray-900">
                            {getProcessorDisplayName(p)}
                        </option>
                    ))}
                </select>
                {processor && (
                    <p className="text-[10px] text-gray-500 mt-1 flex items-center gap-1">
                        <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {getProcessorFeeDescription(processor)}
                    </p>
                )}
            </div>

            {/* Divider */}
            <div className="border-t border-gray-200 my-2" />

            {/* Refund Rate Slider */}
            <div>
                <label
                    htmlFor="refund-slider"
                    className="flex justify-between text-xs font-medium text-gray-700 mb-1.5"
                >
                    <span>Refund Rate</span>
                    <span className="text-emerald-600 font-semibold">{refundRate}%</span>
                </label>
                <input
                    id="refund-slider"
                    type="range"
                    min={0}
                    max={10}
                    step={0.5}
                    value={refundRate}
                    onChange={(e) => setRefundRate(parseFloat(e.target.value))}
                    className="w-full h-1.5"
                />
            </div>

            {/* Chargeback Rate Slider */}
            <div>
                <label
                    htmlFor="chargeback-slider"
                    className="flex justify-between text-xs font-medium text-gray-700 mb-1.5"
                >
                    <span>Chargeback Rate</span>
                    <span className="text-orange-600 font-semibold">{chargebackRate}%</span>
                </label>
                <input
                    id="chargeback-slider"
                    type="range"
                    min={0}
                    max={5}
                    step={0.1}
                    value={chargebackRate}
                    onChange={(e) => setChargebackRate(parseFloat(e.target.value))}
                    className="w-full h-1.5"
                />
            </div>

            {/* EU/UK Sales Slider */}
            <div>
                <label
                    htmlFor="eu-slider"
                    className="flex justify-between text-xs font-medium text-gray-700 mb-1.5"
                >
                    <span>Sales in EU/UK</span>
                    <span className="text-blue-600 font-semibold">{euUkSalesPercent}%</span>
                </label>
                <input
                    id="eu-slider"
                    type="range"
                    min={0}
                    max={100}
                    step={5}
                    value={euUkSalesPercent}
                    onChange={(e) => setEuUkSalesPercent(parseInt(e.target.value))}
                    className="w-full h-1.5"
                />
            </div>

            {/* US Sales Slider */}
            <div>
                <label
                    htmlFor="us-slider"
                    className="flex justify-between text-xs font-medium text-gray-700 mb-1.5"
                >
                    <span>Sales in US</span>
                    <span className="text-purple-600 font-semibold">{usSalesPercent}%</span>
                </label>
                <input
                    id="us-slider"
                    type="range"
                    min={0}
                    max={100}
                    step={5}
                    value={usSalesPercent}
                    onChange={(e) => setUsSalesPercent(parseInt(e.target.value))}
                    className="w-full h-1.5"
                />
            </div>

            {/* New Stripe Account Toggle */}
            <div className={`p-3 rounded-xl border transition-all ${processor === 'stripe'
                ? 'bg-white border-gray-200 shadow-sm'
                : 'bg-gray-100 border-gray-100 opacity-60'
                }`}>
                <label
                    htmlFor="new-stripe-toggle"
                    className="flex items-center justify-between cursor-pointer"
                >
                    <div className="flex items-center gap-2">
                        <span className="text-base">🆕</span>
                        <div>
                            <span className="text-xs font-medium text-gray-800 block">
                                New Stripe Account
                            </span>
                            <span className="text-[10px] text-gray-500">
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
                        <div className={`w-9 h-5 rounded-full transition-all ${isNewStripeAccount && processor === 'stripe'
                            ? 'bg-emerald-500'
                            : 'bg-gray-300'
                            }`}>
                            <div className={`w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform absolute top-0.5 ${isNewStripeAccount && processor === 'stripe'
                                ? 'translate-x-4'
                                : 'translate-x-0.5'
                                }`} />
                        </div>
                    </div>
                </label>
            </div>
        </div>
    );
};

export default MRRCalculatorForm;
