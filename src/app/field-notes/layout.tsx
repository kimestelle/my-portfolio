import type { ReactNode } from 'react';
import ExternalLinkPreview from './components/ExternalLinkPreview';
import FieldNoteTypeControl from './components/FieldNoteTypeControl';

export default function FieldNotesLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <FieldNoteTypeControl>
      <ExternalLinkPreview>{children}</ExternalLinkPreview>
    </FieldNoteTypeControl>
  );
}
