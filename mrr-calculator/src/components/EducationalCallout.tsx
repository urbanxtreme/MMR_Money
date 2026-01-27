import { useState } from 'react';

interface EducationalTopic {
    id: string;
    title: string;
    icon: string;
    content: string;
    keyPoint: string;
}

const EDUCATIONAL_TOPICS: EducationalTopic[] = [
    {
        id: 'processor-fees',
        title: 'Payment Processing Fees',
        icon: '💳',
        content: `Every time a customer pays you, your payment processor takes a cut. This typically ranges from 2.9% + $0.30 per transaction (Stripe) to 5% flat (Paddle, Lemon Squeezy). These fees cover fraud protection, currency conversion, and the complex infrastructure that makes online payments possible.`,
        keyPoint: 'This is the cost of doing business online — unavoidable but predictable.'
    },
    {
        id: 'refunds',
        title: 'Refunds',
        icon: '↩️',
        content: `When customers request refunds, the money leaves your account. Additionally, most processors don't refund their fees — so a $100 refund might actually cost you $103. The average SaaS sees 2-5% refund rates depending on pricing model and customer segment.`,
        keyPoint: 'Lower refunds with better onboarding and clear value proposition upfront.'
    },
    {
        id: 'chargebacks',
        title: 'Chargebacks',
        icon: '⚠️',
        content: `Chargebacks happen when customers dispute a transaction with their bank. Unlike refunds, you lose the money AND pay a $15-25 chargeback fee. Too many chargebacks (>1%) can get your merchant account terminated. Common causes: forgotten subscriptions, confusing billing, or actual fraud.`,
        keyPoint: 'Clear billing descriptors and easy cancellation reduce disputes.'
    },
    {
        id: 'rolling-reserve',
        title: 'Rolling Reserves',
        icon: '⏳',
        content: `If you're a new business, Stripe may hold 10% of your revenue in reserve for 6 months. This protects against potential refunds and chargebacks. The money isn't lost — it's released after the holding period. Think of it as a mandatory savings account.`,
        keyPoint: 'This is temporary! You\'ll get this money back after 6 months.'
    },
    {
        id: 'taxes',
        title: 'VAT & Sales Tax',
        icon: '🏛️',
        content: `Here's the key insight: taxes collected on sales were never yours to begin with. When you charge a EU customer $100, you might collect $120 (including 20% VAT). That $20 was always government money — you're just passing it through. Your "real" MRR is the pre-tax amount.`,
        keyPoint: 'Tax-inclusive pricing inflates your MRR — track net revenue instead.'
    }
];

export const EducationalCallout: React.FC = () => {
    const [expandedTopic, setExpandedTopic] = useState<string | null>(null);

    const toggleTopic = (id: string) => {
        setExpandedTopic(expandedTopic === id ? null : id);
    };

    return (
        <div className="bg-slate-800/40 rounded-xl p-6 border border-slate-700/50">
            {/* Header */}
            <div className="flex items-start gap-3 mb-6">
                <div className="w-12 h-12 bg-indigo-500/20 rounded-xl flex items-center justify-center shrink-0">
                    <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-white">
                        Understanding the MRR-to-Bank Gap
                    </h3>
                    <p className="text-sm text-slate-400 mt-1">
                        It's normal and expected. Here's why your numbers don't match up.
                    </p>
                </div>
            </div>

            {/* Key insight banner */}
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 mb-6">
                <div className="flex items-center gap-2 mb-2">
                    <svg className="w-5 h-5 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    <span className="font-medium text-emerald-300">Key Insight</span>
                </div>
                <p className="text-sm text-emerald-200/80">
                    The gap between your reported MRR and actual bank deposit is <strong>completely normal</strong>.
                    Understanding it helps you forecast cash flow accurately and avoid surprises.
                    Most SaaS businesses see a 15-35% gap depending on their processor, geography, and refund rates.
                </p>
            </div>

            {/* Expandable topics */}
            <div className="space-y-3">
                {EDUCATIONAL_TOPICS.map((topic) => (
                    <div
                        key={topic.id}
                        className="bg-slate-800/30 rounded-xl border border-slate-700/50 overflow-hidden transition-all"
                    >
                        <button
                            onClick={() => toggleTopic(topic.id)}
                            className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-800/50 transition-colors"
                            aria-expanded={expandedTopic === topic.id}
                            aria-controls={`topic-${topic.id}`}
                        >
                            <div className="flex items-center gap-3">
                                <span className="text-2xl">{topic.icon}</span>
                                <span className="font-medium text-white">{topic.title}</span>
                            </div>
                            <svg
                                className={`w-5 h-5 text-slate-400 transition-transform ${expandedTopic === topic.id ? 'rotate-180' : ''
                                    }`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>

                        {expandedTopic === topic.id && (
                            <div
                                id={`topic-${topic.id}`}
                                className="px-4 pb-4 border-t border-slate-700/50"
                            >
                                <p className="text-sm text-slate-300 mt-4 leading-relaxed">
                                    {topic.content}
                                </p>
                                <div className="mt-4 p-3 bg-slate-700/30 rounded-lg">
                                    <p className="text-sm text-amber-300 flex items-start gap-2">
                                        <span className="shrink-0">💡</span>
                                        <span>{topic.keyPoint}</span>
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Bottom tips */}
            <div className="mt-6 pt-6 border-t border-slate-700/50">
                <h4 className="text-sm font-medium text-white mb-3">
                    Pro Tips for Better Cash Flow
                </h4>
                <ul className="space-y-2 text-sm text-slate-400">
                    <li className="flex items-start gap-2">
                        <span className="text-emerald-400 mt-0.5">✓</span>
                        Track net revenue (after fees) instead of gross MRR
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-emerald-400 mt-0.5">✓</span>
                        Set aside 25-30% of reported MRR for the gap
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-emerald-400 mt-0.5">✓</span>
                        Use annual plans to reduce per-transaction fees
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-emerald-400 mt-0.5">✓</span>
                        Consider Paddle/LemonSqueezy if selling globally (they handle taxes)
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default EducationalCallout;
