export interface Region {
  code: string;
  name: string;
  lat: number;
  lng: number;
}

// 17개 광역시도 대표 좌표(시청/도청 기준)
export const REGIONS: Region[] = [
  { code: 'seoul', name: '서울', lat: 37.5665, lng: 126.978 },
  { code: 'incheon', name: '인천', lat: 37.4563, lng: 126.7052 },
  { code: 'gyeonggi', name: '경기', lat: 37.4138, lng: 127.5183 },
  { code: 'gangwon', name: '강원', lat: 37.8228, lng: 128.1555 },
  { code: 'chungbuk', name: '충북', lat: 36.6357, lng: 127.4917 },
  { code: 'chungnam', name: '충남', lat: 36.5184, lng: 126.8 },
  { code: 'daejeon', name: '대전', lat: 36.3504, lng: 127.3845 },
  { code: 'sejong', name: '세종', lat: 36.48, lng: 127.289 },
  { code: 'jeonbuk', name: '전북', lat: 35.7175, lng: 127.153 },
  { code: 'jeonnam', name: '전남', lat: 34.8161, lng: 126.463 },
  { code: 'gwangju', name: '광주', lat: 35.1595, lng: 126.8526 },
  { code: 'gyeongbuk', name: '경북', lat: 36.4919, lng: 128.8889 },
  { code: 'gyeongnam', name: '경남', lat: 35.4606, lng: 128.2132 },
  { code: 'daegu', name: '대구', lat: 35.8714, lng: 128.6014 },
  { code: 'ulsan', name: '울산', lat: 35.5384, lng: 129.3114 },
  { code: 'busan', name: '부산', lat: 35.1796, lng: 129.0756 },
  { code: 'jeju', name: '제주', lat: 33.4996, lng: 126.5312 },
];

// 왕복 이동을 감안했을 때 당일치기로 무리 없는 편도 직선거리 기준(km)
export const DAY_TRIP_MAX_KM = 130;

// 두 좌표 사이 직선거리(km) — Haversine 공식
export function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
