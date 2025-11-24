import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Adnan Ashraf | Software Developer",
  description: "Portfolio of Adnan Ashraf, a Software Developer and Project Manager Intern. Specializing in full-stack development, AI, and responsive web design.",
  openGraph: {
    title: "Adnan Ashraf | Software Developer",
    description: "Portfolio of Adnan Ashraf, a Software Developer and Project Manager Intern.",
    url: "https://adnanashraf.com", // Replace with actual URL if known, or keep generic
    siteName: "Adnan Ashraf Portfolio",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Adnan Ashraf | Software Developer",
    description: "Portfolio of Adnan Ashraf, a Software Developer and Project Manager Intern.",
    creator: "@aaadnan259", // Assuming from github handle, can be updated
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
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="stylesheet" type='text/css' href="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/devicon.min.css" />
      </head>
      <body className={cn(inter.className, "bg-background text-text")}>
        {children}
      </body>
    </html>
  );
}
