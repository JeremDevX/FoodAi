import { useEffect } from 'react';

export function useErrorHandler() {
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      console.error('Global error caught:', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        error: event.error
      });

      // Log to console for debugging
      console.error('Stack trace:', event.error?.stack);

      // You could also send to an error reporting service here
      // but since this is a privacy-focused app, we'll just log locally
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error('Unhandled promise rejection:', {
        reason: event.reason,
        promise: event.promise
      });
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);
}

export function logError(context: string, error: any) {
  console.error(`[${context}] Error:`, error);
  
  if (error instanceof Error) {
    console.error(`[${context}] Stack trace:`, error.stack);
  }
}

export function logWarning(context: string, message: string) {
  console.warn(`[${context}] Warning:`, message);
}

export function logInfo(context: string, message: string) {
  console.info(`[${context}] Info:`, message);
}