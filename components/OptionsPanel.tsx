"use client";

export interface TravelOptions {
  mode: "random";
}

interface Props {
  options: TravelOptions;
  onChange: (o: TravelOptions) => void;
}

export default function OptionsPanel({ options, onChange }: Props) {
  return (
    <div style={{
      background: "#ffffff",
      border: "1px solid var(--border)",
      borderRadius: "12px",
      padding: "16px 20px",
      boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
    }}>
      <p style={{
        fontFamily: "var(--font-mono)",
        fontSize: "10px",
        color: "var(--text-light)",
        letterSpacing: "0.12em",
        marginBottom: "12px",
      }}>TRAVEL OPTIONS</p>

      <p style={{ fontSize: "13px", color: "var(--text-muted)", margin: 0 }}>
        지도를 클릭하면 랜덤으로 국내 여행지를 추천해드려요.
      </p>
    </div>
  );
}
