// Theme definitions for public profile pages
export const themes: Record<string, ThemeConfig> = {
    midnight: {
        name: 'Midnight',
        bg: 'bg-gradient-to-br from-gray-900 via-purple-950 to-gray-900',
        card: 'bg-white/10 backdrop-blur-xl border border-white/20',
        cardHover: 'hover:bg-white/20 hover:scale-[1.02] hover:shadow-lg hover:shadow-purple-500/20',
        text: 'text-white',
        textSecondary: 'text-gray-300',
        accent: 'text-purple-400',
        button: 'bg-purple-600 hover:bg-purple-500',
    },
    ocean: {
        name: 'Ocean',
        bg: 'bg-gradient-to-br from-cyan-900 via-blue-950 to-indigo-900',
        card: 'bg-white/10 backdrop-blur-xl border border-cyan-400/20',
        cardHover: 'hover:bg-white/20 hover:scale-[1.02] hover:shadow-lg hover:shadow-cyan-500/20',
        text: 'text-white',
        textSecondary: 'text-cyan-200',
        accent: 'text-cyan-400',
        button: 'bg-cyan-600 hover:bg-cyan-500',
    },
    sunset: {
        name: 'Sunset',
        bg: 'bg-gradient-to-br from-orange-900 via-red-950 to-pink-900',
        card: 'bg-white/10 backdrop-blur-xl border border-orange-400/20',
        cardHover: 'hover:bg-white/20 hover:scale-[1.02] hover:shadow-lg hover:shadow-orange-500/20',
        text: 'text-white',
        textSecondary: 'text-orange-200',
        accent: 'text-orange-400',
        button: 'bg-orange-600 hover:bg-orange-500',
    },
    forest: {
        name: 'Forest',
        bg: 'bg-gradient-to-br from-green-900 via-emerald-950 to-teal-900',
        card: 'bg-white/10 backdrop-blur-xl border border-green-400/20',
        cardHover: 'hover:bg-white/20 hover:scale-[1.02] hover:shadow-lg hover:shadow-green-500/20',
        text: 'text-white',
        textSecondary: 'text-green-200',
        accent: 'text-green-400',
        button: 'bg-green-600 hover:bg-green-500',
    },
    neon: {
        name: 'Neon',
        bg: 'bg-gradient-to-br from-black via-gray-950 to-black',
        card: 'bg-white/5 backdrop-blur-xl border border-pink-500/30',
        cardHover: 'hover:bg-pink-500/10 hover:scale-[1.02] hover:shadow-lg hover:shadow-pink-500/30',
        text: 'text-white',
        textSecondary: 'text-pink-300',
        accent: 'text-pink-500',
        button: 'bg-pink-600 hover:bg-pink-500',
    },
    minimal: {
        name: 'Minimal',
        bg: 'bg-gradient-to-br from-white via-gray-50 to-gray-100',
        card: 'bg-white border border-gray-200 shadow-sm',
        cardHover: 'hover:bg-gray-50 hover:scale-[1.02] hover:shadow-md',
        text: 'text-gray-900',
        textSecondary: 'text-gray-600',
        accent: 'text-blue-600',
        button: 'bg-gray-900 hover:bg-gray-800 text-white',
    },
};

export interface ThemeConfig {
    name: string;
    bg: string;
    card: string;
    cardHover: string;
    text: string;
    textSecondary: string;
    accent: string;
    button: string;
}

export function getTheme(themeName: string): ThemeConfig {
    return themes[themeName] || themes.midnight;
}
