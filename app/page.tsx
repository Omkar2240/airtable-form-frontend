'use client';

import { useState } from 'react';

export default function Login() {
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    window.open(`${process.env.NEXT_PUBLIC_API_URL}/auth/airtable/login`, '_blank');
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-6 shadow-md">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">Airtable Form Builder</h2>
          <p className="mt-2 text-sm text-gray-600">Login with your Airtable account to get started</p>
        </div>
        <div className="mt-8">
          <button
            onClick={handleLogin}
            disabled={loading}
            className="flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {loading ? 'Redirecting...' : 'Login with Airtable'}
          </button>
        </div>
      </div>
    </div>
  );
}
