'use client';

import { ReactNode } from 'react';
import { Lock, Sparkles } from 'lucide-react';
import { PricingTierId } from '@/lib/pricing';

interface PremiumFeatureProps {
  children: ReactNode;
  requiredTier: PricingTierId;
  currentTier: PricingTierId;
  featureName: string;
  onUpgrade?: () => void;
}

const tierOrder: PricingTierId[] = ['FREE', 'STARTER', 'PRO', 'AGENCY'];

function canAccessFeature(currentTier: PricingTierId, requiredTier: PricingTierId): boolean {
  const currentIndex = tierOrder.indexOf(currentTier);
  const requiredIndex = tierOrder.indexOf(requiredTier);
  return currentIndex >= requiredIndex;
}

export function PremiumFeature({
  children,
  requiredTier,
  currentTier,
  featureName,
  onUpgrade,
}: PremiumFeatureProps) {
  const hasAccess = canAccessFeature(currentTier, requiredTier);

  if (hasAccess) {
    return <>{children}</>;
  }

  return (
    <div className="relative">
      {/* Blurred content */}
      <div className="blur-sm pointer-events-none select-none opacity-50">
        {children}
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-planner-cream/90 to-planner-peach/90 backdrop-blur-sm rounded-lg">
        <div className="text-center p-6 max-w-md">
          <div className="mb-4 flex justify-center">
            <div className="bg-gradient-to-br from-planner-terracotta to-planner-sage p-3 rounded-full">
              <Lock className="w-6 h-6 text-white" />
            </div>
          </div>

          <h3 className="font-serif font-bold text-xl text-planner-charcoal mb-2">
            {featureName}
          </h3>

          <p className="text-planner-charcoal/70 mb-4">
            This feature requires the <span className="font-semibold">{requiredTier}</span> plan or higher.
          </p>

          <button
            onClick={onUpgrade || (() => window.location.href = '/pricing')}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-planner-terracotta to-planner-sage text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
          >
            <Sparkles className="w-4 h-4" />
            Upgrade to {requiredTier}
          </button>
        </div>
      </div>
    </div>
  );
}

// Usage limit component
interface UsageLimitProps {
  current: number;
  limit: number;
  label: string;
  onUpgrade?: () => void;
}

export function UsageLimit({ current, limit, label, onUpgrade }: UsageLimitProps) {
  const percentage = Math.min((current / limit) * 100, 100);
  const isNearLimit = percentage >= 80;
  const isAtLimit = percentage >= 100;

  return (
    <div className="bg-white rounded-lg p-4 shadow-planner-soft">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-planner-charcoal">
          {label}
        </span>
        <span className={`text-sm font-semibold ${
          isAtLimit ? 'text-red-600' : isNearLimit ? 'text-orange-500' : 'text-planner-sage'
        }`}>
          {current} / {limit === Infinity ? '∞' : limit}
        </span>
      </div>

      {limit !== Infinity && (
        <>
          <div className="w-full bg-planner-cream rounded-full h-2 mb-2">
            <div
              className={`h-2 rounded-full transition-all ${
                isAtLimit
                  ? 'bg-red-600'
                  : isNearLimit
                  ? 'bg-orange-500'
                  : 'bg-gradient-to-r from-planner-terracotta to-planner-sage'
              }`}
              style={{ width: `${percentage}%` }}
            />
          </div>

          {isAtLimit && (
            <div className="flex items-center justify-between">
              <span className="text-xs text-red-600">Limit reached</span>
              <button
                onClick={onUpgrade || (() => window.location.href = '/pricing')}
                className="text-xs text-planner-terracotta hover:text-planner-sage font-semibold"
              >
                Upgrade →
              </button>
            </div>
          )}

          {!isAtLimit && isNearLimit && (
            <span className="text-xs text-orange-600">
              {limit - current} remaining
            </span>
          )}
        </>
      )}
    </div>
  );
}

// Premium badge
export function PremiumBadge({ tier }: { tier: PricingTierId }) {
  if (tier === 'FREE') return null;

  return (
    <span className="inline-flex items-center gap-1 bg-gradient-to-r from-planner-terracotta to-planner-sage text-white px-2 py-1 rounded-full text-xs font-semibold">
      <Sparkles className="w-3 h-3" />
      {tier}
    </span>
  );
}
