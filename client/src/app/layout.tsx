import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast'; // For notifications

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'FileSure Referral Program',
  description: 'Refer friends and earn credits!',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <main>{children}</main>
        {/* This component handles rendering all notifications */}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#18181b', // card color
              color: '#fafafa', // foreground color
              border: '1px solid #27272a', // border color
            },
          }}
        />
      </body>
    </html>
  );
}