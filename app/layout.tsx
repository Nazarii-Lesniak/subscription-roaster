import type { Metadata, Viewport } from "next";
import en from "@/locales/en.json";
import "./globals.css";

export const metadata: Metadata = {
  title: en.meta.title,
  description: en.meta.description,
  icons: {
    icon: "/brand-mark.svg",
    apple: "/icons/apple-touch-icon.png",
  },
  appleWebApp: {
    capable: true,
    title: "Roaster",
    statusBarStyle: "black-translucent",
  },
  applicationName: "Subscription Roaster",
};

export const viewport: Viewport = {
  themeColor: "#101015",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
