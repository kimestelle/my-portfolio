import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Internet Atlas working file · Estelle Kim',
  description:
    'A build notebook about the questions, teammates, decisions, and commits behind Internet Atlas.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function InternetAtlasFieldNoteLayout({
  children,
}: {
  children: ReactNode;
}) {
  return children;
}
