import { NextRequest, NextResponse } from 'next/server';
import { getFilteredDestinations } from '@/lib/destinations';

export async function GET(req: NextRequest) {
  const seasons = req.nextUrl.searchParams.getAll('season');
  const themes = req.nextUrl.searchParams.getAll('theme');
  const homeLat = req.nextUrl.searchParams.get('homeLat');
  const homeLng = req.nextUrl.searchParams.get('homeLng');
  const homeCoords = homeLat && homeLng ? { lat: parseFloat(homeLat), lng: parseFloat(homeLng) } : null;

  try {
    const result = await getFilteredDestinations(seasons, themes, homeCoords);
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json({ error: '서버 오류 ' }, { status: 500 });
  }
}
