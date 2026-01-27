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
        <div className="min-h-screen bg-[#0B1120] text-slate-300 font-sans selection:bg-indigo-500/30">
            {/* Top Navigation Bar */}
            <nav className="border-b border-slate-800 bg-[#0B1120]/80 backdrop-blur sticky top-0 z-50">
                <div className="max-w-[1600px] mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <span className="font-bold text-white text-lg tracking-tight">MRR vs Recieved Calculator</span>
                    </div>
                </div>
            </nav>

            <main className="max-w-[1600px] mx-auto p-6 lg:p-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Left Sidebar - Configuration */}
                    <aside className="lg:w-[400px] shrink-0 space-y-6">
                        <div className="lg:sticky lg:top-24">
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

                    {/* Right Content - Dashboard */}
                    <div className="flex-1 min-w-0 space-y-6">
                        <GapSummary result={calculationResult} />

                        <div className="space-y-6">
                            <WaterfallChart result={calculationResult} />

                            <LineItemBreakdown
                                result={calculationResult}
                                processor={processor || 'stripe'}
                            />
                        </div>

                        <EducationalCallout />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default MRRBankCalculator;
