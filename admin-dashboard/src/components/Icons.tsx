import {
  Loader2,
  AlertCircle,
  Info,
  ArrowUp,
  ArrowDown,
  Download,
  RefreshCw,
} from 'lucide-react';

export const Icons = {
  spinner: () => <Loader2 className="h-4 w-4 animate-spin" />,
  alertCircle: AlertCircle,
  info: Info,
  arrowUp: ArrowUp,
  arrowDown: ArrowDown,
  download: Download,
  refreshCw: RefreshCw
};
