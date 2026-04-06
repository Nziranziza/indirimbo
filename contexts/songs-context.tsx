import type { Song } from '@/constants/types';
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

interface SongsContextValue {
  agakiza: Song[];
  gushimisha: Song[];
  cantiquesKirundi: Song[];
  isLoaded: boolean;
}

const SongsContext = createContext<SongsContextValue>({
  agakiza: [],
  gushimisha: [],
  cantiquesKirundi: [],
  isLoaded: false,
});

export function SongsProvider({ children }: { children: ReactNode }) {
  const [songs, setSongs] = useState<SongsContextValue>({
    agakiza: [],
    gushimisha: [],
    cantiquesKirundi: [],
    isLoaded: false,
  });

  useEffect(() => {
    Promise.all([
      import('@/constants/agakiza-songs'),
      import('@/constants/gushimisha-songs'),
      import('@/constants/cantiques-kirundi-songs'),
    ]).then(([agakizaModule, gushimishaModule, cantiquesKirundiModule]) => {
      setSongs({
        agakiza: agakizaModule.default as Song[],
        gushimisha: gushimishaModule.default as Song[],
        cantiquesKirundi: cantiquesKirundiModule.default as Song[],
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
