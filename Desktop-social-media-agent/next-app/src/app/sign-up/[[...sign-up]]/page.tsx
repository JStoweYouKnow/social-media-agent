import { SignUp } from '@clerk/nextjs';

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50 to-amber-50">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Join Post Planner</h1>
          <p className="text-gray-600">Create your account to start planning content</p>
        </div>
        <SignUp
          appearance={{
            elements: {
              formButtonPrimary: 'bg-amber-600 hover:bg-amber-700',
              card: 'shadow-xl',
            },
          }}
        />
      </div>
    </div>
  );
}
