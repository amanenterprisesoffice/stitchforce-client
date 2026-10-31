'use client';

import { cn } from '@/lib/utils'; // Assuming 'cn' is a utility function similar to 'clsx'

interface LoaderProps {
  text?: string; // Optional text for the loader
  color?: string; // Optional color, defaulting to 'text-green-400'
  fullScreen?: boolean; // Optional full-screen display, defaulting to false
  className?: string; // Optional additional classes for the container
  spinnerClassName?: string; // Optional additional classes for the spinner
}

const Loader = ({
  text,
  color = 'primary',
  fullScreen = true,
  className = '',
  spinnerClassName = '',
}: LoaderProps) => {
  return (
    <div
      className={cn(
        'flex text-xs pointer-events-none flex-col items-center w-full justify-center h-full',
        fullScreen && 'fixed top-0 inset-0 z-50',
        className
      )}
    >
      <div
        className={cn(
          'animate-spin rounded-full size-5 border-b-3',
          `dark:border-primary border-secondary-foreground`,
          spinnerClassName
        )}
      ></div>
      {text && <div className={cn('mt-3 rounded-xs text-secondary-foreground dark:bg-secondary/50 bg-primary/0 border border-secondary-foreground/40 px-2 py-1', color)}>{text}</div>}
    </div>
  );
};

export default Loader;
