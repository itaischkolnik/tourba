import React from 'react';
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'תּוּר בָּה - חוויות תוכן וטיולים',
  description: 'ימי תוכן, סיורים ופעילויות חווייתיות',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="he" dir="rtl" style={{ backgroundColor: '#342e1e' }}>
      <body style={{ backgroundColor: '#342e1e', margin: 0, minHeight: '100vh' }}>
        <div style={{ backgroundColor: '#342e1e', minHeight: '100vh', width: '100%' }}>
          {children}
        </div>
      </body>
    </html>
  );
} 