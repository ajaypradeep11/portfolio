import { Cormorant_Garamond, Pinyon_Script } from "next/font/google";

import styles from "./layout.module.scss";

const serif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-wedding-serif",
});

const script = Pinyon_Script({
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
  variable: "--font-wedding-script",
});

export const metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default function WeddingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${serif.variable} ${script.variable} ${styles.weddingRoot}`}>
      {children}
    </div>
  );
}
