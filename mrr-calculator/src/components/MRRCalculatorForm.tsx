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

    const handleMrrChange = (e: ChangeEvent<HTMLInputElement>) => {
        // Remove non-numeric chars except dot
        const value = e.target.value.replace(/[^0-9.]/g, '');

        if (value === '') {
            setMrr('');
            return;
        }

        // Handle multiple dots
        const parts = value.split('.');
        if (parts.length > 2) return;

        setMrr(parseFloat(value));
    };

    const handleBlur = () => {
        if (mrr === '') return;

        // Clamp between 500 and 500,000
        let newVal = mrr;
        if (newVal < 500) newVal = 500;
        if (newVal > 500000) newVal = 500000;

        setMrr(newVal);
    };

    const getSliderBackground = (value: number, max: number, color: string) => {
        const percentage = (value / max) * 100;
        return {
            backgroundSize: `${percentage}% 100%`,
            backgroundImage: `linear-gradient(${color}, ${color})`,
            backgroundRepeat: 'no-repeat',
            backgroundColor: '#f1f5f9'
        };
    };



    return (
        <div className="space-y-2.5 font-sans text-gray-900">
            {/* Header */}
            <div className="flex items-center justify-between py-1">
                <div>
                    <h2 className="text-lg font-bold tracking-tight text-gray-900">
                        Configuration
                    </h2>
                    <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">
                        Revenue Parameters
                    </p>
                </div>
            </div>

            {/* Hero Input & Processor Group */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden ring-1 ring-gray-900/5 hover:ring-gray-900/10 focus-within:ring-2 focus-within:ring-emerald-500/20 transition-all duration-300">
                {/* Modern MRR Input */}
                <div className="px-3 pt-3 pb-2 bg-gradient-to-b from-white to-gray-50/50">
                    <div className="flex justify-between items-center mb-0.5">
                        <label htmlFor="mrr-input" className="block text-[9px] uppercase font-bold text-gray-400 tracking-widest">
                            Monthly Revenue
                        </label>
                        {mrr === '' && (
                            <span className="text-[9px] font-bold text-rose-500 animate-pulse">
                                Required
                            </span>
                        )}
                    </div>
                    <div className="relative group flex items-baseline gap-0.5">
                        <span className="text-2xl text-gray-300 font-light group-focus-within:text-emerald-500 transition-colors duration-300">$</span>
                        <input
                            id="mrr-input"
                            type="text"
                            inputMode="decimal"
                            placeholder="10,000"
                            value={mrr === '' ? '' : mrr.toLocaleString('en-US', { maximumFractionDigits: 2 })}
                            onChange={handleMrrChange}
                            onBlur={handleBlur}
                            className="w-full bg-transparent border-none p-0 text-3xl font-extrabold text-gray-900 placeholder-gray-200 focus:ring-0 focus:shadow-none transition-all outline-none tabular-nums tracking-tight"
                        />
                    </div>
                </div>

                {/* Processor Selector */}
                <div className="px-3 py-2 border-t border-gray-100 bg-gray-50/30">
                    <div className="relative">
                        <select
                            value={processor}
                            onChange={(e) => setProcessor(e.target.value as PaymentProcessor)}
                            className="w-full appearance-none bg-white border-0 py-2 pl-3 pr-8 rounded-lg text-xs font-semibold text-gray-700 shadow-sm ring-1 ring-gray-200 hover:ring-gray-300 focus:ring-2 focus:ring-emerald-500/20 transition-all cursor-pointer"
                        >
                            <option value="" disabled>Select Payment Processor...</option>
                            {PROCESSORS.map((p) => (
                                <option key={p} value={p}>{getProcessorDisplayName(p)}</option>
                            ))}
                        </select>
                        <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                            <svg className="w-3.5 h-3.5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </div>
                    </div>
                    {processor && (
                        <div className="mt-1.5 flex items-center gap-1.5 text-[9px] font-medium text-blue-600 bg-blue-50/80 px-2 py-0.5 rounded-md w-fit">
                            <span className="w-1 h-1 rounded-full bg-blue-500"></span>
                            {getProcessorFeeDescription(processor)}
                        </div>
                    )}
                </div>
            </div>

            {/* Controls Container */}
            <div className="space-y-2">

                {/* Risk Factor Group */}
                <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
                    <div className="space-y-2">
                        {/* Refund Slider */}
                        <div>
                            <div className="flex justify-between items-center mb-1">
                                <label className="text-[10px] font-bold text-gray-600 uppercase tracking-wide">Refunds</label>
                                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100 tabular-nums shadow-sm">{refundRate}%</span>
                            </div>
                            <input
                                type="range"
                                min={0} max={10} step={0.5}
                                value={refundRate}
                                onChange={(e) => setRefundRate(parseFloat(e.target.value))}
                                className="mrr-range"
                                style={getSliderBackground(refundRate, 10, '#2563eb')}
                            />
                        </div>

                        {/* Chargeback Slider */}
                        <div>
                            <div className="flex justify-between items-center mb-1">
                                <label className="text-[10px] font-bold text-gray-600 uppercase tracking-wide">Chargebacks</label>
                                <span className="text-[10px] font-bold text-orange-600 bg-orange-50 px-1.5 py-0.5 rounded border border-orange-100 tabular-nums shadow-sm">{chargebackRate}%</span>
                            </div>
                            <input
                                type="range"
                                min={0} max={5} step={0.1}
                                value={chargebackRate}
                                onChange={(e) => setChargebackRate(parseFloat(e.target.value))}
                                className="mrr-range"
                                style={getSliderBackground(chargebackRate, 5, '#2563eb')}
                            />
                        </div>
                    </div>
                </div>

                {/* Geography Group */}
                <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
                    <div className="space-y-2">
                        {/* EU Slider */}
                        <div>
                            <div className="flex justify-between items-center mb-1">
                                <label className="text-[10px] font-bold text-gray-600 uppercase tracking-wide">EU/UK Sales</label>
                                <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100 tabular-nums shadow-sm">{euUkSalesPercent}%</span>
                            </div>
                            <input
                                type="range"
                                min={0} max={100} step={5}
                                value={euUkSalesPercent}
                                onChange={(e) => setEuUkSalesPercent(parseInt(e.target.value))}
                                className="mrr-range"
                                style={getSliderBackground(euUkSalesPercent, 100, '#2563eb')}
                            />
                        </div>

                        {/* US Slider */}
                        <div>
                            <div className="flex justify-between items-center mb-1">
                                <label className="text-[10px] font-bold text-gray-600 uppercase tracking-wide">US Sales</label>
                                <span className="text-[10px] font-bold text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded border border-purple-100 tabular-nums shadow-sm">{usSalesPercent}%</span>
                            </div>
                            <input
                                type="range"
                                min={0} max={100} step={5}
                                value={usSalesPercent}
                                onChange={(e) => setUsSalesPercent(parseInt(e.target.value))}
                                className="mrr-range"
                                style={getSliderBackground(usSalesPercent, 100, '#2563eb')}
                            />
                        </div>
                    </div>
                </div>

            </div>

            {/* Modern Stripe Toggle */}
            <div className={`relative overflow-hidden rounded-xl border transition-all duration-300 group ${processor === 'stripe' ? 'border-emerald-200 bg-emerald-50/50' : 'border-gray-100 bg-gray-50 opacity-60'}`}>
                <label className="flex items-center justify-between p-3 cursor-pointer z-10 relative">
                    <div className="flex items-center gap-2.5">
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs shadow-sm transition-colors ${processor === 'stripe' ? 'bg-white text-emerald-600' : 'bg-gray-200 text-gray-400'}`}>
                            🚀
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[11px] font-bold text-gray-900">New Stripe Account</span>
                            <span className="text-[9px] font-medium text-gray-500">10% Rolling Reserve</span>
                        </div>
                    </div>
                    {/* Custom IOS Switch */}
                    <div className="relative">
                        <input
                            type="checkbox"
                            checked={isNewStripeAccount}
                            onChange={(e) => setIsNewStripeAccount(e.target.checked)}
                            disabled={processor !== 'stripe'}
                            className="sr-only"
                        />
                        <div className={`w-8 h-4.5 rounded-full transition-colors duration-300 ${isNewStripeAccount && processor === 'stripe' ? 'bg-emerald-500 shadow-inner' : 'bg-gray-300'}`}></div>
                        <div className={`absolute left-0.5 top-0.5 bg-white w-3.5 h-3.5 rounded-full shadow-sm transition-transform duration-300 ${isNewStripeAccount && processor === 'stripe' ? 'translate-x-3.5' : 'translate-x-0'}`}></div>
                    </div>
                </label>
                {/* Background glow decoration */}
                {processor === 'stripe' && isNewStripeAccount && (
                    <div className="absolute top-0 right-0 -mt-4 -mr-4 w-20 h-20 bg-emerald-400/10 rounded-full blur-2xl pointer-events-none"></div>
                )}
            </div>

        </div>
    );
};

export default MRRCalculatorForm;
