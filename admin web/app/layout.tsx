import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pre-order Admin",
  description: "Mongolian pre-order ecommerce admin panel",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="mn">
      <body>{children}</body>
    </html>
  );
}
