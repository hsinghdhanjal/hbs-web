import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const logoDataUrl = `data:image/png;base64,${readFileSync(
  join(process.cwd(), "src/assets/logo-mark-white.png")
).toString("base64")}`;

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#1E1E1E",
          color: "#F8F7F4",
          fontFamily: "Georgia, serif",
          padding: 80,
          textAlign: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 30,
            letterSpacing: 6,
            textTransform: "uppercase",
            color: "#C9A66B",
            marginBottom: 32,
          }}
        >
          Punjab · Architecture &amp; Construction
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logoDataUrl} width={100} height={100} alt="" />
          <div style={{ display: "flex", fontSize: 62, lineHeight: 1.15 }}>
            Harsimran Architects &amp; Builders
          </div>
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 30,
            marginTop: 32,
            color: "#F8F7F4",
            opacity: 0.85,
            fontStyle: "italic",
          }}
        >
          Designed for Living. Built for Generations.
        </div>
      </div>
    ),
    { ...size }
  );
}
