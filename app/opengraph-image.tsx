import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "다트 여행 - 랜덤 국내 여행지 추천";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#f5f3ef",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {/* 배경 장식 원 */}
        <div style={{
          position: "absolute",
          width: "500px", height: "500px",
          borderRadius: "50%",
          background: "rgba(232,93,38,0.06)",
          top: "-100px", right: "-100px",
          display: "flex",
        }}/>
        <div style={{
          position: "absolute",
          width: "300px", height: "300px",
          borderRadius: "50%",
          background: "rgba(232,93,38,0.04)",
          bottom: "-50px", left: "-50px",
          display: "flex",
        }}/>

        {/* 메인 콘텐츠 */}
        <div style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "24px",
        }}>
          {/* 이모지 + 타이틀 */}
          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <span style={{ fontSize: "80px" }}>🎯</span>
            <span style={{
              fontSize: "80px",
              fontWeight: 700,
              color: "#111111",
              letterSpacing: "-2px",
            }}>
              다트 여행
            </span>
          </div>

          {/* 서브타이틀 */}
          <p style={{
            fontSize: "32px",
            color: "#6b7280",
            margin: 0,
            fontWeight: 400,
          }}>
            랜덤 국내 여행지 추천
          </p>

          {/* 설명 */}
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginTop: "8px",
          }}>
            {["서울", "부산", "제주", "경주", "강릉"].map((city) => (
              <span
                key={city}
                style={{
                  fontSize: "22px",
                  color: "#e85d26",
                  background: "rgba(232,93,38,0.08)",
                  padding: "6px 18px",
                  borderRadius: "20px",
                  border: "1px solid rgba(232,93,38,0.2)",
                }}
              >
                {city}
              </span>
            ))}
            <span style={{ fontSize: "22px", color: "#9ca3af" }}>+ 72곳</span>
          </div>
        </div>

        {/* 하단 */}
        <div style={{
          position: "absolute",
          bottom: "40px",
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}>
          <span style={{ fontSize: "18px", color: "#9ca3af" }}>
            지도를 클릭하면 오늘의 여행지가 결정돼요
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}
