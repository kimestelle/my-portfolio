import type { Metadata } from 'next';
import HopScene from './HopScene';
import { HOP_CONTENT } from './hopContent';

export const metadata: Metadata = {
  title: HOP_CONTENT.metadata.title,
  description: HOP_CONTENT.metadata.description,
};

export default function HopPage() {
  return <HopScene />;
}
