import { createContext, useContext, type ReactNode } from 'react';

import { useAppVersionCheck, type UpdateCheckResult } from '@/hooks/use-app-version-check';

const UpdateCheckContext = createContext<UpdateCheckResult | undefined>(undefined);

interface UpdateCheckProviderProps {
  readonly children: ReactNode;
}

export function UpdateCheckProvider({ children }: UpdateCheckProviderProps) {
  const value = useAppVersionCheck();
  return <UpdateCheckContext.Provider value={value}>{children}</UpdateCheckContext.Provider>;
}

export function useUpdateCheck(): UpdateCheckResult {
  const value = useContext(UpdateCheckContext);
  if (!value) throw new Error('useUpdateCheck must be used inside UpdateCheckProvider');
  return value;
}
