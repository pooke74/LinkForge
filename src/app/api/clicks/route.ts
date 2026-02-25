import { NextRequest, NextResponse } from 'next/server';
import { recordClick } from '@/lib/db';

export async function POST(request: NextRequest) {
    try {
        const { linkId } = await request.json();
        if (!linkId) return NextResponse.json({ error: 'Link ID gerekli' }, { status: 400 });

        const referrer = request.headers.get('referer') || '';
        recordClick(linkId, referrer, '');

        return NextResponse.json({ success: true });
    } catch {
        return NextResponse.json({ error: 'Hata' }, { status: 500 });
    }
}
