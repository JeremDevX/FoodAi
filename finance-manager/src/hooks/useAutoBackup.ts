import { useEffect } from 'react';
import { useFinanceStore } from '@/lib/store';
import { exportData } from '@/lib/database';
import { downloadFile } from '@/lib/utils';

export function useAutoBackup() {
  const { settings } = useFinanceStore();

  useEffect(() => {
    if (!settings?.autoBackup) return;

    const checkAndPerformBackup = async () => {
      try {
        const lastBackup = localStorage.getItem('lastBackupDate');
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();
        
        // Check if we need to backup (monthly)
        if (lastBackup) {
          const lastBackupDate = new Date(lastBackup);
          const lastBackupMonth = lastBackupDate.getMonth();
          const lastBackupYear = lastBackupDate.getFullYear();
          
          // If it's the same month and year, skip
          if (lastBackupMonth === currentMonth && lastBackupYear === currentYear) {
            return;
          }
        }

        // Perform backup
        const data = await exportData();
        const jsonString = JSON.stringify(data, null, 2);
        const filename = `auto-backup-${now.toISOString().split('T')[0]}.json`;
        
        downloadFile(jsonString, filename, 'application/json');
        
        // Update last backup date
        localStorage.setItem('lastBackupDate', now.toISOString());
        
        console.log('Auto-backup completed successfully');
      } catch (error) {
        console.error('Auto-backup failed:', error);
      }
    };

    // Check on app load and then every hour
    checkAndPerformBackup();
    
    const interval = setInterval(checkAndPerformBackup, 60 * 60 * 1000); // Every hour
    
    return () => clearInterval(interval);
  }, [settings?.autoBackup]);
}