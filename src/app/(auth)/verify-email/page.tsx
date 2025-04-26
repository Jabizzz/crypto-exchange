"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function VerifyEmail() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 text-center">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            Check your email
          </h2>
        </div>
        
        <div className="mt-2">
          <p className="text-sm text-gray-600">
            We&apos;ve sent a verification link to <span className="font-medium">{email}</span>
          </p>
          <p className="mt-4 text-sm text-gray-600">
            Please check your inbox and click the verification link to complete your registration.
          </p>
        </div>
        
        <div className="mt-6">
          <p className="text-sm text-gray-500">
            Didn&apos;t receive an email?{" "}
            <button 
              className="font-medium text-indigo-600 hover:text-indigo-500"
              onClick={() => alert("Resend functionality would be implemented here")}
            >
              Resend verification email
            </button>
          </p>
        </div>
        
        <div className="mt-8">
          <Link
            href="/signin"
            className="inline-flex justify-center rounded-md border border-transparent bg-indigo-100 px-4 py-2 text-sm font-medium text-indigo-700 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Back to sign in
          </Link>
        </div>
      </div>
    </div>
  );
}