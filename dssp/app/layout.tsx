import { GeistSans } from "geist/font/sans";
import "./globals.css";
import {Inter} from 'next/font/google';

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "https://dsspp.vercel.app/";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "DSSP",
  description: "Decolonization of Social Sciences in Pakistan",
};
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
