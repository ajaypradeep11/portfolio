import { ImageResponse } from "next/og";

export function createSiteIconResponse(size: number) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background:
            "linear-gradient(135deg, #0f172a 0%, #111827 45%, #ea580c 100%)",
          color: "#f8fafc",
          fontFamily: "Arial",
          fontSize: size * 0.38,
          fontWeight: 700,
          letterSpacing: "-0.08em",
        }}
      >
        AP
      </div>
    ),
    {
      width: size,
      height: size,
    },
  );
}
