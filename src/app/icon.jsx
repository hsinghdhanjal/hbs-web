import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
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
          fontSize: 20,
          letterSpacing: -1,
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
