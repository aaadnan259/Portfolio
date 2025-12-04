import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import ScrollProgress from "@/components/ScrollProgress";
import BackToTop from "@/components/BackToTop";
import { Providers } from "@/components/Providers";
import { LoadingProvider } from "@/components/LoadingProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Adnan Ashraf | Software Developer",
  description: "Portfolio of Adnan Ashraf, a Software Developer and Project Manager Intern. Specializing in full-stack development, AI, and responsive web design.",
  openGraph: {
    title: "Adnan Ashraf | Software Developer",
    description: "Portfolio of Adnan Ashraf, a Software Developer and Project Manager Intern.",
    url: "https://adnanashraf.com", // Update with your actual domain
    siteName: "Adnan Ashraf Portfolio",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Adnan Ashraf | Software Developer",
    description: "Portfolio of Adnan Ashraf, a Software Developer and Project Manager Intern.",
    creator: "@aaadnan259", // Update with your Twitter/X handle
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f3f4f6' },
    { media: '(prefers-color-scheme: dark)', color: '#0D1117' },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={cn(inter.className, "bg-background text-text")}>
        <Providers>
          <ScrollProgress />
          <LoadingProvider>
            {children}
          </LoadingProvider>
          <BackToTop />
          <Analytics />
        </Providers>
      </body>
    </html>
  );
}
