import { useMemo } from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    Cell
} from 'recharts';
import type { CalculationResult } from '../utils/calculateMRRGap';
import { formatCurrency } from '../utils/calculateMRRGap';

interface WaterfallChartProps {
    result: CalculationResult;
}

interface ChartItem {
    name: string;
    value: number;
    fill: string;
    isPositive: boolean;
    tooltip: string;
    category: 'revenue' | 'fee' | 'hold' | 'tax';
    start: number;
    end: number;
}

// Color palette for chart
const COLORS = {
    revenue: '#10b981', // emerald-500
    fee: '#ef4444',     // red-500
    hold: '#f97316',    // orange-500
    tax: '#9ca3af',     // gray-400
};

// Tooltip descriptions for each item
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

    // Build chart data with waterfall effect
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

        // Final net amount
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
            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-lg max-w-xs">
                <div className="flex items-center gap-2 mb-2">
                    <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: data.fill }}
                    />
                    <span className="font-semibold text-gray-900">{data.name}</span>
                </div>
                <p className="text-2xl font-bold text-gray-900 mb-2">
                    {data.isPositive ? '' : '-'}{formatCurrency(data.value)}
                </p>
                <p className="text-sm text-gray-600 mb-2">{data.tooltip}</p>
                <span className={`inline-block text-xs px-2 py-1 rounded-full ${data.category === 'revenue' ? 'bg-emerald-100 text-emerald-700' :
                    data.category === 'fee' ? 'bg-rose-100 text-rose-700' :
                        data.category === 'hold' ? 'bg-orange-100 text-orange-700' :
                            'bg-gray-100 text-gray-700'
                    }`}>
                    {categoryLabels[data.category]}
                </span>
            </div>
        );
    };

    return (
        <div className="bg-white rounded-xl p-3 border border-gray-200 shadow-sm">
            {/* Header */}
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Where Your Money Goes
            </h3>

            {/* Legend */}
            <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-emerald-500" />
                    <span className="text-xs font-medium text-gray-600">Your Money</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-rose-500" />
                    <span className="text-xs font-medium text-gray-600">Fees/Losses</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-orange-500" />
                    <span className="text-xs font-medium text-gray-600">Hold</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-gray-400" />
                    <span className="text-xs font-medium text-gray-600">Taxes</span>
                </div>
            </div>

            {/* Chart */}
            <div className="h-[340px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        layout="vertical"
                        data={chartData}
                        margin={{ top: 10, right: 30, left: 10, bottom: 0 }}
                    >
                        <XAxis
                            type="number"
                            hide
                        />
                        <YAxis
                            dataKey="name"
                            type="category"
                            width={100}
                            tick={{ fill: '#4b5563', fontSize: 11, fontWeight: 500 }}
                            axisLine={false}
                            tickLine={false}
                        />
                        <Tooltip
                            content={<CustomTooltip />}
                            cursor={{ fill: 'rgba(0, 0, 0, 0.03)' }}
                        />
                        <Bar dataKey="end" radius={[0, 4, 4, 0]} barSize={24}>
                            {chartData.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={entry.fill}
                                    opacity={entry.category === 'tax' ? 0.8 : 1}
                                />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>

            <p className="text-xs text-gray-400 text-center mt-4 md:hidden">
                Tap on bars for details
            </p>
        </div>
    );
};

export default WaterfallChart;
