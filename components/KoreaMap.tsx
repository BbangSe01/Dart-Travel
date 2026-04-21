"use client";
import { useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

export interface Destination {
  name: string;
  tag: string;
  emoji: string;
  x: number;
  y: number;
}

export const DESTINATIONS: Destination[] = [
  { name: "서울 종로·북촌", tag: "궁궐 + 한옥마을", emoji: "🏯", x: 37, y: 22 },
  { name: "서울 홍대·연남동", tag: "카페 + 인디문화", emoji: "🎨", x: 35, y: 23 },
  { name: "서울 성수동", tag: "감성 + 팝업", emoji: "🏭", x: 39, y: 23 },
  { name: "서울 을지로", tag: "레트로 + 술집", emoji: "🍺", x: 37, y: 24 },
  { name: "서울 한강공원", tag: "피크닉 + 야경", emoji: "🌉", x: 36, y: 25 },
  { name: "수원 화성", tag: "역사 + 야경", emoji: "🏰", x: 34, y: 30 },
  { name: "가평 남이섬", tag: "자연 + 낭만", emoji: "🍁", x: 48, y: 20 },
  { name: "가평 자라섬", tag: "캠핑 + 재즈", emoji: "🎷", x: 49, y: 19 },
  { name: "양평", tag: "강변 + 전원카페", emoji: "☕", x: 46, y: 24 },
  { name: "파주 헤이리", tag: "예술마을 + 카페", emoji: "🖼️", x: 32, y: 19 },
  { name: "강화도", tag: "역사 + 갯벌", emoji: "🦀", x: 28, y: 27 },
  { name: "인천 차이나타운", tag: "짜장면 + 이국감성", emoji: "🥢", x: 29, y: 28 },
  { name: "인천 을왕리", tag: "바다 + 낙조", emoji: "🌅", x: 27, y: 29 },
  { name: "용인 에버랜드", tag: "테마파크", emoji: "🎡", x: 37, y: 32 },
  { name: "춘천", tag: "닭갈비 + 낭만", emoji: "🍗", x: 50, y: 20 },
  { name: "강릉", tag: "바다 + 커피", emoji: "☕", x: 64, y: 27 },
  { name: "속초", tag: "설악산 + 바다", emoji: "🏔️", x: 65, y: 18 },
  { name: "양양", tag: "서핑 + 낙산사", emoji: "🏄", x: 65, y: 22 },
  { name: "평창", tag: "자연 + 스키", emoji: "⛷️", x: 57, y: 27 },
  { name: "정선", tag: "레일바이크 + 카지노", emoji: "🚵", x: 60, y: 30 },
  { name: "태백", tag: "고원 + 석탄역사", emoji: "⛏️", x: 62, y: 33 },
  { name: "영월", tag: "동강 + 별마로천문대", emoji: "🔭", x: 58, y: 32 },
  { name: "인제 원대리 자작나무숲", tag: "자작나무 + 힐링", emoji: "🌲", x: 59, y: 18 },
  { name: "고성 화진포", tag: "석호 + 해변", emoji: "🏖️", x: 66, y: 14 },
  { name: "삼척 해신당공원", tag: "해안 + 이색명소", emoji: "🗿", x: 66, y: 35 },
  { name: "단양", tag: "도담삼봉 + 마늘", emoji: "🧄", x: 54, y: 36 },
  { name: "제천 청풍호", tag: "호수 + 드라이브", emoji: "🚗", x: 54, y: 33 },
  { name: "충주 탄금호", tag: "자전거 + 호수", emoji: "🚴", x: 50, y: 34 },
  { name: "공주 무령왕릉", tag: "백제 + 역사", emoji: "🏛️", x: 42, y: 43 },
  { name: "부여", tag: "백제문화 + 연꽃", emoji: "🌸", x: 43, y: 47 },
  { name: "태안 해변", tag: "해수욕 + 꽃지", emoji: "🌻", x: 30, y: 43 },
  { name: "서산 해미읍성", tag: "역사 + 성곽", emoji: "🏯", x: 31, y: 42 },
  { name: "보령 머드축제", tag: "갯벌 + 해변", emoji: "🌊", x: 33, y: 50 },
  { name: "아산 온양온천", tag: "온천 + 힐링", emoji: "♨️", x: 37, y: 40 },
  { name: "전주 한옥마을", tag: "한옥 + 비빔밥", emoji: "🍱", x: 42, y: 62 },
  { name: "군산", tag: "근대역사 + 빵", emoji: "🍞", x: 36, y: 59 },
  { name: "남원 광한루", tag: "춘향전 + 한옥", emoji: "🎭", x: 48, y: 68 },
  { name: "무주 덕유산", tag: "스키 + 반딧불", emoji: "✨", x: 52, y: 62 },
  { name: "진안 마이산", tag: "기암 + 탑사", emoji: "⛰️", x: 49, y: 63 },
  { name: "부안 변산반도", tag: "해변 + 채석강", emoji: "🪨", x: 35, y: 63 },
  { name: "여수", tag: "야경 + 해산물", emoji: "🦐", x: 50, y: 80 },
  { name: "순천 낙안읍성", tag: "민속마을 + 갈대", emoji: "🌾", x: 51, y: 78 },
  { name: "담양 죽녹원", tag: "대나무 + 메타세콰이어", emoji: "🎋", x: 45, y: 72 },
  { name: "목포", tag: "항구 + 낙지", emoji: "🐙", x: 35, y: 79 },
  { name: "보성 녹차밭", tag: "녹차 + 힐링", emoji: "🍵", x: 49, y: 77 },
  { name: "해남 땅끝마을", tag: "최남단 + 일몰", emoji: "🌄", x: 40, y: 85 },
  { name: "강진 다산초당", tag: "다산 + 청자", emoji: "🏺", x: 44, y: 82 },
  { name: "곡성 기차마을", tag: "증기기차 + 장미", emoji: "🌹", x: 48, y: 73 },
  { name: "구례 화엄사", tag: "지리산 + 사찰", emoji: "🛕", x: 51, y: 73 },
  { name: "신안 퍼플섬", tag: "보라색 섬 + 포토존", emoji: "💜", x: 32, y: 80 },
  { name: "완도 청산도", tag: "슬로우시티 + 바다", emoji: "🐢", x: 43, y: 87 },
  { name: "고흥 나로도", tag: "우주센터 + 해변", emoji: "🚀", x: 52, y: 82 },
  { name: "경주", tag: "역사 + 야경", emoji: "🏛️", x: 69, y: 62 },
  { name: "안동 하회마을", tag: "유네스코 + 전통", emoji: "🎭", x: 63, y: 47 },
  { name: "포항 호미곶", tag: "해돋이 + 과메기", emoji: "🌅", x: 75, y: 53 },
  { name: "울릉도", tag: "독도 + 원시자연", emoji: "🏝️", x: 88, y: 42 },
  { name: "영주 부석사", tag: "신라사찰 + 단풍", emoji: "🍂", x: 60, y: 40 },
  { name: "문경 새재", tag: "옛길 + 도자기", emoji: "🏺", x: 56, y: 43 },
  { name: "청송 주왕산", tag: "기암절벽 + 계곡", emoji: "🪨", x: 67, y: 46 },
  { name: "봉화 청량산", tag: "산악 + 은둔힐링", emoji: "🌿", x: 65, y: 40 },
  { name: "울진 왕피천", tag: "에코트레일 + 계곡", emoji: "🌊", x: 70, y: 43 },
  { name: "부산 해운대", tag: "해변 + 도시", emoji: "🏖️", x: 74, y: 72 },
  { name: "부산 감천문화마을", tag: "벽화 + 골목", emoji: "🎨", x: 72, y: 74 },
  { name: "통영", tag: "섬 + 예술", emoji: "⛵", x: 62, y: 80 },
  { name: "거제도", tag: "바다 + 포로수용소", emoji: "🌊", x: 67, y: 80 },
  { name: "남해 독일마을", tag: "이국감성 + 바다", emoji: "🌺", x: 57, y: 82 },
  { name: "하동 악양", tag: "최참판댁 + 녹차", emoji: "🍵", x: 54, y: 76 },
  { name: "합천 해인사", tag: "팔만대장경 + 가야산", emoji: "📿", x: 59, y: 70 },
  { name: "밀양 얼음골", tag: "얼음골 + 표충사", emoji: "🧊", x: 65, y: 67 },
  { name: "창녕 우포늪", tag: "생태습지 + 철새", emoji: "🦢", x: 63, y: 70 },
  { name: "사천 실안낙조", tag: "노을 + 한려수도", emoji: "🌇", x: 59, y: 78 },
  { name: "제주 한라산", tag: "트레킹 + 설경", emoji: "🏔️", x: 36, y: 99 },
  { name: "제주 성산일출봉", tag: "일출 + 유네스코", emoji: "🌄", x: 44, y: 97 },
  { name: "제주 애월", tag: "카페 + 바다뷰", emoji: "☕", x: 32, y: 97 },
  { name: "제주 우도", tag: "산호해변 + 자전거", emoji: "🚲", x: 45, y: 96 },
  { name: "제주 서귀포", tag: "폭포 + 감귤", emoji: "🍊", x: 37, y: 101 },
  { name: "제주 협재해변", tag: "에메랄드 바다", emoji: "🏝️", x: 31, y: 99 },
];

interface DartPos { x: number; y: number }
interface TrailPoint { x: number; y: number; id: number }

interface Props {
  onLand: (dest: Destination) => void;
  isThrown: boolean;
  setIsThrown: (v: boolean) => void;
}

export default function KoreaMap({ onLand, isThrown, setIsThrown }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [dartPos, setDartPos] = useState<DartPos | null>(null);
  const [dartAngle, setDartAngle] = useState(0);
  const [trail, setTrail] = useState<TrailPoint[]>([]);
  const [landed, setLanded] = useState<Destination | null>(null);
  const [ripple, setRipple] = useState(false);
  const animFrameRef = useRef<number>(0);
  const trailCounter = useRef(0);

  const handleClick = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    if (isThrown) return;

    const dest = DESTINATIONS[Math.floor(Math.random() * DESTINATIONS.length)];

    setIsThrown(true);
    setLanded(null);
    setTrail([]);

    const startX = 105;
    const startY = -10;
    const endX = dest.x;
    const endY = dest.y;
    const ctrlX = (startX + endX) / 2 - 20;
    const ctrlY = Math.min(startY, endY) - 25;

    const duration = 600;
    const startTime = performance.now();

    const animate = (now: number) => {
      const t = Math.min((now - startTime) / duration, 1);
      const ease = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

      const x = (1 - ease) * (1 - ease) * startX + 2 * (1 - ease) * ease * ctrlX + ease * ease * endX;
      const y = (1 - ease) * (1 - ease) * startY + 2 * (1 - ease) * ease * ctrlY + ease * ease * endY;

      const dx = 2 * (1 - ease) * (ctrlX - startX) + 2 * ease * (endX - ctrlX);
      const dy = 2 * (1 - ease) * (ctrlY - startY) + 2 * ease * (endY - ctrlY);
      const angle = Math.atan2(dy, dx) * (180 / Math.PI);

      setDartPos({ x, y });
      setDartAngle(angle);

      if (Math.floor(t * 20) > Math.floor(((now - 16 - startTime) / duration) * 20)) {
        trailCounter.current++;
        setTrail(prev => [...prev.slice(-12), { x, y, id: trailCounter.current }]);
      }

      if (t < 1) {
        animFrameRef.current = requestAnimationFrame(animate);
      } else {
        setDartPos({ x: endX, y: endY });
        setDartAngle(-90);
        setTrail([]);
        setRipple(true);
        setTimeout(() => setRipple(false), 800);
        setLanded(dest);
        onLand(dest);
      }
    };

    animFrameRef.current = requestAnimationFrame(animate);
  }, [isThrown, onLand, setIsThrown]);

  return (
    <div className="relative w-full select-none">
      <svg
        ref={svgRef}
        viewBox="0 0 100 110"
        className={`w-full ${!isThrown ? "cursor-crosshair" : "cursor-default"}`}
        onClick={handleClick}
      >
        <defs>
          <filter id="land-shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="1" stdDeviation="1" floodColor="#000" floodOpacity="0.15"/>
          </filter>
          <filter id="glow-filter">
            <feGaussianBlur stdDeviation="1.5" result="blur"/>
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>

        {/* Sea */}
        <rect width="100" height="110" fill="#d4e8f5"/>

        {/* Grid lines */}
        {[20,40,60,80].map(v => (
  <g key={`grid-${v}`}>
    <line x1={v} y1="0" x2={v} y2="110" stroke="rgba(0,0,0,0.04)" strokeWidth="0.3"/>
    <line x1="0" y1={v} x2="100" y2={v} stroke="rgba(0,0,0,0.04)" strokeWidth="0.3"/>
  </g>
))}

        {/* Korea mainland */}
        <path
          d="M34,5 L42,3 L52,5 L62,8 L68,14 L70,22 L68,30 L72,36 L76,42 L78,50 L76,58 L74,64 L72,70 L68,76 L62,82 L56,86 L52,90 L50,95 L48,90 L44,85 L38,80 L32,75 L28,68 L26,60 L24,52 L23,44 L22,36 L24,28 L26,20 L28,13 Z"
          fill="#c8ddb8" stroke="#a8c496" strokeWidth="0.5"
          filter="url(#land-shadow)"
        />
        <path
          d="M62,8 L68,14 L72,22 L74,30 L78,38 L80,46 L80,54 L78,62 L74,68 L70,74 L64,80 L60,84 L56,88 L52,90 L50,95 L50,90 L54,84 L58,80 L64,74 L70,68 L74,62 L76,54 L76,46 L74,38 L70,30 L68,22 L66,16 L62,10 Z"
          fill="#bdd4ab"
        />
        <path d="M26,44 L22,46 L20,52 L23,56 L26,52Z" fill="#c8ddb8" stroke="#a8c496" strokeWidth="0.3"/>
        <path d="M24,34 L20,36 L19,40 L22,42 L24,38Z" fill="#c8ddb8" stroke="#a8c496" strokeWidth="0.3"/>
        <ellipse cx="38" cy="102" rx="8" ry="4" fill="#c8ddb8" stroke="#a8c496" strokeWidth="0.4"/>

        {/* Destination pins */}
        {DESTINATIONS.map((dest) => (
          <g key={dest.name} style={{ filter: landed?.name === dest.name ? "url(#glow-filter)" : "none" }}>
            {landed?.name === dest.name && (
              <circle cx={dest.x} cy={dest.y} r="3.5"
                fill="none" stroke="#e85d26" strokeWidth="0.8" opacity="0.6"/>
            )}
            <circle
              cx={dest.x} cy={dest.y}
              r={landed?.name === dest.name ? 1.8 : 0.9}
              fill={landed?.name === dest.name ? "#e85d26" : "rgba(232,93,38,0.45)"}
            />
          </g>
        ))}

        {/* Dart trail */}
        {trail.map((pt, i) => (
          <circle key={pt.id} cx={pt.x} cy={pt.y}
            r={0.4 * (i / trail.length)}
            fill="#e85d26" opacity={(i / trail.length) * 0.6}
          />
        ))}

        {/* Dart */}
        {dartPos && (
          <g transform={`translate(${dartPos.x},${dartPos.y}) rotate(${dartAngle})`}>
            <line x1="-5" y1="0" x2="1.5" y2="0" stroke="#d4a96a" strokeWidth="0.7" strokeLinecap="round"/>
            <polygon points="1.5,0 0,-0.6 0,0.6" fill="#c8a876"/>
            <path d="M-5,0 L-3.5,-2 L-3,0Z" fill="#e85d26" opacity="0.9"/>
            <path d="M-5,0 L-3.5,2 L-3,0Z" fill="#f97316" opacity="0.9"/>
          </g>
        )}

        {/* Ripple */}
        {ripple && landed && (
          <>
            <circle cx={landed.x} cy={landed.y} r="2"
              fill="none" stroke="#e85d26" strokeWidth="0.6" opacity="0.8">
              <animate attributeName="r" from="2" to="8" dur="0.7s" fill="freeze"/>
              <animate attributeName="opacity" from="0.8" to="0" dur="0.7s" fill="freeze"/>
            </circle>
            <circle cx={landed.x} cy={landed.y} r="1"
              fill="none" stroke="#f97316" strokeWidth="0.4">
              <animate attributeName="r" from="1" to="5" dur="0.5s" begin="0.1s" fill="freeze"/>
              <animate attributeName="opacity" from="0.6" to="0" dur="0.5s" begin="0.1s" fill="freeze"/>
            </circle>
          </>
        )}
      </svg>

      {/* Click hint */}
      <AnimatePresence>
        {!isThrown && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="absolute bottom-4 left-1/2 -translate-x-1/2 pointer-events-none"
          >
            <span style={{
              fontFamily: "var(--font-mono)",
              fontSize: "11px",
              color: "#6b7280",
              background: "rgba(255,255,255,0.9)",
              padding: "4px 14px",
              borderRadius: "20px",
              border: "1px solid rgba(0,0,0,0.1)",
              letterSpacing: "0.05em",
            }}>
              CLICK TO THROW
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
