import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from './ui/Button';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo,
    });

    // Log error to your error tracking service
    console.error('Uncaught error:', error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleReportError = () => {
    // Implement error reporting logic here
    const errorReport = {
      error: this.state.error?.toString(),
      errorInfo: this.state.errorInfo?.componentStack,
      url: window.location.href,
      timestamp: new Date().toISOString(),
    };

    console.log('Error report:', errorReport);
    // Send to your error tracking service
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mx-auto mb-4">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            
            <h1 className="text-xl font-semibold text-center text-gray-900 mb-2">
              Something went wrong
            </h1>
            
            <p className="text-gray-500 text-center mb-6">
              We&apos;re sorry for the inconvenience. The error has been logged and we&apos;ll look into it.
            </p>

            {process.env.NODE_ENV === 'development' && (
              <div className="mb-6 p-4 bg-gray-50 rounded-md">
                <p className="font-mono text-sm text-gray-700 break-all">
                  {this.state.error?.toString()}
                </p>
                {this.state.errorInfo && (
                  <pre className="mt-2 font-mono text-xs text-gray-600 overflow-auto max-h-40">
                    {this.state.errorInfo.componentStack}
                  </pre>
                )}
              </div>
            )}

            <div className="flex flex-col space-y-3">
              <Button onClick={this.handleReload} variant="default">
                Reload Page
              </Button>
              <Button onClick={this.handleReportError} variant="outline">
                Report Problem
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
} 