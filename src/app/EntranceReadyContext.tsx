'use client';

import { createContext, useContext, type ReactNode } from 'react';

const EntranceReadyContext = createContext(true);

export function EntranceReadyProvider({
  children,
  ready,
}: {
  children: ReactNode;
  ready: boolean;
}) {
  return (
    <EntranceReadyContext.Provider value={ready}>
      {children}
    </EntranceReadyContext.Provider>
  );
}

export function useEntranceReady() {
  return useContext(EntranceReadyContext);
}
