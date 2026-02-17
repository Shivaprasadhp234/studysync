import { NextResponse } from 'next/server';
import { verifySupabaseConnection } from '@/lib/verify-connection';

export async function GET() {
    const status = await verifySupabaseConnection();
    return NextResponse.json(status);
}
