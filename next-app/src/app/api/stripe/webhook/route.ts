import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { verifyWebhookSignature } from '@/lib/stripe';
import {
  updateUserSubscription,
  getTierFromPriceId,
  getSubscriptionByCustomerId,
  getSubscriptionBySubscriptionId,
} from '@/lib/subscription-convex';
import Stripe from 'stripe';

// Disable body parsing for webhook
export const runtime = 'edge';

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const headersList = await headers();
    const signature = headersList.get('stripe-signature');

    if (!signature) {
      return NextResponse.json(
        { error: 'No signature found' },
        { status: 400 }
      );
    }

    const event = verifyWebhookSignature(body, signature);

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId;

        if (!userId) {
          console.error('No userId in session metadata');
          break;
        }

        // Get the price ID from the subscription
        const subscriptionId = session.subscription as string;
        const customerId = session.customer as string;

        // Get price ID from line items
        const priceId = session.line_items?.data?.[0]?.price?.id || '';
        const tier = getTierFromPriceId(priceId);

        // Update user subscription
        await updateUserSubscription({
          userId,
          tier,
          stripeCustomerId: customerId,
          stripeSubscriptionId: subscriptionId,
          priceId,
          status: 'active',
        });

        console.log('Subscription created:', {
          userId,
          tier,
          customerId,
          subscriptionId,
        });

        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        // Find user by customer ID
        const userSub = await getSubscriptionByCustomerId(customerId);

        if (!userSub) {
          console.error('No subscription found for customer:', customerId);
          break;
        }

        // Get the new price ID and tier
        const priceId = subscription.items.data[0]?.price?.id || userSub.priceId || '';
        const tier = getTierFromPriceId(priceId);

        // Update subscription status and tier
        const periodEnd = (subscription as any).current_period_end;
        const cancelAtEnd = (subscription as any).cancel_at_period_end;

        await updateUserSubscription({
          userId: userSub.userId,
          tier,
          priceId,
          status: subscription.status as any,
          currentPeriodEnd: periodEnd ? new Date(periodEnd * 1000) : undefined,
          cancelAtPeriodEnd: cancelAtEnd,
        });

        console.log('Subscription updated:', {
          userId: userSub.userId,
          tier,
          status: subscription.status,
        });

        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;

        // Find user by subscription ID
        const userSub = await getSubscriptionBySubscriptionId(subscription.id);

        if (!userSub) {
          console.error('No subscription found for:', subscription.id);
          break;
        }

        // Downgrade to free tier
        await updateUserSubscription({
          userId: userSub.userId,
          tier: 'free',
          status: 'canceled',
          stripeSubscriptionId: undefined,
        });

        console.log('Subscription canceled:', {
          userId: userSub.userId,
          subscriptionId: subscription.id,
        });

        // TODO: Send email notification to user
        // await sendEmail({
        //   to: userEmail,
        //   subject: 'Your subscription has been canceled',
        //   template: 'subscription-canceled',
        // });

        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId = invoice.customer as string;

        // Find user by customer ID
        const userSub = await getSubscriptionByCustomerId(customerId);

        if (userSub) {
          // Update status to past_due
          await updateUserSubscription({
            userId: userSub.userId,
            status: 'past_due',
          });

          console.log('Payment failed:', {
            userId: userSub.userId,
            customerId,
          });

          // TODO: Send email notification to user
          // await sendEmail({
          //   to: userEmail,
          //   subject: 'Payment failed - Action required',
          //   template: 'payment-failed',
          // });
        }

        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}
