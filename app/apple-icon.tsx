import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#e85d26",
          borderRadius: "40px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "110px",
        }}
      >
        🎯
      </div>
    ),
    { ...size }
  );
}
