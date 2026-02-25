import fs from 'fs';
import path from 'path';

// Use /tmp on Vercel (serverless), or local file for dev
const DATA_DIR = process.env.VERCEL ? '/tmp' : process.cwd();
const DB_FILE = path.join(DATA_DIR, 'linkforge-data.json');

interface DbData {
    users: UserRow[];
    links: LinkRow[];
    analytics: AnalyticsRow[];
}

function readDb(): DbData {
    try {
        if (fs.existsSync(DB_FILE)) {
            const raw = fs.readFileSync(DB_FILE, 'utf-8');
            return JSON.parse(raw);
        }
    } catch {
        // corrupted file, start fresh
    }
    return { users: [], links: [], analytics: [] };
}

function writeDb(data: DbData): void {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

// ---- User operations ----
export function createUser(id: string, username: string, email: string, passwordHash: string) {
    const data = readDb();
    data.users.push({
        id,
        username,
        email,
        password_hash: passwordHash,
        display_name: '',
        bio: '',
        avatar_url: '',
        theme: 'midnight',
        created_at: new Date().toISOString(),
    });
    writeDb(data);
}

export function getUserByUsername(username: string): UserRow | undefined {
    const data = readDb();
    return data.users.find(u => u.username === username);
}

export function getUserByEmail(email: string): UserRow | undefined {
    const data = readDb();
    return data.users.find(u => u.email === email);
}

export function getUserById(id: string): UserRow | undefined {
    const data = readDb();
    return data.users.find(u => u.id === id);
}

export function updateUserProfile(id: string, displayName: string, bio: string, avatarUrl: string, theme: string) {
    const data = readDb();
    const user = data.users.find(u => u.id === id);
    if (user) {
        user.display_name = displayName;
        user.bio = bio;
        user.avatar_url = avatarUrl;
        user.theme = theme;
        writeDb(data);
    }
}

// ---- Link operations ----
export function createLink(id: string, userId: string, title: string, url: string, icon: string) {
    const data = readDb();
    const userLinks = data.links.filter(l => l.user_id === userId);
    const maxPos = userLinks.length > 0 ? Math.max(...userLinks.map(l => l.position)) + 1 : 0;
    data.links.push({
        id,
        user_id: userId,
        title,
        url,
        icon,
        position: maxPos,
        clicks: 0,
        active: 1,
        created_at: new Date().toISOString(),
    });
    writeDb(data);
}

export function getLinksByUserId(userId: string): LinkRow[] {
    const data = readDb();
    return data.links
        .filter(l => l.user_id === userId)
        .sort((a, b) => a.position - b.position);
}

export function updateLink(id: string, userId: string, title: string, url: string, icon: string, active: boolean) {
    const data = readDb();
    const link = data.links.find(l => l.id === id && l.user_id === userId);
    if (link) {
        link.title = title;
        link.url = url;
        link.icon = icon;
        link.active = active ? 1 : 0;
        writeDb(data);
    }
}

export function deleteLink(id: string, userId: string) {
    const data = readDb();
    data.links = data.links.filter(l => !(l.id === id && l.user_id === userId));
    writeDb(data);
}

export function incrementLinkClicks(id: string) {
    const data = readDb();
    const link = data.links.find(l => l.id === id);
    if (link) {
        link.clicks += 1;
        writeDb(data);
    }
}

export function recordClick(linkId: string, referrer: string, country: string) {
    incrementLinkClicks(linkId);
    const data = readDb();
    data.analytics.push({
        id: data.analytics.length + 1,
        link_id: linkId,
        referrer,
        country,
        clicked_at: new Date().toISOString(),
    });
    writeDb(data);
}

export function getTotalClicks(userId: string): number {
    const data = readDb();
    return data.links
        .filter(l => l.user_id === userId)
        .reduce((sum, l) => sum + l.clicks, 0);
}

export function getTotalUsers(): number {
    const data = readDb();
    return data.users.length;
}

// ---- Types ----
export interface UserRow {
    id: string;
    username: string;
    email: string;
    password_hash: string;
    display_name: string;
    bio: string;
    avatar_url: string;
    theme: string;
    created_at: string;
}

export interface LinkRow {
    id: string;
    user_id: string;
    title: string;
    url: string;
    icon: string;
    position: number;
    clicks: number;
    active: number;
    created_at: string;
}

interface AnalyticsRow {
    id: number;
    link_id: string;
    referrer: string;
    country: string;
    clicked_at: string;
}
