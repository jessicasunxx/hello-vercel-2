import type { Metadata } from "next";
import { JetBrains_Mono, Sora } from "next/font/google";
import { ThemeScript } from "@/components/theme-script";
import "./globals.css";

const sora = Sora({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const jetbrains = JetBrains_Mono({
  variable: "--font-code",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Humor Project Admin",
  description: "Admin area for the Humor Project database",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${sora.variable} ${jetbrains.variable} antialiased`}>
        <ThemeScript />
        {children}
      </body>
    </html>
  );
}
