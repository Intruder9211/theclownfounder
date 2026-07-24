import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "clownfounder // Autonomous Company OS",
  description: "Autonomous AI Executive Team with Founder-in-the-Loop Approval. Sales, engineering, QA, finance, and support handle complex operational workflows while you review recommendations and steer strategic decisions.",
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
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
