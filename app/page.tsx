"use client";
import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import KoreaMap, { type Destination } from "@/components/KoreaMap";
import OptionsPanel, { type TravelOptions } from "@/components/OptionsPanel";
import CourseCard from "@/components/CourseCard";

export default function Home() {
  const [isThrown, setIsThrown] = useState(false);
  const [landed, setLanded] = useState<Destination | null>(null);
  const [courseData, setCourseData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState<TravelOptions>({ mode: "random" });
  const [destDetail, setDestDetail] = useState<any>(null);

  const handleLand = useCallback(async (dest: Destination) => {
  setLanded(dest);
  setLoading(true);
  try {
    const res = await fetch(`/api/destination?name=${encodeURIComponent(dest.name)}`);
    const data = await res.json();
    setDestDetail(data);
  } catch {
    setDestDetail(null);
  } finally {
    setLoading(false);
  }
}, []);

  const handleReset = useCallback(() => {
    setIsThrown(false);
    setLanded(null);
    setCourseData(null);
    setLoading(false);
    setDestDetail(null);
  }, []);

  return (
    <main style={{ minHeight: "100vh", position: "relative", zIndex: 1 }}>
      <div style={{
        maxWidth: "1100px",
        margin: "0 auto",
        padding: "40px 24px",
        display: "grid",
        gridTemplateColumns: "1fr 420px",
        gap: "32px",
        alignItems: "start",
      }}>

        {/* Left: Map */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ marginBottom: "24px" }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
              <span style={{ fontSize: "28px" }}>🎯</span>
              <h1 style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(32px, 4.5vw, 54px)",
                fontWeight: 400,
                color: "var(--text-primary)",
                margin: 0,
                letterSpacing: "-0.02em",
                lineHeight: 1.15,
              }}>
                다트 여행, 오늘은 어디로?
              </h1>
            </div>
            <p style={{
              fontSize: "15px",
              color: "var(--text-muted)",
              fontFamily: "var(--font-body)",
              fontWeight: 300,
              margin: 0,
            }}>
              랜덤 국내 여행지 추천 — 지도를 클릭해보세요
            </p>
          </motion.div>

          <div style={{
            background: "#ffffff",
            borderRadius: "20px",
            border: "1px solid var(--border)",
            padding: "16px",
            boxShadow: "0 4px 32px rgba(0,0,0,0.08)",
          }}>
            <KoreaMap
              onLand={handleLand}
              isThrown={isThrown}
              setIsThrown={(v) => { setIsThrown(v); if (!v) handleReset(); }}
            />
          </div>

          <AnimatePresence>
            {landed && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                style={{ marginTop: "12px", textAlign: "center" }}
              >
                <button
                  onClick={handleReset}
                  style={{
                    padding: "10px 28px",
                    borderRadius: "8px",
                    border: "1px solid var(--border)",
                    background: "#ffffff",
                    color: "var(--text-muted)",
                    fontSize: "13px",
                    fontFamily: "var(--font-body)",
                    cursor: "pointer",
                    transition: "all 0.18s",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--accent)"; e.currentTarget.style.color = "var(--accent)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--text-muted)"; }}
                >
                  🎯 다시 던지기
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right: Panel */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px", paddingTop: "84px" }}>
          <AnimatePresence>
            {!landed && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
              >
                <OptionsPanel options={options} onChange={setOptions} />
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {!landed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{
                  background: "#ffffff",
                  border: "1px solid var(--border)",
                  borderRadius: "12px",
                  padding: "16px 20px",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
                }}
              >
                <p style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "10px",
                  color: "var(--text-light)",
                  letterSpacing: "0.12em",
                  marginBottom: "12px",
                }}>HOW TO USE</p>
                {[
                  "지도 아무 곳이나 클릭",
                  "다트가 날아가 여행지 결정",
                  "여행지 정보와 사진 제공",
                ].map((t, i) => (
                  <div key={i} style={{ display: "flex", gap: "10px", alignItems: "center", marginBottom: "8px" }}>
                    <span style={{
                      width: "18px", height: "18px",
                      borderRadius: "50%",
                      background: "rgba(232,93,38,0.1)",
                      border: "1px solid rgba(232,93,38,0.3)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "10px", color: "var(--accent)",
                      fontFamily: "var(--font-mono)",
                      flexShrink: 0,
                    }}>{i + 1}</span>
                    <span style={{ fontSize: "13px", color: "var(--text-muted)" }}>{t}</span>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {landed && (
              <CourseCard
  destination={landed}
  destDetail={destDetail}
  loading={loading}
/>
            )}
          </AnimatePresence>
        </div>

      </div>
    </main>
  );
}
