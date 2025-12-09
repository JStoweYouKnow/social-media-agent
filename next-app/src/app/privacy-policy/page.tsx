import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Post Planner",
  description: "Privacy Policy for Post Planner - Learn how we collect, use, and protect your data.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#F6F3EE]">
      <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-serif font-bold text-gray-900 mb-8">
          Privacy Policy
        </h1>

        <div className="prose prose-lg max-w-none">
          <p className="text-gray-600 mb-6">
            <strong>Effective Date:</strong> November 29, 2025
          </p>

          <p className="text-gray-700 mb-6">
            Post Planner ("we," "us," or "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our mobile application and web service (collectively, the "Service").
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-serif font-semibold text-gray-900 mb-4">
              1. Information We Collect
            </h2>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              1.1 Personal Information
            </h3>
            <p className="text-gray-700 mb-4">
              When you register for an account, we collect:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
              <li>Name and email address</li>
              <li>Profile information you choose to provide</li>
              <li>Payment information (processed securely through Stripe)</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              1.2 Content Data
            </h3>
            <p className="text-gray-700 mb-4">
              We collect and store:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
              <li>Social media posts and content you create</li>
              <li>Scheduled posts and content calendar data</li>
              <li>Custom presets and templates you save</li>
              <li>AI-generated content and variations</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              1.3 Usage Information
            </h3>
            <p className="text-gray-700 mb-4">
              We automatically collect:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
              <li>Device information (type, operating system, browser)</li>
              <li>IP address and general location</li>
              <li>App usage patterns and feature interactions</li>
              <li>Error logs and performance data</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-serif font-semibold text-gray-900 mb-4">
              2. How We Use Your Information
            </h2>
            <p className="text-gray-700 mb-4">
              We use your information to:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
              <li>Provide and maintain the Service</li>
              <li>Process your subscription and payments</li>
              <li>Generate AI-powered content using OpenAI and Anthropic APIs</li>
              <li>Send you important updates about your account</li>
              <li>Improve our Service and develop new features</li>
              <li>Detect and prevent fraud or abuse</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-serif font-semibold text-gray-900 mb-4">
              3. Data Sharing and Disclosure
            </h2>
            <p className="text-gray-700 mb-4">
              We do not sell your personal information. We may share your data with:
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              3.1 Service Providers
            </h3>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
              <li><strong>Clerk:</strong> Authentication and user management</li>
              <li><strong>OpenAI & Anthropic:</strong> AI content generation (your prompts and generated content)</li>
              <li><strong>Stripe:</strong> Payment processing</li>
              <li><strong>Sentry:</strong> Error tracking and monitoring</li>
              <li><strong>Vercel:</strong> Hosting and infrastructure</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              3.2 Legal Requirements
            </h3>
            <p className="text-gray-700 mb-4">
              We may disclose your information if required by law or to protect our rights, safety, or property.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-serif font-semibold text-gray-900 mb-4">
              4. Data Security
            </h2>
            <p className="text-gray-700 mb-4">
              We implement industry-standard security measures:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
              <li>Data encryption in transit (HTTPS/TLS)</li>
              <li>Secure authentication via Clerk</li>
              <li>Regular security audits and updates</li>
              <li>Access controls and authentication tokens</li>
            </ul>
            <p className="text-gray-700 mb-4">
              However, no method of transmission over the Internet is 100% secure. We cannot guarantee absolute security.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-serif font-semibold text-gray-900 mb-4">
              5. Your Rights and Choices
            </h2>
            <p className="text-gray-700 mb-4">
              You have the right to:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
              <li><strong>Access:</strong> Request a copy of your personal data</li>
              <li><strong>Correction:</strong> Update or correct your information</li>
              <li><strong>Deletion:</strong> Request deletion of your account and data</li>
              <li><strong>Export:</strong> Download your content in JSON format</li>
              <li><strong>Opt-out:</strong> Unsubscribe from marketing emails</li>
            </ul>
            <p className="text-gray-700 mb-4">
              To exercise these rights, contact us at: <strong>privacy@postplanner.app</strong>
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-serif font-semibold text-gray-900 mb-4">
              6. Data Retention
            </h2>
            <p className="text-gray-700 mb-4">
              We retain your information for as long as your account is active or as needed to provide services. You can delete your account at any time from the Profile settings.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-serif font-semibold text-gray-900 mb-4">
              7. Children's Privacy
            </h2>
            <p className="text-gray-700 mb-4">
              Our Service is not intended for children under 13. We do not knowingly collect personal information from children under 13.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-serif font-semibold text-gray-900 mb-4">
              8. International Users
            </h2>
            <p className="text-gray-700 mb-4">
              Your information may be transferred to and processed in the United States. By using our Service, you consent to this transfer.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-serif font-semibold text-gray-900 mb-4">
              9. Third-Party Services
            </h2>
            <p className="text-gray-700 mb-4">
              Our Service integrates with third-party AI services:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
              <li><strong>OpenAI:</strong> <a href="https://openai.com/privacy" className="text-[#C4A484] hover:underline">OpenAI Privacy Policy</a></li>
              <li><strong>Anthropic:</strong> <a href="https://www.anthropic.com/legal/privacy" className="text-[#C4A484] hover:underline">Anthropic Privacy Policy</a></li>
            </ul>
            <p className="text-gray-700 mb-4">
              Your content prompts and AI-generated responses are processed by these services in accordance with their privacy policies.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-serif font-semibold text-gray-900 mb-4">
              10. Changes to This Policy
            </h2>
            <p className="text-gray-700 mb-4">
              We may update this Privacy Policy from time to time. We will notify you of significant changes by email or through the Service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-serif font-semibold text-gray-900 mb-4">
              11. Contact Us
            </h2>
            <p className="text-gray-700 mb-4">
              If you have questions about this Privacy Policy, contact us at:
            </p>
            <div className="bg-white p-6 rounded-lg border border-gray-200 mt-4">
              <p className="text-gray-700 mb-2">
                <strong>Email:</strong> privacy@postplanner.app
              </p>
              <p className="text-gray-700 mb-2">
                <strong>Support:</strong> support@postplanner.app
              </p>
              <p className="text-gray-700">
                <strong>Website:</strong> https://postplanner.projcomfort.com
              </p>
            </div>
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
