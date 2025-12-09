'use client';

import { useState } from 'react';
import { Check, Sparkles } from 'lucide-react';
import { PRICING_TIERS, PricingTierId } from '@/lib/pricing';
import { useUser } from '@clerk/nextjs';

export default function PricingPage() {
  const { user } = useUser();
  const [loading, setLoading] = useState<string | null>(null);

  const handleSubscribe = async (priceId: string | null, tierId: string) => {
    if (!user) {
      window.location.href = '/sign-in';
      return;
    }

    if (!priceId) {
      // Free tier - just redirect to dashboard
      window.location.href = '/';
      return;
    }

    setLoading(tierId);

    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        console.error('No checkout URL returned');
        alert('Failed to create checkout session');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Failed to start checkout process');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-planner-cream via-white to-planner-peach/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-serif font-bold text-planner-charcoal mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-planner-charcoal/70 max-w-2xl mx-auto">
            Start free and scale as you grow. All plans include our core features.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {(Object.keys(PRICING_TIERS) as PricingTierId[]).map((tierId) => {
            const tier = PRICING_TIERS[tierId];
            const isPopular = 'popular' in tier && tier.popular;

            return (
              <div
                key={tierId}
                className={`relative bg-white rounded-2xl shadow-planner-soft p-8 ${
                  isPopular
                    ? 'ring-2 ring-planner-terracotta transform scale-105'
                    : 'hover:shadow-planner-md transition-shadow'
                }`}
              >
                {isPopular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-planner-terracotta to-planner-sage text-white px-4 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                      <Sparkles className="w-4 h-4" />
                      Most Popular
                    </span>
                  </div>
                )}

                {/* Tier Name */}
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-serif font-bold text-planner-charcoal mb-2">
                    {tier.name}
                  </h3>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-4xl font-bold text-planner-terracotta">
                      ${tier.price}
                    </span>
                    <span className="text-planner-charcoal/60">/month</span>
                  </div>
                </div>

                {/* Features */}
                <ul className="space-y-4 mb-8">
                  {tier.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-planner-sage flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-planner-charcoal/80">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <button
                  onClick={() => handleSubscribe(tier.priceId || null, tierId)}
                  disabled={loading === tierId}
                  className={`w-full py-3 rounded-lg font-semibold transition-all ${
                    isPopular
                      ? 'bg-gradient-to-r from-planner-terracotta to-planner-sage text-white hover:shadow-lg'
                      : 'bg-planner-cream text-planner-charcoal hover:bg-planner-peach'
                  } ${loading === tierId ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {loading === tierId
                    ? 'Loading...'
                    : tierId === 'FREE'
                    ? 'Get Started'
                    : 'Subscribe'}
                </button>
              </div>
            );
          })}
        </div>

        {/* FAQ Section */}
        <div className="mt-24 max-w-3xl mx-auto">
          <h2 className="text-3xl font-serif font-bold text-center text-planner-charcoal mb-12">
            Frequently Asked Questions
          </h2>

          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-planner-soft">
              <h3 className="font-semibold text-planner-charcoal mb-2">
                Can I change plans later?
              </h3>
              <p className="text-planner-charcoal/70">
                Yes! You can upgrade or downgrade your plan at any time. Changes will be prorated.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-planner-soft">
              <h3 className="font-semibold text-planner-charcoal mb-2">
                What happens if I exceed my limits?
              </h3>
              <p className="text-planner-charcoal/70">
                You'll receive a notification when approaching your limits. You can upgrade to continue or wait for the next billing cycle.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-planner-soft">
              <h3 className="font-semibold text-planner-charcoal mb-2">
                Do you offer refunds?
              </h3>
              <p className="text-planner-charcoal/70">
                Yes, we offer a 14-day money-back guarantee on all paid plans. No questions asked.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-planner-soft">
              <h3 className="font-semibold text-planner-charcoal mb-2">
                Is there a contract or commitment?
              </h3>
              <p className="text-planner-charcoal/70">
                No contracts! All plans are month-to-month. Cancel anytime with one click.
              </p>
            </div>
          </div>
        </div>

        {/* Back to Dashboard */}
        <div className="text-center mt-12">
          <a
            href="/"
            className="text-planner-terracotta hover:text-planner-sage transition-colors"
          >
            ← Back to Dashboard
          </a>
        </div>
      </div>
    </div>
  );
}
