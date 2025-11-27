"use client";

import { useState } from "react";
import Image from "next/image";
import { Package } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductImageProps {
  src: string | null | undefined;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  fill?: boolean;
  priority?: boolean;
}

export const ProductImage = ({ 
  src, 
  alt, 
  className,
  width,
  height,
  fill = false,
  priority = false
}: ProductImageProps) => {
  const [imageError, setImageError] = useState(false);

  // Clean the image URL - remove whitespace, newlines, and trim
  const cleanImageUrl = src 
    ? src.replace(/\s+/g, ' ').trim().replace(/\n/g, '').replace(/\r/g, '').replace(/\t/g, '')
    : null;

  if (!cleanImageUrl || imageError) {
    return (
      <div className={cn(
        "flex items-center justify-center bg-muted",
        className,
        !fill && width && height && `w-[${width}px] h-[${height}px]`
      )}>
        <Package className="w-8 h-8 text-muted-foreground" />
      </div>
    );
  }

  if (fill) {
    return (
      <div className="relative w-full h-full">
        <Image
          src={cleanImageUrl}
          alt={alt}
          fill
          className={cn(className, "object-cover")}
          onError={() => setImageError(true)}
          loading={priority ? "eager" : "lazy"}
          unoptimized
        />
      </div>
    );
  }

  return (
    <Image
      src={cleanImageUrl}
      alt={alt}
      width={width || 400}
      height={height || 400}
      className={cn(className, "object-cover")}
      onError={() => setImageError(true)}
      loading={priority ? "eager" : "lazy"}
      unoptimized
    />
  );
};

