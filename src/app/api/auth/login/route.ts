import { NextRequest, NextResponse } from 'next/server';
import { getUserByEmail } from '@/lib/db';
import { verifyPassword } from '@/lib/auth';

export async function POST(request: NextRequest) {
    try {
        const { email, password } = await request.json();

        if (!email || !password) {
            return NextResponse.json({ error: 'Email ve şifre gerekli' }, { status: 400 });
        }

        const user = getUserByEmail(email);
        if (!user) {
            return NextResponse.json({ error: 'Email veya şifre hatalı' }, { status: 401 });
        }

        if (!verifyPassword(password, user.password_hash)) {
            return NextResponse.json({ error: 'Email veya şifre hatalı' }, { status: 401 });
        }

        const response = NextResponse.json({ success: true, username: user.username });
        response.cookies.set('linkforge_session', user.id, {
            httpOnly: true,
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 30,
            path: '/',
        });

        return response;
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
    }
}
