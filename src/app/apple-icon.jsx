import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#1E1E1E",
          color: "#F8F7F4",
          fontFamily: "Georgia, serif",
          fontSize: 96,
          letterSpacing: -4,
        }}
      >
        <span style={{ fontStyle: "italic" }}>H</span>
        <span>A</span>
        <span style={{ fontStyle: "italic", color: "#C9A66B" }}>B</span>
      </div>
    ),
    { ...size }
  );
}
