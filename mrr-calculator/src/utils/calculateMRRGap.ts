/**
 * MRR Gap Calculator Utility
 * 
 * This module contains all the calculation logic for determining the gap
 * between reported MRR and actual bank deposits.
 */

// Supported payment processors
export type PaymentProcessor = 'stripe' | 'paypal' | 'paddle' | 'lemon_squeezy' | 'other';

// Input parameters for the calculator
export interface CalculatorInputs {
  mrr: number;                    // Monthly Recurring Revenue in USD
  processor: PaymentProcessor;    // Payment processor used
  refundRate: number;             // Refund rate as percentage (0-10)
  chargebackRate: number;         // Chargeback rate as percentage (0-5)
  euUkSalesPercent: number;       // Percentage of sales in EU/UK (0-100)
  usSalesPercent: number;         // Percentage of sales in US (0-100)
  isNewStripeAccount: boolean;    // Whether Stripe account is <6 months old
}

// Breakdown of all deductions
export interface DeductionBreakdown {
  processorFees: number;
  refunds: number;
  chargebacks: number;
  rollingReserve: number;
  vatCollected: number;
  usSalesTax: number;
}

// Complete calculation result
export interface CalculationResult {
  mrr: number;
  deductions: DeductionBreakdown;
  netToBank: number;
  totalGap: number;
  gapPercent: number;
}

// Transaction count assumption (100 transactions per month)
const ASSUMED_TRANSACTIONS = 100;

// VAT rate for EU/UK sales
const EU_UK_VAT_RATE = 0.20; // 20%

// US sales tax rate (average)
const US_SALES_TAX_RATE = 0.08; // 8%

// Rolling reserve percentage for new Stripe accounts
const ROLLING_RESERVE_RATE = 0.10; // 10%

/**
 * Calculate processor fees based on the selected payment processor
 * Assumes 100 transactions with average ticket = MRR / 100
 */
function calculateProcessorFees(mrr: number, processor: PaymentProcessor): number {
  const transactions = ASSUMED_TRANSACTIONS;
  
  switch (processor) {
    case 'stripe':
      // Stripe: 2.9% + $0.30 per transaction
      return (mrr * 0.029) + (0.30 * transactions);
    
    case 'paypal':
      // PayPal: 3.49% + $0.49 per transaction
      return (mrr * 0.0349) + (0.49 * transactions);
    
    case 'paddle':
      // Paddle: 5% flat rate (includes tax handling)
      return mrr * 0.05;
    
    case 'lemon_squeezy':
      // Lemon Squeezy: 5% flat rate
      return mrr * 0.05;
    
    case 'other':
    default:
      // Other processors: 3% average
      return mrr * 0.03;
  }
}

/**
 * Calculate all deductions and the final bank deposit amount
 */
export function calculateMRRGap(inputs: CalculatorInputs): CalculationResult {
  const {
    mrr,
    processor,
    refundRate,
    chargebackRate,
    euUkSalesPercent,
    usSalesPercent,
    isNewStripeAccount
  } = inputs;

  // Calculate each deduction
  const processorFees = calculateProcessorFees(mrr, processor);
  const refunds = mrr * (refundRate / 100);
  const chargebacks = mrr * (chargebackRate / 100);
  
  // Rolling reserve only applies to new Stripe accounts
  const rollingReserve = (processor === 'stripe' && isNewStripeAccount) 
    ? mrr * ROLLING_RESERVE_RATE 
    : 0;
  
  // Tax calculations (these are collected on behalf of governments)
  const vatCollected = (euUkSalesPercent / 100) * mrr * EU_UK_VAT_RATE;
  const usSalesTax = (usSalesPercent / 100) * mrr * US_SALES_TAX_RATE;

  // Build deductions object
  const deductions: DeductionBreakdown = {
    processorFees,
    refunds,
    chargebacks,
    rollingReserve,
    vatCollected,
    usSalesTax
  };

  // Calculate totals
  const totalDeductions = 
    processorFees + 
    refunds + 
    chargebacks + 
    rollingReserve + 
    vatCollected + 
    usSalesTax;

  const netToBank = mrr - totalDeductions;
  const totalGap = mrr - netToBank;
  const gapPercent = mrr > 0 ? (totalGap / mrr) * 100 : 0;

  return {
    mrr,
    deductions,
    netToBank,
    totalGap,
    gapPercent
  };
}

/**
 * Get processor display name for UI
 */
export function getProcessorDisplayName(processor: PaymentProcessor): string {
  const names: Record<PaymentProcessor, string> = {
    stripe: 'Stripe',
    paypal: 'PayPal',
    paddle: 'Paddle',
    lemon_squeezy: 'Lemon Squeezy',
    other: 'Other'
  };
  return names[processor];
}

/**
 * Get processor fee description for tooltips
 */
export function getProcessorFeeDescription(processor: PaymentProcessor): string {
  const descriptions: Record<PaymentProcessor, string> = {
    stripe: '2.9% + $0.30 per transaction',
    paypal: '3.49% + $0.49 per transaction',
    paddle: '5% flat rate (includes tax handling)',
    lemon_squeezy: '5% flat rate',
    other: '~3% average industry rate'
  };
  return descriptions[processor];
}

/**
 * Format currency for display
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}

/**
 * Format percentage for display
 */
export function formatPercent(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`;
}
