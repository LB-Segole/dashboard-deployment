import { ReportHandler } from 'web-vitals';

export const reportWebVitals = (onPerfEntry?: ReportHandler) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(onPerfEntry);
      getFID(onPerfEntry);
      getFCP(onPerfEntry);
      getLCP(onPerfEntry);
      getTTFB(onPerfEntry);
    });
  }
};

export const initMonitoring = () => {
  // Initialize performance monitoring
  reportWebVitals((metric) => {
    // Here you can send metrics to your analytics service
    console.log(metric);
  });

  // Set up global error handler
  window.onerror = (message, source, lineno, colno, error) => {
    // Here you can send errors to your error tracking service
    console.error('Global error:', {
      message,
      source,
      lineno,
      colno,
      error,
    });
    return false;
  };

  // Set up unhandled promise rejection handler
  window.onunhandledrejection = (event) => {
    // Here you can send unhandled rejections to your error tracking service
    console.error('Unhandled promise rejection:', event.reason);
  };
}; 