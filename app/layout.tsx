import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Event Matchmaker",
  description: "Event sign-up and matchmaker app landing page",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
