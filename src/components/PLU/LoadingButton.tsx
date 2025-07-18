import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingButtonProps {
  onClick: () => void;
  loading: boolean;
  children: React.ReactNode;
  disabled?: boolean;
  className?: string;
}

const LoadingButton: React.FC<LoadingButtonProps> = ({
  onClick,
  loading,
  children,
  disabled = false,
  className = ''
}) => {
  const isDisabled = loading || disabled;
  
  return (
    <button
      onClick={onClick}
      disabled={isDisabled}
      className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
        isDisabled
          ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
          : 'bg-amber-600 text-white hover:bg-amber-700'
      } ${className}`}
    >
      {loading ? (
        <div className="flex items-center justify-center">
          <Loader2 className="animate-spin h-4 w-4 mr-2" />
          Chargement...
        </div>
      ) : (
        children
      )}
    </button>
  );
};

export default LoadingButton;