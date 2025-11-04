'use client';

import Image from 'next/image';
import { useState } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  fill?: boolean;
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
  priority?: boolean;
  quality?: number;
  sizes?: string;
}

export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  className = '',
  fill = false,
  objectFit = 'cover',
  priority = false,
  quality = 85,
  sizes,
}: OptimizedImageProps) {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // If image failed to load, show placeholder
  if (imageError) {
    return (
      <div
        className={`bg-gray-200 flex items-center justify-center text-gray-400 ${className}`}
        style={fill ? { position: 'absolute', width: '100%', height: '100%' } : { width, height }}
      >
        <svg
          className="w-12 h-12"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      </div>
    );
  }

  // Handle local images (starting with /)
  if (src.startsWith('/')) {
    if (fill) {
      return (
        <Image
          src={src}
          alt={alt}
          fill
          className={className}
          style={{ objectFit }}
          priority={priority}
          quality={quality}
          sizes={sizes}
          onError={() => setImageError(true)}
          onLoad={() => setIsLoading(false)}
        />
      );
    }

    return (
      <Image
        src={src}
        alt={alt}
        width={width || 800}
        height={height || 600}
        className={className}
        style={{ objectFit }}
        priority={priority}
        quality={quality}
        sizes={sizes}
        onError={() => setImageError(true)}
        onLoad={() => setIsLoading(false)}
      />
    );
  }

  // Handle external images
  try {
    const imageUrl = new URL(src);
    
    if (fill) {
      return (
        <Image
          src={src}
          alt={alt}
          fill
          className={className}
          style={{ objectFit }}
          priority={priority}
          quality={quality}
          sizes={sizes || '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'}
          onError={() => setImageError(true)}
          onLoad={() => setIsLoading(false)}
          unoptimized={false}
        />
      );
    }

    return (
      <Image
        src={src}
        alt={alt}
        width={width || 800}
        height={height || 600}
        className={className}
        style={{ objectFit }}
        priority={priority}
        quality={quality}
        sizes={sizes || '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'}
        onError={() => setImageError(true)}
        onLoad={() => setIsLoading(false)}
        unoptimized={false}
      />
    );
  } catch {
    // Invalid URL, show placeholder
    return (
      <div
        className={`bg-gray-200 flex items-center justify-center text-gray-400 ${className}`}
        style={fill ? { position: 'absolute', width: '100%', height: '100%' } : { width, height }}
      >
        <svg
          className="w-12 h-12"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      </div>
    );
  }
}

