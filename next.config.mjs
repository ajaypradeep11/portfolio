import mdx from "@next/mdx";

const withMDX = mdx({
  extension: /\.mdx?$/,
  options: {},
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ["ts", "tsx", "md", "mdx"],
  images: {
    formats: ["image/webp"],
    imageSizes: [24, 32, 48, 64, 80, 96, 120, 160, 192, 256, 384],
  },
};

export default withMDX(nextConfig);
