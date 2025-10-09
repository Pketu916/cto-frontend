import React from 'react';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';

const Alert = ({
  type = 'info',
  title,
  message,
  showIcon = true,
  dismissible = false,
  onDismiss,
  className = '',
  children,
}) => {
  const alertConfig = {
    success: {
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      textColor: 'text-green-800',
      iconColor: 'text-green-400',
      icon: CheckCircle,
    },
    error: {
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      textColor: 'text-red-800',
      iconColor: 'text-red-400',
      icon: XCircle,
    },
    warning: {
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      textColor: 'text-yellow-800',
      iconColor: 'text-yellow-400',
      icon: AlertTriangle,
    },
    info: {
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      textColor: 'text-blue-800',
      iconColor: 'text-blue-400',
      icon: Info,
    },
  };

  const config = alertConfig[type];
  const Icon = config.icon;

  return (
    <div className={`rounded-md border p-4 ${config.bgColor} ${config.borderColor} ${className}`}>
      <div className="flex">
        {showIcon && (
          <div className="flex-shrink-0">
            <Icon className={`h-5 w-5 ${config.iconColor}`} />
          </div>
        )}
        <div className={`ml-3 flex-1 ${config.textColor}`}>
          {title && <h3 className="text-sm font-medium">{title}</h3>}
          {message && <div className={`text-sm ${title ? 'mt-1' : ''}`}>{message}</div>}
          {children && <div className={`text-sm ${title || message ? 'mt-1' : ''}`}>{children}</div>}
        </div>
        {dismissible && (
          <div className="ml-auto pl-3">
            <div className="-mx-1.5 -my-1.5">
              <button
                onClick={onDismiss}
                className={`inline-flex rounded-md p-1.5 ${config.textColor} hover:bg-opacity-20 hover:bg-current focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-current`}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Alert;
