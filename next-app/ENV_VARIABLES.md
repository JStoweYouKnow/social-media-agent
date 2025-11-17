# Environment Variables Reference

Copy this template to create your `.env.local` file:

```env
# ============================================
# REQUIRED - Authentication
# ============================================
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/
CLERK_JWT_ISSUER_DOMAIN=https://your-app.clerk.accounts.dev

# ============================================
# REQUIRED - OpenAI (for AI features)
# ============================================
OPENAI_API_KEY=sk-...

# ============================================
# REQUIRED - Stripe (for payments)
# ============================================
STRIPE_SECRET_KEY=sk_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_STARTER_PRICE_ID=price_...
STRIPE_PRO_PRICE_ID=price_...
STRIPE_AGENCY_PRICE_ID=price_...

# ============================================
# OPTIONAL - Convex Database
# ============================================
NEXT_PUBLIC_CONVEX_URL=https://your-project.convex.cloud
CONVEX_DEPLOYMENT=prod:your-deployment-name

# ============================================
# OPTIONAL - Canva Integration
# ============================================
CANVA_API_KEY=your-canva-key
CANVA_CLIENT_ID=your-canva-client-id
CANVA_CLIENT_SECRET=your-canva-client-secret

# ============================================
# OPTIONAL - App Configuration
# ============================================
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app

# ============================================
# OPTIONAL - Sentry Error Tracking
# ============================================
NEXT_PUBLIC_SENTRY_DSN=https://your-sentry-dsn@sentry.io/project-id
SENTRY_DSN=https://your-sentry-dsn@sentry.io/project-id
SENTRY_ORG=your-org-name
SENTRY_PROJECT=your-project-name
SENTRY_AUTH_TOKEN=your-auth-token
```

## Getting Your Keys

### Clerk
1. Go to [Clerk Dashboard](https://dashboard.clerk.com)
2. Select your application
3. Go to **API Keys** section
4. Copy the Publishable Key and Secret Key

### OpenAI
1. Go to [OpenAI Platform](https://platform.openai.com)
2. Navigate to **API Keys**
3. Create a new secret key
4. Copy the key (starts with `sk-`)

### Stripe
1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Go to **Developers** → **API Keys**
3. Copy Secret Key (starts with `sk_`)
4. Go to **Developers** → **Webhooks**
5. Create webhook endpoint, copy secret (starts with `whsec_`)
6. Go to **Products** → Copy Price IDs (start with `price_`)

### Convex
1. Run `npx convex dev` in your project
2. Follow the prompts to create a project
3. Copy the deployment URL and name from the output

## Production vs Development

**Development:** Use test keys (e.g., `pk_test_...`, `sk_test_...`)  
**Production:** Use live keys (e.g., `pk_live_...`, `sk_live_...`)

⚠️ **Never commit `.env.local` to git!** It's already in `.gitignore`.

