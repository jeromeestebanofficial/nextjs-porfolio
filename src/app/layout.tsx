import type { Metadata } from "next";
import { Geist_Mono, Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Jerome Esteban – Full-Stack Developer Portfolio",
  description:
    "Full-stack developer building clean, reliable web applications with modern tooling, glassmorphism UI, and a focus on usability.",
  metadataBase: new URL("https://estebanjerome.vercel.app"),
  openGraph: {
    title: "Jerome Esteban – Full-Stack Developer Portfolio",
    description:
      "Showcasing projects, tech stack, and a thoughtful approach to building web experiences.",
    url: "https://estebanjerome.vercel.app",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
