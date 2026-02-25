import { cookies } from 'next/headers';
import { getUserById, type UserRow } from './db';

// Simple token-based auth (in production, use JWT or session management)
// For MVP, we use a simple cookie with user ID

export async function getSession(): Promise<UserRow | null> {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('linkforge_session');
    if (!sessionCookie) return null;

    try {
        const userId = sessionCookie.value;
        const user = getUserById(userId);
        return user || null;
    } catch {
        return null;
    }
}

export function hashPassword(password: string): string {
    // Simple hash for MVP - in production use bcrypt
    const crypto = require('crypto');
    return crypto.createHash('sha256').update(password + 'linkforge_salt_2026').digest('hex');
}

export function verifyPassword(password: string, hash: string): boolean {
    return hashPassword(password) === hash;
}
