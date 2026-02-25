import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { getSession } from '@/lib/auth';
import { createLink, getLinksByUserId, updateLink, deleteLink } from '@/lib/db';

export async function GET() {
    const user = await getSession();
    if (!user) return NextResponse.json({ error: 'Giriş yapmalısınız' }, { status: 401 });

    const links = getLinksByUserId(user.id);
    return NextResponse.json({ links });
}

export async function POST(request: NextRequest) {
    const user = await getSession();
    if (!user) return NextResponse.json({ error: 'Giriş yapmalısınız' }, { status: 401 });

    const { title, url, icon } = await request.json();
    if (!title || !url) {
        return NextResponse.json({ error: 'Başlık ve URL gerekli' }, { status: 400 });
    }

    const id = uuidv4();
    createLink(id, user.id, title, url, icon || '🔗');
    const links = getLinksByUserId(user.id);
    return NextResponse.json({ success: true, links });
}

export async function PUT(request: NextRequest) {
    const user = await getSession();
    if (!user) return NextResponse.json({ error: 'Giriş yapmalısınız' }, { status: 401 });

    const { id, title, url, icon, active } = await request.json();
    if (!id) return NextResponse.json({ error: 'Link ID gerekli' }, { status: 400 });

    updateLink(id, user.id, title, url, icon || '🔗', active !== false);
    const links = getLinksByUserId(user.id);
    return NextResponse.json({ success: true, links });
}

export async function DELETE(request: NextRequest) {
    const user = await getSession();
    if (!user) return NextResponse.json({ error: 'Giriş yapmalısınız' }, { status: 401 });

    const { id } = await request.json();
    if (!id) return NextResponse.json({ error: 'Link ID gerekli' }, { status: 400 });

    deleteLink(id, user.id);
    const links = getLinksByUserId(user.id);
    return NextResponse.json({ success: true, links });
}
