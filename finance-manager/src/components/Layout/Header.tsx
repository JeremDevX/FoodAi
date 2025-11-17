'use client';

import { useFinanceStore } from '@/lib/store';
import { formatShortDate } from '@/lib/utils';
import { Calendar, Download, Upload, Settings } from 'lucide-react';
import { useState } from 'react';

export default function Header() {
  const { selectedDateRange, setDateRange } = useFinanceStore();
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleQuickDateSelect = (type: 'current' | 'previous' | 'next') => {
    const now = new Date();
    let start: Date, end: Date;

    switch (type) {
      case 'current':
        start = new Date(now.getFullYear(), now.getMonth(), 1);
        end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        break;
      case 'previous':
        start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        end = new Date(now.getFullYear(), now.getMonth(), 0);
        break;
      case 'next':
        start = new Date(now.getFullYear(), now.getMonth() + 1, 1);
        end = new Date(now.getFullYear(), now.getMonth() + 2, 0);
        break;
    }

    setDateRange(start, end);
    setShowDatePicker(false);
  };

  const handleExport = async () => {
    const { exportData } = await import('@/lib/database');
    const data = await exportData();
    const jsonString = JSON.stringify(data, null, 2);
    
    const { downloadFile } = await import('@/lib/utils');
    downloadFile(
      jsonString,
      `finance-backup-${formatShortDate(new Date())}.json`,
      'application/json'
    );
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Date Range Selector */}
          <div className="flex items-center space-x-4">
            <div className="relative">
              <button
                onClick={() => setShowDatePicker(!showDatePicker)}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <Calendar className="h-4 w-4" />
                <span className="text-sm font-medium">
                  {formatShortDate(selectedDateRange.start)} - {formatShortDate(selectedDateRange.end)}
                </span>
              </button>

              {showDatePicker && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                  <div className="p-4">
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">Période rapide</h3>
                    <div className="space-y-2">
                      <button
                        onClick={() => handleQuickDateSelect('previous')}
                        className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded"
                      >
                        Mois précédent
                      </button>
                      <button
                        onClick={() => handleQuickDateSelect('current')}
                        className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded"
                      >
                        Mois en cours
                      </button>
                      <button
                        onClick={() => handleQuickDateSelect('next')}
                        className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded"
                      >
                        Mois suivant
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-3">
            <button
              onClick={handleExport}
              className="flex items-center space-x-2 px-3 py-2 text-sm bg-financial-100 hover:bg-financial-200 text-financial-700 rounded-lg transition-colors"
              title="Exporter les données"
            >
              <Download className="h-4 w-4" />
              <span>Export</span>
            </button>

            <button
              className="flex items-center space-x-2 px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
              title="Importer des données"
            >
              <Upload className="h-4 w-4" />
              <span>Import</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}