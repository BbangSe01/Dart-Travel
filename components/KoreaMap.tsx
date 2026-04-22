'use client';
import { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as d3 from 'd3';
import { DESTINATIONS, type Destination } from '@/data/destinations-client';

export type { Destination };

interface DartPos {
  x: number;
  y: number;
}
interface TrailPoint {
  x: number;
  y: number;
  id: number;
}

interface Props {
  onLand: (dest: Destination) => void;
  isThrown: boolean;
  setIsThrown: (v: boolean) => void;
}

const WIDTH = 500;
const HEIGHT = 600;

export default function KoreaMap({ onLand, isThrown, setIsThrown }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [dartPos, setDartPos] = useState<DartPos | null>(null);
  const [dartAngle, setDartAngle] = useState(0);
  const [trail, setTrail] = useState<TrailPoint[]>([]);
  const [landed, setLanded] = useState<Destination | null>(null);
  const [ripple, setRipple] = useState(false);
  const [paths, setPaths] = useState<{ d: string; name: string }[]>([]);
  const [isReady, setIsReady] = useState(false);
  const [tooltip, setTooltip] = useState<{ dest: Destination; x: number; y: number } | null>(null);
  const [pinPositions, setPinPositions] = useState<Map<string, { x: number; y: number }>>(new Map());

  const projectionRef = useRef<d3.GeoProjection | null>(null);
  const animFrameRef = useRef<number>(0);

  // 위경도 → SVG 좌표 변환
  function project(lat: number, lng: number): { x: number; y: number } | null {
    if (!projectionRef.current) return null;
    const result = projectionRef.current([lng, lat]);
    if (!result) return null;
    return { x: result[0], y: result[1] };
  }

  // GeoJSON 로드
  useEffect(() => {
    fetch('/korea.json')
      .then(r => r.json())
      .then(geoData => {
        // 한국 전체를 500x600 안에 꽉 차도록 자동으로 스케일과 위치 계산
        const projection = d3.geoMercator().fitSize([WIDTH, HEIGHT], geoData);
        projectionRef.current = projection;
        // 도/시 17개의 경계 좌표를 SVG path 문자열로 반환
        const pathGen = d3.geoPath().projection(projection);
        const rendered = geoData.features.map((f: any) => ({
          d: pathGen(f) ?? '',
          name: f.properties?.CTP_KOR_NM ?? '',
        }));
        setPaths(rendered);

        // 핀 좌표 미리 계산
        const positions = new Map<string, { x: number; y: number }>();
        DESTINATIONS.forEach(dest => {
          const result = projection([dest.lng, dest.lat]);
          if (result) positions.set(dest.name, { x: result[0], y: result[1] });
        });
        setPinPositions(positions);
        // 지도 렌더링 준비 완료
        setIsReady(true);
      });
  }, []);

  // 다트 착지 후 파동
  const ripplePos = ripple && landed ? (pinPositions.get(landed.name) ?? null) : null;

  function handleClick() {
    if (isThrown) return;

    const dest = DESTINATIONS[Math.floor(Math.random() * DESTINATIONS.length)];
    const destPos = project(dest.lat, dest.lng);
    if (!destPos) return;

    setIsThrown(true);
    setLanded(null);
    setTrail([]);
    setTooltip(null);

    const startX = WIDTH + 60;
    const startY = -40;
    const endX = destPos.x;
    const endY = destPos.y;
    const ctrlX = (startX + endX) / 2 - 40;
    const ctrlY = Math.min(startY, endY) - 80;

    const duration = 650;
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
        setTrail(prev => [...prev.slice(-12), { x, y, id: Date.now() + Math.random() }]);
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
  }

  return (
    <div className="relative w-full select-none">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className={`w-full ${!isThrown ? 'cursor-crosshair' : 'cursor-default'}`}
        onClick={handleClick}
      >
        {/* 바다 배경 */}
        <rect width={WIDTH} height={HEIGHT} fill="#daeaf5" />

        {/* 그리드 */}
        {[100, 200, 300, 400].map(v => (
          <g key={`grid-${v}`}>
            <line x1={v} y1="0" x2={v} y2={HEIGHT} stroke="rgba(0,0,0,0.03)" strokeWidth="1" />
            <line x1="0" y1={v} x2={WIDTH} y2={v} stroke="rgba(0,0,0,0.03)" strokeWidth="1" />
          </g>
        ))}

        {/* 도 경계 */}
        {paths.map((p, i) => (
          <path key={i} d={p.d} fill="#c8ddb8" stroke="#a8c496" strokeWidth="1" />
        ))}

        {/* 여행지 핀 */}
        {isReady &&
          DESTINATIONS.map(dest => {
            const pos = pinPositions.get(dest.name);
            if (!pos) return null;
            const isLanded = landed?.name === dest.name;
            return (
              <g
                key={dest.name}
                style={{ cursor: 'default' }}
                onMouseEnter={() => !isThrown && setTooltip({ dest, x: pos.x, y: pos.y })}
                onMouseLeave={() => setTooltip(null)}
              >
                {isLanded && (
                  <circle cx={pos.x} cy={pos.y} r="12" fill="none" stroke="#e85d26" strokeWidth="1.5" opacity="0.5" />
                )}
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={isLanded ? 6 : 4}
                  fill={isLanded ? '#e85d26' : 'rgba(232,93,38,0.5)'}
                  stroke="white"
                  strokeWidth={isLanded ? '2' : '1'}
                />
              </g>
            );
          })}

        {/* 툴팁 */}
        {tooltip &&
          !isThrown &&
          (() => {
            const { dest, x, y } = tooltip;
            const tipW = 140;
            const tipH = 38;
            const tipX = Math.min(Math.max(x - tipW / 2, 8), WIDTH - tipW - 8);
            const tipY = Math.max(y - tipH - 12, 8);
            return (
              <g style={{ pointerEvents: 'none' }}>
                <rect
                  x={tipX}
                  y={tipY}
                  width={tipW}
                  height={tipH}
                  rx="6"
                  fill="white"
                  stroke="rgba(0,0,0,0.1)"
                  strokeWidth="0.5"
                  style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }}
                />
                <text
                  x={tipX + tipW / 2}
                  y={tipY + 14}
                  textAnchor="middle"
                  fontSize="12"
                  fontWeight="500"
                  fill="#111111"
                >
                  {dest.name}
                </text>
                <text x={tipX + tipW / 2} y={tipY + 28} textAnchor="middle" fontSize="10" fill="#6b7280">
                  {dest.tag}
                </text>
              </g>
            );
          })()}

        {/* 다트 잔상 */}
        {trail.map((pt, i) => (
          <circle
            key={pt.id}
            cx={pt.x}
            cy={pt.y}
            r={2 * (i / trail.length)}
            fill="#e85d26"
            opacity={(i / trail.length) * 0.5}
          />
        ))}

        {/* 다트 */}
        {dartPos && (
          <g transform={`translate(${dartPos.x},${dartPos.y}) rotate(${dartAngle})`}>
            <line x1="-18" y1="0" x2="6" y2="0" stroke="#d4a96a" strokeWidth="2.5" strokeLinecap="round" />
            <polygon points="6,0 0,-2.5 0,2.5" fill="#c8a876" />
            <path d="M-18,0 L-13,-7 L-11,0Z" fill="#e85d26" opacity="0.9" />
            <path d="M-18,0 L-13,7 L-11,0Z" fill="#f97316" opacity="0.9" />
          </g>
        )}

        {/* 착지 파동 */}
        {ripple && ripplePos && (
          <>
            <circle cx={ripplePos.x} cy={ripplePos.y} r="6" fill="none" stroke="#e85d26" strokeWidth="2" opacity="0.8">
              <animate attributeName="r" from="6" to="30" dur="0.7s" fill="freeze" />
              <animate attributeName="opacity" from="0.8" to="0" dur="0.7s" fill="freeze" />
            </circle>
            <circle cx={ripplePos.x} cy={ripplePos.y} r="3" fill="none" stroke="#f97316" strokeWidth="1.5">
              <animate attributeName="r" from="3" to="18" dur="0.5s" begin="0.1s" fill="freeze" />
              <animate attributeName="opacity" from="0.6" to="0" dur="0.5s" begin="0.1s" fill="freeze" />
            </circle>
          </>
        )}
      </svg>

      {/* 클릭 힌트 */}
      <AnimatePresence>
        {!isThrown && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="absolute bottom-4 left-1/2 -translate-x-1/2 pointer-events-none"
          >
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                color: '#6b7280',
                background: 'rgba(255,255,255,0.9)',
                padding: '4px 14px',
                borderRadius: '20px',
                border: '1px solid rgba(0,0,0,0.1)',
                letterSpacing: '0.05em',
              }}
            >
              CLICK TO THROW
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
