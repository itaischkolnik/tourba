import React from 'react';
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Financial Advisor Bot',
  description: 'Your personal financial advisor',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="he" dir="rtl">
      <body>
        <div className="min-h-screen">
          {children}
        </div>
      </body>
    </html>
  );
} 