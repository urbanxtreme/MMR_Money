import { useState, useMemo, useEffect } from 'react';
import { MRRCalculatorForm } from '../components/MRRCalculatorForm';
import { GapSummary } from '../components/GapSummary';
import { WaterfallChart } from '../components/WaterfallChart';
import { LineItemBreakdown } from '../components/LineItemBreakdown';
import { EducationalCallout } from '../components/EducationalCallout';
import type { PaymentProcessor, CalculatorInputs, CalculationResult } from '../utils/calculateMRRGap';
import { calculateMRRGap } from '../utils/calculateMRRGap';

export const MRRBankCalculator = () => {
    const [mrr, setMrr] = useState<number | ''>(10000);
    const [processor, setProcessor] = useState<PaymentProcessor | ''>('stripe');
    const [refundRate, setRefundRate] = useState<number>(2);
    const [chargebackRate, setChargebackRate] = useState<number>(0.5);
    const [euUkSalesPercent, setEuUkSalesPercent] = useState<number>(30);
    const [usSalesPercent, setUsSalesPercent] = useState<number>(50);
    const [isNewStripeAccount, setIsNewStripeAccount] = useState<boolean>(false);

    // Track page view
    useEffect(() => {
        // @ts-ignore
        window.dataLayer = window.dataLayer || [];
        // @ts-ignore
        window.dataLayer.push({
            event: 'mrr_calculator_viewed',
            timestamp: new Date().toISOString()
        });
    }, []);

    // Track interaction (could be debounced, but simple implementation for now)
    const trackInteraction = () => {
        // @ts-ignore
        window.dataLayer?.push({ event: 'mrr_calculator_interacted' });
    };

    // Track when calculation is "complete" (all valid)
    useEffect(() => {
        if (mrr && processor) {
            const timeout = setTimeout(() => {
                // @ts-ignore
                window.dataLayer?.push({
                    event: 'mrr_calculator_completed',
                    mrr_amount: mrr,
                    processor: processor
                });
            }, 2000); // 2s debounce to capture "final" state
            return () => clearTimeout(timeout);
        }
    }, [mrr, processor]);

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

    const handleCtaClick = () => {
        // @ts-ignore
        window.dataLayer?.push({ event: 'mrr_cta_clicked' });
    };

    return (
        <div className="min-h-screen bg-white" onChange={trackInteraction}>
            {/* Minimal Header */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
                <div className="w-full px-4 lg:px-6">
                    <div className="h-14 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>

                        <h1 className="font-semibold text-gray-900 text-lg">MRR vs Bank Calculator</h1>

                        <div className="ml-auto">
                            <a
                                href="/signup?utm_source=calculator&utm_medium=tool&utm_campaign=mrr_gap"
                                onClick={handleCtaClick}
                                className="text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded-lg transition-colors"
                            >
                                Get Started
                            </a>
                        </div>
                    </div>

                </div>
            </header>

            {/* Main Content Area */}
            <div className="flex flex-col lg:flex-row max-w-7xl mx-auto w-full">
                {/* Left Sidebar - Fixed on Desktop */}
                <aside className="w-full lg:w-[380px] lg:flex-shrink-0 bg-gray-50 border-b lg:border-b-0 lg:border-r border-gray-200">
                    <div className="lg:sticky lg:top-14 lg:w-[380px] lg:h-[calc(100vh-56px)] overflow-y-auto p-4 lg:p-6 no-scrollbar">
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

                        {/* Bottom CTA */}
                        <div className="bg-emerald-50 rounded-xl p-8 text-center border border-emerald-100">
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Stop losing revenue to hidden fees</h2>
                            <p className="text-gray-600 mb-6 max-w-lg mx-auto">
                                Optimize your payment stack and keep more of what you earn.
                            </p>
                            <a
                                href="/signup?utm_source=calculator&utm_medium=tool&utm_campaign=mrr_gap"
                                onClick={handleCtaClick}
                                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 md:text-lg transition-colors"
                            >
                                Start Optimizing Now
                            </a>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default MRRBankCalculator;
