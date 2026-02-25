'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface LinkItem {
    id: string;
    title: string;
    url: string;
    icon: string;
    clicks: number;
    active: number;
}

interface UserProfile {
    username: string;
    display_name: string;
    bio: string;
    avatar_url: string;
    theme: string;
}

const THEMES = [
    { id: 'midnight', name: 'Midnight', color: 'from-purple-600 to-blue-600' },
    { id: 'ocean', name: 'Ocean', color: 'from-cyan-600 to-blue-600' },
    { id: 'sunset', name: 'Sunset', color: 'from-orange-600 to-red-600' },
    { id: 'forest', name: 'Forest', color: 'from-green-600 to-teal-600' },
    { id: 'neon', name: 'Neon', color: 'from-pink-600 to-purple-600' },
    { id: 'minimal', name: 'Minimal', color: 'from-gray-400 to-gray-600' },
];

const ICONS = ['🔗', '🌐', '📸', '🎬', '🐦', '💼', '🎵', '📧', '🛒', '📱', '💬', '🎮', '📝', '🎨', '🐙', '☕'];

export default function DashboardPage() {
    const [links, setLinks] = useState<LinkItem[]>([]);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [newTitle, setNewTitle] = useState('');
    const [newUrl, setNewUrl] = useState('');
    const [newIcon, setNewIcon] = useState('🔗');
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editTitle, setEditTitle] = useState('');
    const [editUrl, setEditUrl] = useState('');
    const [editIcon, setEditIcon] = useState('🔗');
    const [displayName, setDisplayName] = useState('');
    const [bio, setBio] = useState('');
    const [theme, setTheme] = useState('midnight');
    const [showIconPicker, setShowIconPicker] = useState(false);
    const [showEditIconPicker, setShowEditIconPicker] = useState(false);
    const [tab, setTab] = useState<'links' | 'profile'>('links');
    const [saving, setSaving] = useState(false);
    const router = useRouter();

    const fetchLinks = useCallback(async () => {
        const res = await fetch('/api/links');
        if (res.status === 401) { router.push('/login'); return; }
        const data = await res.json();
        setLinks(data.links || []);
    }, [router]);

    const fetchProfile = useCallback(async () => {
        const res = await fetch('/api/auth/me');
        if (res.status === 401) { router.push('/login'); return; }
        const data = await res.json();
        setProfile(data.user);
        setDisplayName(data.user.display_name || '');
        setBio(data.user.bio || '');
        setTheme(data.user.theme || 'midnight');
    }, [router]);

    useEffect(() => {
        fetchLinks();
        fetchProfile();
    }, [fetchLinks, fetchProfile]);

    async function addLink(e: React.FormEvent) {
        e.preventDefault();
        if (!newTitle || !newUrl) return;
        const url = newUrl.startsWith('http') ? newUrl : `https://${newUrl}`;
        const res = await fetch('/api/links', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: newTitle, url, icon: newIcon }),
        });
        const data = await res.json();
        if (data.links) setLinks(data.links);
        setNewTitle('');
        setNewUrl('');
        setNewIcon('🔗');
    }

    async function removeLink(id: string) {
        const res = await fetch('/api/links', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id }),
        });
        const data = await res.json();
        if (data.links) setLinks(data.links);
    }

    async function saveEdit(id: string) {
        const url = editUrl.startsWith('http') ? editUrl : `https://${editUrl}`;
        const res = await fetch('/api/links', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, title: editTitle, url, icon: editIcon, active: true }),
        });
        const data = await res.json();
        if (data.links) setLinks(data.links);
        setEditingId(null);
    }

    async function saveProfile() {
        setSaving(true);
        await fetch('/api/profile', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ displayName, bio, theme }),
        });
        setSaving(false);
        fetchProfile();
    }

    async function logout() {
        await fetch('/api/auth/logout', { method: 'POST' });
        router.push('/');
    }

    const totalClicks = links.reduce((sum, l) => sum + l.clicks, 0);

    if (!profile) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-950 via-purple-950/50 to-gray-950 flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-950 via-purple-950/50 to-gray-950 text-white">
            {/* Header */}
            <header className="border-b border-white/5 px-6 py-4">
                <div className="max-w-5xl mx-auto flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-sm font-black">L</div>
                        <span className="font-bold">LinkForge</span>
                    </Link>
                    <div className="flex items-center gap-4">
                        <Link
                            href={`/${profile.username}`}
                            target="_blank"
                            className="text-sm text-purple-400 hover:text-purple-300 font-medium"
                        >
                            linkforge.app/{profile.username} ↗
                        </Link>
                        <button onClick={logout} className="text-sm text-gray-500 hover:text-gray-300">
                            Çıkış
                        </button>
                    </div>
                </div>
            </header>

            <div className="max-w-5xl mx-auto px-6 py-8">
                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                    <div className="glass rounded-2xl p-5 text-center">
                        <div className="text-3xl font-black text-gradient">{links.length}</div>
                        <div className="text-sm text-gray-400 mt-1">Link</div>
                    </div>
                    <div className="glass rounded-2xl p-5 text-center">
                        <div className="text-3xl font-black text-gradient">{totalClicks}</div>
                        <div className="text-sm text-gray-400 mt-1">Tıklama</div>
                    </div>
                    <div className="glass rounded-2xl p-5 text-center">
                        <div className="text-3xl font-black text-gradient">
                            {totalClicks > 0 && links.length > 0 ? Math.round(totalClicks / links.length) : 0}
                        </div>
                        <div className="text-sm text-gray-400 mt-1">Ort. Tık/Link</div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-1 mb-8 p-1 glass rounded-xl w-fit">
                    <button
                        onClick={() => setTab('links')}
                        className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${tab === 'links' ? 'bg-purple-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                    >
                        🔗 Linkler
                    </button>
                    <button
                        onClick={() => setTab('profile')}
                        className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${tab === 'profile' ? 'bg-purple-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                    >
                        👤 Profil
                    </button>
                </div>

                {tab === 'links' && (
                    <div className="space-y-6">
                        {/* Add link form */}
                        <form onSubmit={addLink} className="glass-strong rounded-2xl p-6">
                            <h3 className="font-bold mb-4">Yeni Link Ekle</h3>
                            <div className="flex flex-col sm:flex-row gap-3">
                                <div className="relative">
                                    <button
                                        type="button"
                                        onClick={() => setShowIconPicker(!showIconPicker)}
                                        className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-xl hover:bg-white/10 transition-colors"
                                    >
                                        {newIcon}
                                    </button>
                                    {showIconPicker && (
                                        <div className="absolute top-14 left-0 z-20 grid grid-cols-4 gap-1 p-2 glass-strong rounded-xl">
                                            {ICONS.map(icon => (
                                                <button key={icon} type="button" onClick={() => { setNewIcon(icon); setShowIconPicker(false); }}
                                                    className="w-10 h-10 rounded-lg hover:bg-white/10 flex items-center justify-center text-lg transition-colors">
                                                    {icon}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <input
                                    type="text"
                                    value={newTitle}
                                    onChange={(e) => setNewTitle(e.target.value)}
                                    placeholder="Başlık (örn: Instagram)"
                                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none text-white placeholder-gray-600 focus:border-purple-500/50"
                                    required
                                />
                                <input
                                    type="text"
                                    value={newUrl}
                                    onChange={(e) => setNewUrl(e.target.value)}
                                    placeholder="URL (örn: instagram.com/tolga)"
                                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none text-white placeholder-gray-600 focus:border-purple-500/50"
                                    required
                                />
                                <button type="submit" className="px-6 py-3 font-semibold bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl hover:from-purple-500 hover:to-blue-500 transition-all whitespace-nowrap">
                                    + Ekle
                                </button>
                            </div>
                        </form>

                        {/* Links list */}
                        <div className="space-y-3">
                            {links.map((link) => (
                                <div key={link.id} className="glass rounded-2xl p-5 group">
                                    {editingId === link.id ? (
                                        <div className="flex flex-col sm:flex-row gap-3">
                                            <div className="relative">
                                                <button type="button" onClick={() => setShowEditIconPicker(!showEditIconPicker)}
                                                    className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-xl hover:bg-white/10">
                                                    {editIcon}
                                                </button>
                                                {showEditIconPicker && (
                                                    <div className="absolute top-14 left-0 z-20 grid grid-cols-4 gap-1 p-2 glass-strong rounded-xl">
                                                        {ICONS.map(icon => (
                                                            <button key={icon} type="button" onClick={() => { setEditIcon(icon); setShowEditIconPicker(false); }}
                                                                className="w-10 h-10 rounded-lg hover:bg-white/10 flex items-center justify-center text-lg">
                                                                {icon}
                                                            </button>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                            <input value={editTitle} onChange={(e) => setEditTitle(e.target.value)}
                                                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none text-white focus:border-purple-500/50" />
                                            <input value={editUrl} onChange={(e) => setEditUrl(e.target.value)}
                                                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none text-white focus:border-purple-500/50" />
                                            <button onClick={() => saveEdit(link.id)} className="px-5 py-3 bg-green-600 hover:bg-green-500 rounded-xl font-semibold transition-colors">✓</button>
                                            <button onClick={() => setEditingId(null)} className="px-5 py-3 bg-gray-700 hover:bg-gray-600 rounded-xl font-semibold transition-colors">✕</button>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-4">
                                            <span className="text-2xl">{link.icon}</span>
                                            <div className="flex-1 min-w-0">
                                                <div className="font-semibold truncate">{link.title}</div>
                                                <div className="text-sm text-gray-500 truncate">{link.url}</div>
                                            </div>
                                            <div className="text-sm text-purple-400 font-medium whitespace-nowrap">
                                                {link.clicks} tık
                                            </div>
                                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => { setEditingId(link.id); setEditTitle(link.title); setEditUrl(link.url); setEditIcon(link.icon); }}
                                                    className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                                                >✏️</button>
                                                <button onClick={() => removeLink(link.id)}
                                                    className="p-2 rounded-lg hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-colors"
                                                >🗑️</button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                            {links.length === 0 && (
                                <div className="text-center py-16 text-gray-500">
                                    <div className="text-5xl mb-4">🔗</div>
                                    <p className="font-medium">Henüz link eklemedin</p>
                                    <p className="text-sm mt-1">Yukarıdaki formu kullanarak ilk linkini ekle!</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {tab === 'profile' && (
                    <div className="glass-strong rounded-2xl p-8 space-y-6">
                        <h3 className="text-xl font-bold">Profil Ayarları</h3>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Görünen İsim</label>
                            <input
                                value={displayName}
                                onChange={(e) => setDisplayName(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none text-white placeholder-gray-600 focus:border-purple-500/50"
                                placeholder="Tolga"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Bio</label>
                            <textarea
                                value={bio}
                                onChange={(e) => setBio(e.target.value)}
                                rows={3}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none text-white placeholder-gray-600 focus:border-purple-500/50 resize-none"
                                placeholder="Kısa biyografi..."
                                maxLength={160}
                            />
                            <div className="text-xs text-gray-600 mt-1">{bio.length}/160</div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-3">Tema</label>
                            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                                {THEMES.map(t => (
                                    <button
                                        key={t.id}
                                        onClick={() => setTheme(t.id)}
                                        className={`p-3 rounded-xl border-2 transition-all ${theme === t.id ? 'border-purple-500 scale-105' : 'border-transparent hover:border-white/20'}`}
                                    >
                                        <div className={`w-full h-8 rounded-lg bg-gradient-to-r ${t.color} mb-2`} />
                                        <div className="text-xs text-center">{t.name}</div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button
                            onClick={saveProfile}
                            disabled={saving}
                            className="px-8 py-3 font-bold bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl hover:from-purple-500 hover:to-blue-500 transition-all shadow-lg shadow-purple-500/25 disabled:opacity-50"
                        >
                            {saving ? 'Kaydediliyor...' : 'Kaydet'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
