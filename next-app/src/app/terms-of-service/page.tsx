import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | Post Planner",
  description: "Terms of Service for Post Planner - Read our terms and conditions for using the service.",
};

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-[#F6F3EE]">
      <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-serif font-bold text-gray-900 mb-8">
          Terms of Service
        </h1>

        <div className="prose prose-lg max-w-none">
          <p className="text-gray-600 mb-6">
            <strong>Effective Date:</strong> November 29, 2025
          </p>

          <p className="text-gray-700 mb-6">
            Please read these Terms of Service ("Terms") carefully before using Post Planner (the "Service"). By accessing or using the Service, you agree to be bound by these Terms.
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-serif font-semibold text-gray-900 mb-4">
              1. Acceptance of Terms
            </h2>
            <p className="text-gray-700 mb-4">
              By creating an account or using the Service, you agree to:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
              <li>Comply with these Terms and all applicable laws</li>
              <li>Be at least 13 years old (or the age of majority in your jurisdiction)</li>
              <li>Provide accurate registration information</li>
              <li>Maintain the security of your account credentials</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-serif font-semibold text-gray-900 mb-4">
              2. Description of Service
            </h2>
            <p className="text-gray-700 mb-4">
              Post Planner is a social media content planning and generation platform that provides:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
              <li>AI-powered content generation using OpenAI and Anthropic APIs</li>
              <li>Content library management and organization</li>
              <li>Post scheduling and calendar management</li>
              <li>Custom presets and templates</li>
              <li>Sentiment analysis and engagement scoring</li>
              <li>Multi-platform content optimization</li>
            </ul>
            <p className="text-gray-700 mb-4">
              We reserve the right to modify, suspend, or discontinue the Service at any time with reasonable notice.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-serif font-semibold text-gray-900 mb-4">
              3. User Accounts
            </h2>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              3.1 Account Security
            </h3>
            <p className="text-gray-700 mb-4">
              You are responsible for:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
              <li>Maintaining the confidentiality of your account</li>
              <li>All activities that occur under your account</li>
              <li>Notifying us immediately of any unauthorized access</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              3.2 Account Termination
            </h3>
            <p className="text-gray-700 mb-4">
              We may suspend or terminate your account if you:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
              <li>Violate these Terms</li>
              <li>Engage in fraudulent or illegal activities</li>
              <li>Abuse or misuse the Service</li>
              <li>Fail to pay subscription fees</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-serif font-semibold text-gray-900 mb-4">
              4. Subscription and Billing
            </h2>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              4.1 Subscription Tiers
            </h3>
            <p className="text-gray-700 mb-4">
              We offer multiple subscription tiers:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
              <li><strong>Free:</strong> Limited AI generations and features</li>
              <li><strong>Starter:</strong> Increased limits for individuals</li>
              <li><strong>Pro:</strong> Advanced features for professionals</li>
              <li><strong>Agency:</strong> Unlimited access for teams</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              4.2 Payment Terms
            </h3>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
              <li>Subscriptions are billed monthly or annually</li>
              <li>Payments are processed securely through Stripe</li>
              <li>All fees are non-refundable except as required by law</li>
              <li>We may change pricing with 30 days notice</li>
              <li>You can cancel your subscription at any time</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              4.3 Cancellation and Refunds
            </h3>
            <p className="text-gray-700 mb-4">
              You may cancel your subscription at any time. Upon cancellation:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
              <li>You retain access until the end of your billing period</li>
              <li>No refunds are provided for partial months</li>
              <li>Your data will be retained for 90 days after cancellation</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-serif font-semibold text-gray-900 mb-4">
              5. User Content and Ownership
            </h2>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              5.1 Your Content
            </h3>
            <p className="text-gray-700 mb-4">
              You retain all ownership rights to content you create using the Service. By using the Service, you grant us a limited license to:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
              <li>Store and process your content to provide the Service</li>
              <li>Share your content with AI providers (OpenAI, Anthropic) for generation</li>
              <li>Display your content within the Service interface</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              5.2 AI-Generated Content
            </h3>
            <p className="text-gray-700 mb-4">
              Content generated by AI:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
              <li>Belongs to you once generated</li>
              <li>Should be reviewed before posting to social media</li>
              <li>May require editing to ensure accuracy and appropriateness</li>
              <li>Is subject to OpenAI and Anthropic's terms of use</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              5.3 Prohibited Content
            </h3>
            <p className="text-gray-700 mb-4">
              You may not create or store content that:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
              <li>Violates any laws or regulations</li>
              <li>Infringes on intellectual property rights</li>
              <li>Contains hate speech, harassment, or threats</li>
              <li>Promotes illegal activities or violence</li>
              <li>Contains malware or malicious code</li>
              <li>Impersonates others or spreads misinformation</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-serif font-semibold text-gray-900 mb-4">
              6. Acceptable Use Policy
            </h2>
            <p className="text-gray-700 mb-4">
              You agree not to:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
              <li>Attempt to gain unauthorized access to the Service</li>
              <li>Interfere with or disrupt the Service</li>
              <li>Use automated scripts or bots to access the Service</li>
              <li>Reverse engineer or attempt to extract source code</li>
              <li>Resell or redistribute the Service without permission</li>
              <li>Use the Service to spam or send unsolicited communications</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-serif font-semibold text-gray-900 mb-4">
              7. Intellectual Property
            </h2>
            <p className="text-gray-700 mb-4">
              The Service, including its design, code, features, and branding, is owned by Post Planner and protected by copyright, trademark, and other intellectual property laws.
            </p>
            <p className="text-gray-700 mb-4">
              You may not copy, modify, distribute, or create derivative works without our express written permission.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-serif font-semibold text-gray-900 mb-4">
              8. Third-Party Services
            </h2>
            <p className="text-gray-700 mb-4">
              The Service integrates with third-party providers:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
              <li><strong>OpenAI:</strong> AI content generation</li>
              <li><strong>Anthropic:</strong> AI content generation</li>
              <li><strong>Clerk:</strong> Authentication</li>
              <li><strong>Stripe:</strong> Payment processing</li>
            </ul>
            <p className="text-gray-700 mb-4">
              Your use of these services is subject to their respective terms and privacy policies. We are not responsible for third-party services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-serif font-semibold text-gray-900 mb-4">
              9. Disclaimers and Limitations
            </h2>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              9.1 Service "As Is"
            </h3>
            <p className="text-gray-700 mb-4">
              The Service is provided "as is" without warranties of any kind. We do not guarantee:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
              <li>Uninterrupted or error-free service</li>
              <li>Accuracy of AI-generated content</li>
              <li>Compatibility with all devices or platforms</li>
              <li>Security against all threats</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              9.2 AI Content Disclaimer
            </h3>
            <p className="text-gray-700 mb-4">
              AI-generated content may:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
              <li>Contain errors, biases, or inaccuracies</li>
              <li>Require fact-checking and editing</li>
              <li>Not be suitable for all purposes</li>
              <li>Violate platform policies if posted without review</li>
            </ul>
            <p className="text-gray-700 mb-4">
              <strong>You are responsible for reviewing and editing all AI-generated content before publishing.</strong>
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-serif font-semibold text-gray-900 mb-4">
              10. Limitation of Liability
            </h2>
            <p className="text-gray-700 mb-4">
              To the maximum extent permitted by law:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
              <li>We are not liable for indirect, incidental, or consequential damages</li>
              <li>Our total liability is limited to the amount you paid in the last 12 months</li>
              <li>We are not responsible for losses due to service interruptions</li>
              <li>We are not liable for content you create or publish</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-serif font-semibold text-gray-900 mb-4">
              11. Indemnification
            </h2>
            <p className="text-gray-700 mb-4">
              You agree to indemnify and hold harmless Post Planner from any claims, damages, or expenses arising from:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
              <li>Your use of the Service</li>
              <li>Your violation of these Terms</li>
              <li>Your content or activities</li>
              <li>Your violation of any third-party rights</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-serif font-semibold text-gray-900 mb-4">
              12. Changes to Terms
            </h2>
            <p className="text-gray-700 mb-4">
              We may update these Terms from time to time. We will:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
              <li>Notify you of significant changes via email or in-app notification</li>
              <li>Update the "Effective Date" at the top of this page</li>
              <li>Give you the opportunity to review changes before they take effect</li>
            </ul>
            <p className="text-gray-700 mb-4">
              Continued use of the Service after changes indicates your acceptance of the new Terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-serif font-semibold text-gray-900 mb-4">
              13. Governing Law and Disputes
            </h2>
            <p className="text-gray-700 mb-4">
              These Terms are governed by the laws of the United States. Any disputes will be resolved through binding arbitration, except where prohibited by law.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-serif font-semibold text-gray-900 mb-4">
              14. Contact Information
            </h2>
            <p className="text-gray-700 mb-4">
              If you have questions about these Terms, contact us:
            </p>
            <div className="bg-white p-6 rounded-lg border border-gray-200 mt-4">
              <p className="text-gray-700 mb-2">
                <strong>Email:</strong> legal@postplanner.app
              </p>
              <p className="text-gray-700 mb-2">
                <strong>Support:</strong> support@postplanner.app
              </p>
              <p className="text-gray-700">
                <strong>Website:</strong> https://postplanner.projcomfort.com
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-serif font-semibold text-gray-900 mb-4">
              15. Severability
            </h2>
            <p className="text-gray-700 mb-4">
              If any provision of these Terms is found to be invalid or unenforceable, the remaining provisions will remain in full force and effect.
            </p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-300">
          <p className="text-sm text-gray-500 text-center">
            Last updated: November 29, 2025
          </p>
        </div>
      </div>
    </div>
  );
}
