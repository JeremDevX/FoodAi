import { useEffect } from 'react';
import { useFinanceStore } from '@/lib/store';

export function useLocalStorageSync() {
  const { refreshData } = useFinanceStore();

  useEffect(() => {
    // Listen for storage events (cross-tab synchronization)
    const handleStorageEvent = (event: StorageEvent) => {
      if (event.key === 'financeDataUpdated') {
        // Another tab updated the data, refresh our store
        refreshData();
      }
    };

    // Listen for custom events (IndexedDB updates)
    const handleCustomEvent = (event: CustomEvent) => {
      if (event.detail?.type === 'dataUpdated') {
        refreshData();
      }
    };

    window.addEventListener('storage', handleStorageEvent);
    window.addEventListener('financeDataUpdated', handleCustomEvent as EventListener);

    return () => {
      window.removeEventListener('storage', handleStorageEvent);
      window.removeEventListener('financeDataUpdated', handleCustomEvent as EventListener);
    };
  }, [refreshData]);
}