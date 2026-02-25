import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { updateUserProfile } from '@/lib/db';

export async function PUT(request: NextRequest) {
    const user = await getSession();
    if (!user) return NextResponse.json({ error: 'Giriş yapmalısınız' }, { status: 401 });

    const { displayName, bio, avatarUrl, theme } = await request.json();

    updateUserProfile(
        user.id,
        displayName ?? user.display_name,
        bio ?? user.bio,
        avatarUrl ?? user.avatar_url,
        theme ?? user.theme
    );

    return NextResponse.json({ success: true });
}
