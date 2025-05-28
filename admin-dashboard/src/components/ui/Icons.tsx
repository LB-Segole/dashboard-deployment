import { LucideProps } from 'lucide-react';
import {
  Loader2,
  AlertCircle,
  Info,
  ArrowUp,
  ArrowDown,
  Download,
  RefreshCw,
  ChevronDown,
  X,
  Check,
  Search,
  Shield,
} from 'lucide-react';

export type IconComponent = React.ForwardRefExoticComponent<
  LucideProps & { ref?: React.Ref<SVGSVGElement> }
>;

export const Icons = {
  spinner: Loader2,
  alertCircle: AlertCircle,
  info: Info,
  download: Download,
  arrowUp: ArrowUp,
  arrowDown: ArrowDown,
  refreshCw: RefreshCw,
  chevronDown: ChevronDown,
  close: X,
  check: Check,
  search: Search,
  shield: Shield,
} as const; 