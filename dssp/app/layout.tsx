import { GeistSans } from "geist/font/sans";
import "./globals.css";
import {Inter} from 'next/font/google';
import type { Metadata } from 'next'

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "https://www.dssp.app";

const faviconUrl = `https://www.dssp.app/favicon.ico`;

export const metadata: Metadata = {
  title: 'DSSP',
  description: "Decolonization of Social Sciences in Pakistan",
  openGraph: {
    title: 'DSSP',
    description: 'Decolonization of Social Sciences in Pakistan',
    url: defaultUrl,
    siteName: 'DSSP',
    images: [
      {
        url: faviconUrl,
        width: 32,
        height: 32,
        alt: 'DSSP Favicon',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary', // Changed to 'summary' as we're using a small image
    title: 'DSSP',
    description: 'Decolonization of Social Sciences in Pakistan',
    images: [faviconUrl],
  },
  icons: {
    icon: '/favicon.ico',
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
