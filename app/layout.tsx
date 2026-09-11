import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'TET & TNPSC Study Hall',
  description: 'Exam materials, notes and papers for TET and TNPSC aspirants.',
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
