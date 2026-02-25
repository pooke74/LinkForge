import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';

export async function GET() {
    const user = await getSession();
    if (!user) return NextResponse.json({ error: 'Giriş yapmalısınız' }, { status: 401 });

    return NextResponse.json({
        user: {
            id: user.id,
            username: user.username,
            email: user.email,
            display_name: user.display_name,
            bio: user.bio,
            avatar_url: user.avatar_url,
            theme: user.theme,
        }
    });
}
