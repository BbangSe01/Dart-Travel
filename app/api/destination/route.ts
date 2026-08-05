import { NextRequest, NextResponse } from 'next/server';
import { getDestinationByName, getRandomDestination } from '@/lib/destinations';

export async function GET(req: NextRequest) {
  const name = req.nextUrl.searchParams.get('name');

  if (name) {
    try {
      const result = await getDestinationByName(name);
      if (!result) {
        return NextResponse.json({ error: 'Not found' }, { status: 404 });
      }
      return NextResponse.json(result);
    } catch (err) {
      return NextResponse.json({ error: '서버 오류' }, { status: 500 });
    }
  }

  try {
    const result = await getRandomDestination();
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json({ error: '서버 오류' }, { status: 500 });
  }
}
