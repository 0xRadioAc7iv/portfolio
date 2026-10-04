import { ImageResponse } from "next/og";

export const dynamic = "force-static";
export const alt = "Manav Gadhiya — Backend Engineer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    <div
      style={{
        background: "#f4f4f4",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "64px 80px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <span
          style={{
            fontFamily: "monospace",
            fontSize: "12px",
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            color: "#737373",
          }}
        >
          manavgadhiya.com
        </span>
        <span
          style={{
            fontFamily: "monospace",
            fontSize: "11px",
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "#0a0a0a",
            border: "1px solid rgba(0,0,0,0.18)",
            padding: "7px 16px",
          }}
        >
          Backend Engineer
        </span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
        <h1
          style={{
            fontSize: "108px",
            fontWeight: 700,
            letterSpacing: "-0.06em",
            lineHeight: 0.88,
            color: "#0a0a0a",
            margin: 0,
          }}
        >
          Manav Gadhiya
        </h1>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <div
            style={{
              width: "3px",
              height: "44px",
              background: "#0a0a0a",
              flexShrink: 0,
            }}
          />
          <p
            style={{
              fontSize: "19px",
              color: "#737373",
              lineHeight: 1.55,
              margin: 0,
              maxWidth: "620px",
            }}
          >
            Building reliable systems, infrastructure experiments, and
            developer-focused product experiences.
          </p>
        </div>
      </div>
    </div>,
    { ...size },
  );
}
