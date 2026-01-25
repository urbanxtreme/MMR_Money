/**
 * Waterfall Chart Component
 * 
 * Displays a vertical waterfall chart using Recharts showing the breakdown
 * of MRR to net bank deposit. Color coded by category:
 * - Green: Your money (MRR, Net to Bank)
 * - Red: Fees and losses (Processor fees, Refunds, Chargebacks)
 * - Orange: Temporary holds (Rolling Reserve)
 * - Gray striped: Taxes (VAT, US Sales Tax)
 */

import { useMemo } from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    Cell,
    ReferenceLine
} from 'recharts';
import type { CalculationResult } from '../utils/calculateMRRGap';
import { formatCurrency } from '../utils/calculateMRRGap';

interface WaterfallChartProps {
    result: CalculationResult;
}

// Chart item structure
interface ChartItem {
    name: string;
    value: number;
    fill: string;
    isPositive: boolean;
    tooltip: string;
    category: 'revenue' | 'fee' | 'hold' | 'tax';
    // For waterfall effect
    start: number;
    end: number;
}

// Color definitions
const COLORS = {
    revenue: '#10b981', // Emerald/Green - your money
    fee: '#ef4444',     // Red - fees/losses
    hold: '#f97316',    // Orange - temporary holds
    tax: '#6b7280',     // Gray - taxes
};

// Tooltip descriptions for education
const TOOLTIP_DESCRIPTIONS: Record<string, string> = {
    'MRR': 'Your total reported Monthly Recurring Revenue before any deductions.',
    'Processor Fees': 'Fees charged by your payment processor for handling transactions.',
    'Refunds': 'Money returned to customers who requested refunds.',
    'Chargebacks': 'Disputed transactions where the bank reversed the payment.',
    'Rolling Reserve': 'Stripe holds 10% of new accounts\' revenue for 6 months as protection.',
    'VAT Collected': 'Value Added Tax collected on EU/UK sales - this was never your money.',
    'US Sales Tax': 'Sales tax collected on US transactions - this was never your money.',
    'Net to Bank': 'The actual amount that will be deposited into your bank account.',
};

export const WaterfallChart = ({ result }: WaterfallChartProps) => {
    const { mrr, deductions, netToBank } = result;

    // Build waterfall chart data with cumulative positions
    const chartData = useMemo(() => {
        const items: ChartItem[] = [];
        let runningTotal = mrr;

        // Starting MRR
        items.push({
            name: 'MRR',
            value: mrr,
            fill: COLORS.revenue,
            isPositive: true,
            tooltip: TOOLTIP_DESCRIPTIONS['MRR'],
            category: 'revenue',
            start: 0,
            end: mrr
        });

        // Helper to add deduction items
        const addDeduction = (
            name: string,
            value: number,
            category: 'fee' | 'hold' | 'tax'
        ) => {
            if (value > 0) {
                const newTotal = runningTotal - value;
                items.push({
                    name,
                    value: value,
                    fill: COLORS[category],
                    isPositive: false,
                    tooltip: TOOLTIP_DESCRIPTIONS[name],
                    category,
                    start: newTotal,
                    end: runningTotal
                });
                runningTotal = newTotal;
            }
        };

        // Add all deductions
        addDeduction('Processor Fees', deductions.processorFees, 'fee');
        addDeduction('Refunds', deductions.refunds, 'fee');
        addDeduction('Chargebacks', deductions.chargebacks, 'fee');
        addDeduction('Rolling Reserve', deductions.rollingReserve, 'hold');
        addDeduction('VAT Collected', deductions.vatCollected, 'tax');
        addDeduction('US Sales Tax', deductions.usSalesTax, 'tax');

        // Net to Bank (final)
        items.push({
            name: 'Net to Bank',
            value: netToBank,
            fill: COLORS.revenue,
            isPositive: true,
            tooltip: TOOLTIP_DESCRIPTIONS['Net to Bank'],
            category: 'revenue',
            start: 0,
            end: netToBank
        });

        return items;
    }, [mrr, deductions, netToBank]);

    // Custom tooltip component
    const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ payload: ChartItem }> }) => {
        if (!active || !payload || !payload.length) return null;

        const data = payload[0].payload;
        const categoryLabels: Record<string, string> = {
            revenue: '💰 Your Money',
            fee: '💸 Fee/Loss',
            hold: '⏳ Temporary Hold',
            tax: '🏛️ Tax (Not Yours)'
        };

        return (
            <div className="bg-slate-900/95 backdrop-blur-xl border border-slate-700 rounded-xl p-4 shadow-2xl max-w-xs">
                <div className="flex items-center gap-2 mb-2">
                    <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: data.fill }}
                    />
                    <span className="font-semibold text-white">{data.name}</span>
                </div>
                <p className="text-2xl font-bold text-white mb-2">
                    {data.isPositive ? '' : '-'}{formatCurrency(data.value)}
                </p>
                <p className="text-sm text-slate-400 mb-2">{data.tooltip}</p>
                <span className={`inline-block text-xs px-2 py-1 rounded-full ${data.category === 'revenue' ? 'bg-emerald-500/20 text-emerald-300' :
                    data.category === 'fee' ? 'bg-rose-500/20 text-rose-300' :
                        data.category === 'hold' ? 'bg-orange-500/20 text-orange-300' :
                            'bg-slate-500/20 text-slate-300'
                    }`}>
                    {categoryLabels[data.category]}
                </span>
            </div>
        );
    };

    return (
        <div className="bg-slate-800/40 rounded-xl p-6 border border-slate-700/50 flex flex-col">
            <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                <div className="p-1.5 bg-blue-500/10 rounded-lg">
                    <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                </div>
                Where Your Money Goes
            </h3>

            {/* Legend */}
            <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-emerald-500" />
                    <span className="text-xs font-medium text-slate-400">Your Money</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-rose-500" />
                    <span className="text-xs font-medium text-slate-400">Fees/Losses</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-orange-500" />
                    <span className="text-xs font-medium text-slate-400">Hold</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-slate-500 opacity-70" />
                    <span className="text-xs font-medium text-slate-400">Taxes</span>
                </div>
            </div>

            {/* Chart */}
            <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={chartData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 100 }}
                    >
                        <XAxis
                            dataKey="name"
                            tick={{ fill: '#94a3b8', fontSize: 12, dy: 10 }}
                            axisLine={{ stroke: '#475569' }}
                            tickLine={{ stroke: '#475569' }}
                            angle={-45}
                            textAnchor="end"
                            height={100}
                            interval={0}
                        />
                        <YAxis
                            tick={{ fill: '#94a3b8', fontSize: 12 }}
                            axisLine={{ stroke: '#475569' }}
                            tickLine={{ stroke: '#475569' }}
                            tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                            domain={[0, 'dataMax']}
                        />
                        <Tooltip
                            content={<CustomTooltip />}
                            cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
                        />
                        <ReferenceLine y={0} stroke="#475569" />
                        <Bar dataKey="end" radius={[4, 4, 0, 0]}>
                            {chartData.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={entry.fill}
                                    opacity={entry.category === 'tax' ? 0.7 : 1}
                                />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Mobile tap hint */}
            <p className="text-xs text-slate-500 text-center mt-4 md:hidden">
                Tap on bars for details
            </p>
        </div>
    );
};

export default WaterfallChart;
