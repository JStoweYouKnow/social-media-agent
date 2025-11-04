import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { verifyWebhookSignature } from '@/lib/stripe';
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

        // Update user subscription in your database
        console.log('Checkout completed:', {
          userId: session.metadata?.userId,
          customerId: session.customer,
          subscriptionId: session.subscription,
        });

        // TODO: Update user record in Convex/Firebase with subscription details
        // await updateUserSubscription({
        //   userId: session.metadata?.userId,
        //   customerId: session.customer as string,
        //   subscriptionId: session.subscription as string,
        //   tier: 'pro', // Determine from price ID
        // });

        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;

        console.log('Subscription updated:', {
          subscriptionId: subscription.id,
          status: subscription.status,
          customerId: subscription.customer,
        });

        // TODO: Update subscription status in database
        // await updateSubscriptionStatus({
        //   subscriptionId: subscription.id,
        //   status: subscription.status,
        // });

        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;

        console.log('Subscription deleted:', {
          subscriptionId: subscription.id,
          customerId: subscription.customer,
        });

        // TODO: Downgrade user to free tier
        // await updateUserSubscription({
        //   userId: subscription.metadata?.userId,
        //   tier: 'free',
        //   subscriptionId: null,
        // });

        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;

        console.log('Payment failed:', {
          customerId: invoice.customer,
          subscriptionId: invoice.subscription,
        });

        // TODO: Notify user of payment failure
        // await sendPaymentFailureEmail(invoice.customer_email);

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
