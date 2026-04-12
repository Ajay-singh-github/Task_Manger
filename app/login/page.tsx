'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { EnvelopeIcon, LockClosedIcon } from '@heroicons/react/24/outline';

export default function LoginPage() {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // TODO: Add login API call
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            const data = await res.json();
            if (res.ok) {
                router.push('/');
            } else {
                setError(data.error || 'Login failed');
            }

        } catch (err: any) {
            setError(err.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='w-full min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4'>
            <div className='w-full max-w-md'>
                <div className='bg-slate-800 rounded-lg shadow-2xl p-8 border border-slate-700'>
                    {/* Header */}
                    <div className='text-center mb-8'>
                        <h1 className='text-4xl font-bold text-white mb-2'>TUDO</h1>
                        <p className='text-slate-400'>Welcome back to your dashboard</p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className='bg-red-900 text-red-200 p-3 rounded-lg mb-6 text-sm'>
                            {error}
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className='space-y-5'>
                        {/* Email */}
                        <div>
                            <label className='block text-sm font-medium text-white mb-2'>
                                <EnvelopeIcon className='w-4 h-4 inline mr-2' />
                                Email Address
                            </label>
                            <input
                                type='email'
                                name='email'
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className='w-full px-4 py-3 bg-slate-700 text-white border border-slate-600 rounded-lg focus:outline-none focus:border-blue-500 transition placeholder-slate-400'
                                placeholder='you@example.com'
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label className='block text-sm font-medium text-white mb-2'>
                                <LockClosedIcon className='w-4 h-4 inline mr-2' />
                                Password
                            </label>
                            <input
                                type='password'
                                name='password'
                                value={formData.password}
                                onChange={handleChange}
                                required
                                className='w-full px-4 py-3 bg-slate-700 text-white border border-slate-600 rounded-lg focus:outline-none focus:border-blue-500 transition placeholder-slate-400'
                                placeholder='••••••••'
                            />
                        </div>

                        {/* Forgot Password Link */}
                        <div className='text-right'>
                            <Link href='/forgot-password' className='text-sm text-blue-400 hover:text-blue-300 transition'>
                                Forgot password?
                            </Link>
                        </div>

                        {/* Submit Button */}
                        <button
                            type='submit'
                            disabled={loading}
                            className='w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition duration-200 shadow-lg'
                        >
                            {loading ? 'Logging in...' : 'Sign In'}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className='relative my-6'>
                        <div className='absolute inset-0 flex items-center'>
                            <div className='w-full border-t border-slate-600'></div>
                        </div>
                        <div className='relative flex justify-center text-sm'>
                            <span className='px-2 bg-slate-800 text-slate-400'>Don't have an account?</span>
                        </div>
                    </div>

                    {/* Register Link */}
                    <Link
                        href='/register'
                        className='block w-full text-center px-4 py-3 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition duration-200'
                    >
                        Create New Account
                    </Link>
                </div>

                {/* Footer */}
                <p className='text-center text-slate-400 text-sm mt-6'>
                    © 2026 TUDO Dashboard. All rights reserved.
                </p>
            </div>
        </div>
    );
}
