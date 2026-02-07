import { useState, useMemo } from 'react';
import { MRRCalculatorForm } from '../components/MRRCalculatorForm';
import { GapSummary } from '../components/GapSummary';
import { WaterfallChart } from '../components/WaterfallChart';
import { LineItemBreakdown } from '../components/LineItemBreakdown';
import { EducationalCallout } from '../components/EducationalCallout';
import type { PaymentProcessor, CalculatorInputs, CalculationResult } from '../utils/calculateMRRGap';
import { calculateMRRGap } from '../utils/calculateMRRGap';

export const MRRBankCalculator = () => {
    const [mrr, setMrr] = useState<number | ''>('');
    const [processor, setProcessor] = useState<PaymentProcessor | ''>('');
    const [refundRate, setRefundRate] = useState<number>(2);
    const [chargebackRate, setChargebackRate] = useState<number>(0.5);
    const [euUkSalesPercent, setEuUkSalesPercent] = useState<number>(30);
    const [usSalesPercent, setUsSalesPercent] = useState<number>(50);
    const [isNewStripeAccount, setIsNewStripeAccount] = useState<boolean>(false);

    // Calculate results using memoization for performance
    const calculationResult: CalculationResult = useMemo(() => {
        if (mrr === '' || processor === '') {
            return {
                mrr: 0,
                deductions: {
                    processorFees: 0,
                    refunds: 0,
                    chargebacks: 0,
                    rollingReserve: 0,
                    vatCollected: 0,
                    usSalesTax: 0
                },
                netToBank: 0,
                totalGap: 0,
                gapPercent: 0
            };
        }

        const inputs: CalculatorInputs = {
            mrr: mrr as number,
            processor: processor as PaymentProcessor,
            refundRate,
            chargebackRate,
            euUkSalesPercent,
            usSalesPercent,
            isNewStripeAccount
        };
        return calculateMRRGap(inputs);
    }, [mrr, processor, refundRate, chargebackRate, euUkSalesPercent, usSalesPercent, isNewStripeAccount]);

    return (
        <div className="min-h-screen bg-white">
            {/* Minimal Header */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="h-14 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h1 className="font-semibold text-gray-900 text-lg">MRR vs Bank Calculator</h1>
                    </div>
                </div>
            </header>

            {/* Main Content Area */}
            <div className="flex flex-col lg:flex-row">
                {/* Left Sidebar - Fixed on Desktop */}
                <aside className="w-full lg:w-[380px] lg:flex-shrink-0 bg-gray-50 border-b lg:border-b-0 lg:border-r border-gray-200">
                    <div className="lg:sticky lg:top-14 lg:w-[380px] lg:h-[calc(100vh-56px)] lg:overflow-y-auto p-4 lg:p-6">
                        <MRRCalculatorForm
                            mrr={mrr}
                            setMrr={setMrr}
                            processor={processor}
                            setProcessor={setProcessor}
                            refundRate={refundRate}
                            setRefundRate={setRefundRate}
                            chargebackRate={chargebackRate}
                            setChargebackRate={setChargebackRate}
                            euUkSalesPercent={euUkSalesPercent}
                            setEuUkSalesPercent={setEuUkSalesPercent}
                            usSalesPercent={usSalesPercent}
                            setUsSalesPercent={setUsSalesPercent}
                            isNewStripeAccount={isNewStripeAccount}
                            setIsNewStripeAccount={setIsNewStripeAccount}
                        />
                    </div>
                </aside>

                {/* Right Content - Scrollable */}
                <main className="flex-1 min-w-0">
                    <div className="w-full p-4 lg:p-8 space-y-6">
                        {/* Gap Summary Cards */}
                        <GapSummary result={calculationResult} />

                        {/* Waterfall Chart */}
                        <WaterfallChart result={calculationResult} />

                        {/* Line Item Breakdown */}
                        <LineItemBreakdown
                            result={calculationResult}
                            processor={processor || 'stripe'}
                        />

                        {/* Educational Content */}
                        <EducationalCallout />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default MRRBankCalculator;
