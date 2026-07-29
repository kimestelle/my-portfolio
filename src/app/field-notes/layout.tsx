import type { ReactNode } from 'react';
import ExternalLinkPreview from './components/ExternalLinkPreview';

export default function FieldNotesLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <ExternalLinkPreview>{children}</ExternalLinkPreview>;
}
