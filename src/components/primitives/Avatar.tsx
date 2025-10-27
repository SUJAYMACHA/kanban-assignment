import React from 'react';
import clsx from 'clsx';

export interface AvatarProps {
  name?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  name = '',
  size = 'md',
  className,
}) => {
  const getInitials = (fullName: string): string => {
    return fullName
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };
  
  const sizeClasses = {
    sm: 'w-6 h-6 text-xs',
    md: 'w-8 h-8 text-sm',
    lg: 'w-10 h-10 text-base',
  };
  
  const getColorFromName = (name: string): string => {
    const colors = [
      'bg-primary-500',
      'bg-success-500',
      'bg-warning-500',
      'bg-error-500',
      'bg-purple-500',
      'bg-pink-500',
      'bg-indigo-500',
      'bg-cyan-500',
    ];
    
    const hash = name
      .split('')
      .reduce((acc, char) => char.charCodeAt(0) + acc, 0);
    
    return colors[hash % colors.length];
  };
  
  const initials = getInitials(name);
  const bgColor = getColorFromName(name);
  
  return (
    <div
      className={clsx(
        'flex items-center justify-center rounded-full text-white font-medium',
        sizeClasses[size],
        bgColor,
        className
      )}
      title={name}
      aria-label={`Avatar for ${name}`}
    >
      {initials}
    </div>
  );
};