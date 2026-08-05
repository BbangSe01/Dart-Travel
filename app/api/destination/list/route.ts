import { NextRequest, NextResponse } from 'next/server';
import { getFilteredDestinations } from '@/lib/destinations';

export async function GET(req: NextRequest) {
  const seasons = req.nextUrl.searchParams.getAll('season');
  const themes = req.nextUrl.searchParams.getAll('theme');

  try {
    const result = await getFilteredDestinations(seasons, themes);
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json({ error: '서버 오류 ' }, { status: 500 });
  }
}
