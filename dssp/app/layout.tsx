import { GeistSans } from "geist/font/sans";
import "./globals.css";
import {Inter} from 'next/font/google';
import type { Metadata } from 'next'

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "https://www.dssp.app";

export const metadata: Metadata = {
  title: 'DSSP',
  description: 'Decolonization of Social Sciences in Pakistan',
  openGraph: {
    title: 'DSSP',
    description: 'Decolonization of Social Sciences in Pakistan',
    url: 'https://www.dssp.app',
    siteName: 'dssp',
    images: [
      {
        url: 'https://www.dssp.app/og-image.png',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
}

const inter = Inter({subsets:['latin']})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.className}>
      <body className="bg-background text-foreground">
        <main className="min-h-screen flex flex-col items-center">
          {children}
        </main>
      </body>
    </html>
  );
}
