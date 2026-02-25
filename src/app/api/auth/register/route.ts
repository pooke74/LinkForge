import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { createUser, getUserByEmail, getUserByUsername } from '@/lib/db';
import { hashPassword } from '@/lib/auth';

export async function POST(request: NextRequest) {
    try {
        const { username, email, password } = await request.json();

        if (!username || !email || !password) {
            return NextResponse.json({ error: 'Tüm alanları doldurun' }, { status: 400 });
        }

        if (username.length < 3 || username.length > 30) {
            return NextResponse.json({ error: 'Kullanıcı adı 3-30 karakter olmalı' }, { status: 400 });
        }

        if (!/^[a-z0-9_-]+$/.test(username)) {
            return NextResponse.json({ error: 'Kullanıcı adı sadece küçük harf, rakam, _ ve - içerebilir' }, { status: 400 });
        }

        if (password.length < 6) {
            return NextResponse.json({ error: 'Şifre en az 6 karakter olmalı' }, { status: 400 });
        }

        // Check existing
        const existingEmail = getUserByEmail(email);
        if (existingEmail) {
            return NextResponse.json({ error: 'Bu email zaten kullanılıyor' }, { status: 400 });
        }

        const existingUsername = getUserByUsername(username);
        if (existingUsername) {
            return NextResponse.json({ error: 'Bu kullanıcı adı zaten alınmış' }, { status: 400 });
        }

        // Reserved usernames
        const reserved = ['admin', 'api', 'dashboard', 'login', 'register', 'settings', 'about', 'contact', 'help', 'pricing', 'blog'];
        if (reserved.includes(username)) {
            return NextResponse.json({ error: 'Bu kullanıcı adı kullanılamaz' }, { status: 400 });
        }

        const id = uuidv4();
        const passwordHash = hashPassword(password);
        createUser(id, username, email, passwordHash);

        // Set session cookie
        const response = NextResponse.json({ success: true, username });
        response.cookies.set('linkforge_session', id, {
            httpOnly: true,
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 30, // 30 days
            path: '/',
        });

        return response;
    } catch (error) {
        console.error('Register error:', error);
        return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
    }
}
