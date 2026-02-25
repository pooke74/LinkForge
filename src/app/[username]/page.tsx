import { notFound } from 'next/navigation';
import { getUserByUsername, getLinksByUserId } from '@/lib/db';
import { getTheme } from '@/lib/themes';
import type { Metadata } from 'next';
import ProfileLinks from './ProfileLinks';

interface PageProps {
    params: Promise<{ username: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { username } = await params;
    const user = getUserByUsername(username);
    if (!user) return { title: 'Kullanıcı bulunamadı' };

    const name = user.display_name || `@${user.username}`;
    return {
        title: `${name} | LinkForge`,
        description: user.bio || `${name} - LinkForge sayfası`,
        openGraph: {
            title: `${name} | LinkForge`,
            description: user.bio || `${name} - Tüm linkleri tek sayfada`,
        },
    };
}

export default async function UserProfilePage({ params }: PageProps) {
    const { username } = await params;

    // Reserved routes that should not be treated as usernames
    const reserved = ['api', 'dashboard', 'login', 'register', 'settings', 'about', 'contact', 'help', 'pricing', 'blog'];
    if (reserved.includes(username)) {
        notFound();
    }

    const user = getUserByUsername(username);
    if (!user) notFound();

    const links = getLinksByUserId(user.id).filter(l => l.active);
    const theme = getTheme(user.theme);
    const name = user.display_name || `@${user.username}`;

    return (
        <div className={`min-h-screen ${theme.bg} flex flex-col items-center px-4 py-12`}>
            {/* Profile header */}
            <div className="animate-slide-up flex flex-col items-center mb-8">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-4xl mb-4 shadow-xl">
                    {user.avatar_url ? (
                        <img src={user.avatar_url} alt={name} className="w-full h-full rounded-full object-cover" />
                    ) : (
                        name.charAt(0).toUpperCase()
                    )}
                </div>
                <h1 className={`text-2xl font-black ${theme.text}`}>{name}</h1>
                <p className={`text-sm mt-1 ${theme.textSecondary}`}>@{user.username}</p>
                {user.bio && (
                    <p className={`text-sm mt-3 max-w-sm text-center ${theme.textSecondary}`}>
                        {user.bio}
                    </p>
                )}
            </div>

            {/* Links */}
            <div className="w-full max-w-lg space-y-3">
                <ProfileLinks links={links} theme={theme} />
            </div>

            {/* Footer */}
            <div className="mt-12 animate-fade-in" style={{ animationDelay: '0.5s' }}>
                <a href="/" className={`text-xs ${theme.textSecondary} opacity-60 hover:opacity-100 transition-opacity flex items-center gap-1`}>
                    Powered by <span className={`font-bold ${theme.accent}`}>LinkForge</span>
                </a>
            </div>
        </div>
    );
}
