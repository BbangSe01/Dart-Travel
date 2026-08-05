import { supabase } from './supabase';

export interface Destination {
  id: number;
  name: string;
  tag: string;
  emoji: string;
  reason: string;
  tip: string;
  lat: number;
  lng: number;
  season: string[];
  theme: string[];
  images: string[];
  blogs: {
    title: string;
    link: string;
    description: string;
    bloggername: string;
  }[];
}

// 목적지 이름에 맞는 데이터 return
export async function getDestinationByName(name: string): Promise<Destination | null> {
  const { data, error } = await supabase.from('destinations').select('*').eq('name', name).single();
  if (error) {
    // PGRST116: single()에서 결과가 0개일 때 발생하는 에러 코드
    if (error.code === 'PGRST116') {
      return null;
    }
    // 그 외 에러
    throw error;
  }

  return data ?? null;
}
// random 목적지 데이터 return
export async function getRandomDestination(): Promise<Destination | null> {
  const { data, error } = await supabase.rpc('get_random_destination');

  if (error || !data || data.length === 0) {
    return null;
  }

  return data[0];
}

// 필터 조건에 맞는 데이터 return
export async function getFilteredDestinations(seasons: string[], themes: string[]): Promise<Destination[]> {
  let query = supabase.from('destinations').select('*');

  if (seasons.length > 0) {
    query = query.overlaps('season', seasons);
  }
  if (themes.length > 0) {
    query = query.overlaps('theme', themes);
  }

  const { data, error } = await query;
  if (error) {
    throw error;
  }

  return data ?? [];
}
