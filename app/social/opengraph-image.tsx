import { ImageResponse } from "next/og";

import { getSiteOrigin, siteConfig } from "@/lib/site";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function OpenGraphImage() {
  const siteOrigin = getSiteOrigin();

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          height: "100%",
          width: "100%",
          background:
            "linear-gradient(135deg, rgba(0,48,73,1) 0%, rgba(193,18,31,1) 55%, rgba(244,162,97,1) 100%)",
          color: "#fff7e3",
          padding: "56px",
          fontFamily: "sans-serif",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              fontSize: 24,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              opacity: 0.88,
            }}
          >
            AEJIS Rapid Response Team
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20, maxWidth: 900 }}>
          <div style={{ fontSize: 66, fontWeight: 700, lineHeight: 1.08, whiteSpace: "nowrap" }}>
            Create an AEJIS certificate instantly
          </div>
          <div style={{ fontSize: 28, lineHeight: 1.4, opacity: 0.92 }}>
            {siteConfig.description}
          </div>
        </div>
        <div style={{ display: "flex", fontSize: 24, opacity: 0.82 }}>
          {siteOrigin}
        </div>
      </div>
    ),
    size,
  );
}
