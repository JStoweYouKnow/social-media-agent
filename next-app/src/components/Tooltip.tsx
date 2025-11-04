"use client";

import { useState } from 'react';

interface TooltipProps {
  content: string;
  children: React.ReactNode;
}

export default function Tooltip({ content, children }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div
      style={{ position: 'relative', display: 'inline-flex' }}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div
          style={{
            position: 'absolute',
            bottom: '100%',
            left: '50%',
            transform: 'translateX(-50%)',
            marginBottom: '8px',
            padding: '4px 8px',
            fontSize: '11px',
            color: 'white',
            backgroundColor: '#1f2937',
            borderRadius: '4px',
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
            zIndex: 9999,
          }}
        >
          {content}
        </div>
      )}
    </div>
  );
}
