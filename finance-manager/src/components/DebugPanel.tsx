'use client';

import { useState, useEffect } from 'react';
import { Bug, X, RefreshCw, Database, AlertCircle } from 'lucide-react';

export default function DebugPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [debugInfo, setDebugInfo] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<string[]>([]);

  // Collect debug information
  const collectDebugInfo = () => {
    const info: Record<string, any> = {
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      language: navigator.language,
      cookiesEnabled: navigator.cookieEnabled,
      onLine: navigator.onLine,
    };

    // Check browser features
    info.indexedDB = 'indexedDB' in window;
    info.localStorage = 'localStorage' in window;
    info.sessionStorage = 'sessionStorage' in window;
    info.serviceWorker = 'serviceWorker' in navigator;

    // Check screen info
    info.screen = {
      width: window.screen.width,
      height: window.screen.height,
      colorDepth: window.screen.colorDepth,
      orientation: window.screen.orientation?.type,
    };

    // Check memory (if available)
    if ('memory' in performance) {
      info.memory = (performance as any).memory;
    }

    // Check connection
    if ('connection' in navigator) {
      info.connection = (navigator as any).connection;
    }

    setDebugInfo(info);
  };

  useEffect(() => {
    collectDebugInfo();

    // Listen for errors
    const handleError = (event: ErrorEvent) => {
      setErrors(prev => [...prev, `${new Date().toISOString()}: ${event.message}`]);
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      setErrors(prev => [...prev, `${new Date().toISOString()}: Unhandled promise rejection: ${event.reason}`]);
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  const clearErrors = () => {
    setErrors([]);
  };

  const copyDebugInfo = () => {
    const debugText = JSON.stringify(debugInfo, null, 2);
    navigator.clipboard.writeText(debugText);
    alert('Debug info copied to clipboard!');
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 p-3 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-lg transition-colors z-50"
        title="Open Debug Panel"
      >
        <Bug className="h-5 w-5" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 w-96 bg-white rounded-lg shadow-2xl border border-gray-200 z-50 max-h-96 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-red-50">
        <div className="flex items-center space-x-2">
          <Bug className="h-5 w-5 text-red-600" />
          <span className="font-semibold text-red-900">Debug Panel</span>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="p-1 text-red-600 hover:text-red-800 hover:bg-red-100 rounded"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Content */}
      <div className="p-4 overflow-y-auto max-h-80">
        {/* Browser Info */}
        <div className="mb-4">
          <h3 className="font-medium text-gray-900 mb-2 flex items-center">
            <Database className="h-4 w-4 mr-2" />
            Browser Info
          </h3>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">IndexedDB:</span>
              <span className={debugInfo.indexedDB ? 'text-green-600' : 'text-red-600'}>
                {debugInfo.indexedDB ? '✅ Available' : '❌ Not available'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">LocalStorage:</span>
              <span className={debugInfo.localStorage ? 'text-green-600' : 'text-red-600'}>
                {debugInfo.localStorage ? '✅ Available' : '❌ Not available'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Service Worker:</span>
              <span className={debugInfo.serviceWorker ? 'text-green-600' : 'text-red-600'}>
                {debugInfo.serviceWorker ? '✅ Available' : '❌ Not available'}
              </span>
            </div>
          </div>
        </div>

        {/* Screen Info */}
        <div className="mb-4">
          <h3 className="font-medium text-gray-900 mb-2">Screen Info</h3>
          <div className="space-y-1 text-sm text-gray-600">
            <div>Width: {debugInfo.screen?.width}px</div>
            <div>Height: {debugInfo.screen?.height}px</div>
            <div>Orientation: {debugInfo.screen?.orientation || 'unknown'}</div>
          </div>
        </div>

        {/* Connection Info */}
        {debugInfo.connection && (
          <div className="mb-4">
            <h3 className="font-medium text-gray-900 mb-2">Connection</h3>
            <div className="space-y-1 text-sm text-gray-600">
              <div>Type: {debugInfo.connection.effectiveType || 'unknown'}</div>
              <div>Downlink: {debugInfo.connection.downlink || 'unknown'} Mbps</div>
            </div>
          </div>
        )}

        {/* Errors */}
        {errors.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium text-gray-900 flex items-center">
                <AlertCircle className="h-4 w-4 mr-2 text-red-600" />
                Errors ({errors.length})
              </h3>
              <button
                onClick={clearErrors}
                className="text-xs text-red-600 hover:text-red-800"
              >
                Clear
              </button>
            </div>
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {errors.map((error, index) => (
                <div key={index} className="text-xs text-red-600 bg-red-50 p-2 rounded">
                  {error}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex space-x-2 pt-4 border-t border-gray-200">
          <button
            onClick={copyDebugInfo}
            className="flex-1 px-3 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded text-sm font-medium transition-colors"
          >
            Copy Info
          </button>
          <button
            onClick={collectDebugInfo}
            className="flex-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-sm font-medium transition-colors flex items-center justify-center"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}