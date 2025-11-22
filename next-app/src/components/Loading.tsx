'use client';

import React from 'react';

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  fullScreen?: boolean;
  text?: string;
}

export const Loading = ({ size = 'md', fullScreen = false, text }: LoadingProps) => {
  const sizeClasses = {
    sm: 'spinner-sm',
    md: '',
    lg: 'spinner-lg',
  };

  const spinner = (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className={`spinner ${sizeClasses[size]}`} />
      {text && (
        <p className="text-planner-text-muted text-sm animate-pulse">{text}</p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-90 backdrop-blur-sm flex items-center justify-center z-50">
        {spinner}
      </div>
    );
  }

  return spinner;
};

interface SkeletonProps {
  className?: string;
  count?: number;
}

export const Skeleton = ({ className = '', count = 1 }: SkeletonProps) => {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={`skeleton ${className}`} />
      ))}
    </>
  );
};

interface SkeletonTextProps {
  lines?: number;
}

export const SkeletonText = ({ lines = 3 }: SkeletonTextProps) => {
  return (
    <div className="space-y-3">
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="skeleton h-4"
          style={{
            width: i === lines - 1 ? '70%' : '100%',
          }}
        />
      ))}
    </div>
  );
};

export const SkeletonCard = () => {
  return (
    <div className="card">
      <div className="skeleton h-48 mb-4" />
      <div className="skeleton h-6 w-3/4 mb-2" />
      <SkeletonText lines={2} />
    </div>
  );
};
