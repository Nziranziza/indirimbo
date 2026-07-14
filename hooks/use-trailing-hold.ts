import { useEffect, useState } from 'react';

/**
 * Keeps a flag true while `active` is true, and for `holdMs` after `active`
 * turns false. Used so a loading indicator stays visible until a refresh has
 * settled (covering the result recompute + list re-render) instead of cutting
 * off the instant the input stops changing.
 */
export function useTrailingHold(active: boolean, holdMs: number): boolean {
  const [visible, setVisible] = useState(active);

  useEffect(() => {
    if (active) {
      setVisible(true);
      return;
    }
    const timer = setTimeout(() => setVisible(false), holdMs);
    return () => clearTimeout(timer);
  }, [active, holdMs]);

  return active || visible;
}
