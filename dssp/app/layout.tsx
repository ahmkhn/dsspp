import { GeistSans } from "geist/font/sans";
import "./globals.css";
import {Inter} from 'next/font/google';
import Head from "next/head";
const defaultUrl = 'https://www.dssp.app'

  export const metadata = {
    metadataBase: new URL(defaultUrl),
    title: "Decolonizing Social Sciences",
    description: "DSSP",
    image: "https://www.dssp.app/twitter-image.png"
  };
  

const inter = Inter({subsets:['latin']})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.className}>
      <Head>
        <meta property="og:image" content="https://www.dssp.app/twitter-image.png"></meta>
        <meta property="og:title" content="DSSP" />
        <meta property="og:description" content="Decolonization of Social Sciences in Pakistan" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://dssp.app" />
      </Head>
      <body className="bg-background text-foreground">
        <main className="min-h-screen flex flex-col items-center">
          {children}
        </main>
      </body>
    </html>
  );
}
