'use client';

import Link from 'next/link';
import { useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';

function SuccessPage() {
    const params = useSearchParams();
    const userId = params.get('userId');

    useEffect(() => {
        if (typeof window === 'undefined') return;
        if (userId) {
            localStorage.setItem('userId', userId);
        }
    }, [userId]);

    const statusMessage = useMemo(() => {
        if (!userId) {
            return 'We linked your Airtable account, but no user id was returned.';
        }
        return 'Your Airtable account is now linked and ready to use.';
    }, [userId]);

    return (
        <section className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
            <div className="w-full max-w-xl rounded-2xl bg-white p-10 text-center shadow-xl">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 12l2 2 4-4" />
                        <circle cx="12" cy="12" r="9" />
                    </svg>
                </div>
                <p className="text-sm uppercase tracking-[0.3em] text-emerald-600">Success</p>
                <h1 className="mt-2 text-3xl font-semibold text-slate-900">You're connected!</h1>
                <p className="mt-4 text-base text-slate-600">{statusMessage}</p>

                <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-center">
                    <Link
                        href="/builder"
                        className="inline-flex w-full items-center justify-center rounded-lg bg-emerald-600 px-6 py-3 text-base font-medium text-white shadow-sm transition hover:bg-emerald-500 sm:w-auto"
                    >
                        Open Form Builder
                    </Link>
                    <Link
                        href="/dashboard"
                        className="inline-flex w-full items-center justify-center rounded-lg border border-slate-200 px-6 py-3 text-base font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 sm:w-auto"
                    >
                        View Dashboard
                    </Link>
                </div>

                <div className="mt-8 text-sm text-slate-500">
                    Need help? <Link href="/support" className="text-emerald-600 hover:underline">Contact support</Link>
                </div>
            </div>
        </section>
    );
}

export default SuccessPage;