import type { Song } from '@/constants/types';
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

interface SongsContextValue {
  agakiza: Song[];
  gushimisha: Song[];
  isLoaded: boolean;
}

const SongsContext = createContext<SongsContextValue>({
  agakiza: [],
  gushimisha: [],
  isLoaded: false,
});

export function SongsProvider({ children }: { children: ReactNode }) {
  const [songs, setSongs] = useState<SongsContextValue>({
    agakiza: [],
    gushimisha: [],
    isLoaded: false,
  });

  useEffect(() => {
    Promise.all([
      import('@/constants/agakiza-songs'),
      import('@/constants/gushimisha-songs'),
    ]).then(([agakizaModule, gushimishaModule]) => {
      setSongs({
        agakiza: agakizaModule.default as Song[],
        gushimisha: gushimishaModule.default as Song[],
        isLoaded: true,
      });
    }).catch(console.error);
  }, []);

  return (
    <SongsContext.Provider value={songs}>
      {children}
    </SongsContext.Provider>
  );
}

export function useSongs() {
  return useContext(SongsContext);
}
