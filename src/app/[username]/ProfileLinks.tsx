'use client';

import type { ThemeConfig } from '@/lib/themes';

interface LinkItem {
    id: string;
    title: string;
    url: string;
    icon: string;
    clicks: number;
}

interface ProfileLinksProps {
    links: LinkItem[];
    theme: ThemeConfig;
}

export default function ProfileLinks({ links, theme }: ProfileLinksProps) {
    async function handleClick(linkId: string, url: string) {
        // Track click in background
        fetch('/api/clicks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ linkId }),
        }).catch(() => { });

        // Open link
        window.open(url, '_blank', 'noopener,noreferrer');
    }

    return (
        <>
            {links.map((link, i) => (
                <button
                    key={link.id}
                    onClick={() => handleClick(link.id, link.url)}
                    className={`animate-slide-up w-full flex items-center gap-4 px-6 py-4 rounded-2xl ${theme.card} ${theme.cardHover} transition-all duration-300 cursor-pointer`}
                    style={{ animationDelay: `${0.1 + i * 0.05}s` }}
                >
                    <span className="text-xl">{link.icon}</span>
                    <span className={`font-semibold flex-1 text-left ${theme.text}`}>{link.title}</span>
                    <span className={`text-sm ${theme.textSecondary} opacity-50`}>→</span>
                </button>
            ))}
            {links.length === 0 && (
                <div className={`text-center py-12 ${theme.textSecondary}`}>
                    <p>Henüz link eklenmemiş</p>
                </div>
            )}
        </>
    );
}
