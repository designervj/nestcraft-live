import type { Metadata } from 'next';
import './globals.css';
import Providers from '@/components/Providers';
import LayoutWrapper from '@/components/LayoutWrapper';
import StoreProvider from '@/app/StoreProvider';
import { AnnotatorPlugin } from '@/components/annotationPlugin';
import { Geist, Inter, Cormorant_Garamond } from "next/font/google";
import { cn } from "@/lib/utils";
import ChunkErrorRecovery from '@/components/ChunkErrorRecovery';

const geist = Geist({ subsets: ['latin'], variable: '--font-geist', display: 'swap' });
const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const cormorant = Cormorant_Garamond({ 
  subsets: ['latin'], 
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap'
});

export const metadata: Metadata = {
  title: 'NestCraft Interiors',
  description: 'Design-led interiors and furniture storefront built with Next.js.',
  icons: {
    icon: '/assets/Image/favicon.svg', // 👈 favicon added
    shortcut: '/assets/Image/favicon.svg',
    apple: '/assets/Image/favicon.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("font-sans", geist.variable, inter.variable, cormorant.variable)}
    >
      <body>
        <ChunkErrorRecovery />
        <StoreProvider>
          <Providers>
            <LayoutWrapper>{children}</LayoutWrapper>
            {/* <AnnotatorPlugin /> */}
          </Providers>
        </StoreProvider>
      </body>
    </html>
  );
}
