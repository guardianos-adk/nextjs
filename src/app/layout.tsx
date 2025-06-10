import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Toaster } from "sonner";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "GuardianOS - AI-Powered Compliance Orchestration",
    template: "%s | GuardianOS"
  },
  description: "Multi-agent regulatory compliance orchestration system using Google's Agent Development Kit for selective de-anonymization and cross-jurisdictional coordination.",
  keywords: ["compliance", "blockchain", "AI agents", "regulatory", "privacy", "DeFi", "AML", "KYC"],
  authors: [{ name: "GuardianOS Team" }],
  creator: "GuardianOS",
  publisher: "GuardianOS",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://guardianos.ai"),
  openGraph: {
    title: "GuardianOS - AI-Powered Compliance Orchestration",
    description: "The world's first multi-agent regulatory compliance orchestration system",
    url: "https://guardianos.ai",
    siteName: "GuardianOS",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "GuardianOS - AI-Powered Compliance Orchestration",
    description: "Multi-agent regulatory compliance orchestration system",
    creator: "@GuardianOS",
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
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} antialiased font-sans min-h-screen bg-background text-foreground`}
      >
        <Providers>
          {children}
          <Toaster richColors position="top-right" expand={true} />
        </Providers>
      </body>
    </html>
  );
}
