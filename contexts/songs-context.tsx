import type { Song } from '@/constants/types';
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

interface SongsContextValue {
  agakiza: Song[];
  gushimisha: Song[];
  cantiquesKirundi: Song[];
  sdah: Song[];
  isLoaded: boolean;
}

const SongsContext = createContext<SongsContextValue>({
  agakiza: [],
  gushimisha: [],
  cantiquesKirundi: [],
  sdah: [],
  isLoaded: false,
});

export function SongsProvider({ children }: { children: ReactNode }) {
  const [songs, setSongs] = useState<SongsContextValue>({
    agakiza: [],
    gushimisha: [],
    cantiquesKirundi: [],
    sdah: [],
    isLoaded: false,
  });

  useEffect(() => {
    Promise.all([
      import('@/constants/agakiza-songs'),
      import('@/constants/gushimisha-songs'),
      import('@/constants/cantiques-kirundi-songs'),
      import('@/constants/sdah-songs'),
    ]).then(([agakizaModule, gushimishaModule, cantiquesKirundiModule, sdahModule]) => {
      setSongs({
        agakiza: agakizaModule.default as Song[],
        gushimisha: gushimishaModule.default as Song[],
        cantiquesKirundi: cantiquesKirundiModule.default as Song[],
        sdah: sdahModule.default as Song[],
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
