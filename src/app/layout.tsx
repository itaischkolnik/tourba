import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tourba",
  description: "Your tour management solution",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
} 