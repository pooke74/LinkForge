'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: username.toLowerCase().trim(), email, password }),
            });
            const data = await res.json();
            if (!res.ok) {
                setError(data.error || 'Bir hata oluştu');
                return;
            }
            router.push('/dashboard');
        } catch {
            setError('Bağlantı hatası');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-950 via-purple-950/50 to-gray-950 text-white flex items-center justify-center px-4">
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-20 left-10 w-72 h-72 bg-purple-600/20 rounded-full blur-3xl animate-float" />
                <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
            </div>

            <div className="relative z-10 w-full max-w-md">
                <div className="text-center mb-8">
                    <Link href="/" className="inline-flex items-center gap-2 mb-6">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-lg font-black">L</div>
                        <span className="text-xl font-bold">LinkForge</span>
                    </Link>
                    <h1 className="text-3xl font-black">Sayfanı Oluştur</h1>
                    <p className="text-gray-400 mt-2">30 saniyede ücretsiz hesap</p>
                </div>

                <form onSubmit={handleSubmit} className="glass-strong rounded-2xl p-8 space-y-5">
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm">
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Kullanıcı Adı</label>
                        <div className="flex items-center bg-white/5 border border-white/10 rounded-xl overflow-hidden focus-within:border-purple-500/50 transition-colors">
                            <span className="pl-4 text-gray-500 text-sm">linkforge.app/</span>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value.replace(/[^a-zA-Z0-9_-]/g, ''))}
                                className="flex-1 bg-transparent px-2 py-3 outline-none text-white placeholder-gray-600"
                                placeholder="username"
                                required
                                minLength={3}
                                maxLength={30}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none text-white placeholder-gray-600 focus:border-purple-500/50 transition-colors"
                            placeholder="sen@email.com"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Şifre</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none text-white placeholder-gray-600 focus:border-purple-500/50 transition-colors"
                            placeholder="••••••••"
                            required
                            minLength={6}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3.5 font-bold bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl hover:from-purple-500 hover:to-blue-500 transition-all shadow-lg shadow-purple-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Oluşturuluyor...' : 'Ücretsiz Hesap Oluştur'}
                    </button>

                    <p className="text-center text-gray-500 text-sm">
                        Hesabın var mı?{' '}
                        <Link href="/login" className="text-purple-400 hover:text-purple-300 font-medium">
                            Giriş Yap
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
}
