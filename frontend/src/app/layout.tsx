import type { Metadata, Viewport } from 'next';
import './globals.css';
import Shell from '@/components/layout/Shell';
import { LanguageProvider } from '@/context/LanguageContext';

export const metadata: Metadata = {
  title: 'GrowthOS | AI Business Partner for Paytm Merchants',
  description: 'From payment data to the next best action. An AI intelligence and action layer designed for Paytm for Business.',
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#00BAF2',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#F5FAFD] antialiased selection:bg-[#00BAF2] selection:text-white">
        <LanguageProvider>
          <Shell>{children}</Shell>
        </LanguageProvider>
      </body>
    </html>
  );
}
