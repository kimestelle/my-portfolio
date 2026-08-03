import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Into the Blue working file · Estelle Kim',
  description:
    'A build notebook about the museum conversations, camera geometry, and shared decisions behind Into the Blue.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function IntoTheBlueFieldNoteLayout({
  children,
}: {
  children: ReactNode;
}) {
  return children;
}
