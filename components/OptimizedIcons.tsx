// Optimized icon imports to reduce bundle size
// Only import icons that are actually used
import { 
  Computer,
  Home,
  Zap,
  Shield,
  Wifi,
  Mail,
  Smartphone,
  Database,
  Lock,
  Video,
  CreditCard,
  Play,
  Image as ImageIcon,
  Printer,
  RefreshCw,
  Accessibility,
  ChevronRight,
  ChevronDown,
  CheckCircle,
  Info,
  Phone,
  Menu,
  X,
  Paintbrush
} from 'lucide-react';

// Export all used icons from a single place for better tree shaking
export {
  Computer,
  Home,
  Zap,
  Shield,
  Wifi,
  Mail,
  Smartphone,
  Database,
  Lock,
  Video,
  CreditCard,
  Play,
  ImageIcon,
  Printer,
  RefreshCw,
  Accessibility,
  ChevronRight,
  ChevronDown,
  CheckCircle,
  Info,
  Phone,
  Menu,
  X,
  Paintbrush
};

// Create a typed icon component for better performance
export interface IconProps {
  className?: string;
  size?: number;
  'aria-label'?: string;
}

// Common icon wrapper for consistent styling
export const Icon = ({ children, className = "w-6 h-6", ...props }: { children: React.ReactNode; className?: string; [key: string]: any }) => (
  <span className={className} {...props}>
    {children}
  </span>
); 