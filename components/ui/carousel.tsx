'use client';

import * as React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './button';
import { cn } from '@/lib/utils';

interface CarouselProps {
  children: React.ReactNode;
  className?: string;
  autoPlay?: boolean;
  interval?: number;
}

export function Carousel({ children, className, autoPlay = false, interval = 5000 }: CarouselProps) {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const childrenArray = React.Children.toArray(children);
  const totalItems = childrenArray.length;

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % totalItems);
  };

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + totalItems) % totalItems);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  React.useEffect(() => {
    if (autoPlay && totalItems > 1) {
      const timer = setInterval(goToNext, interval);
      return () => clearInterval(timer);
    }
  }, [autoPlay, interval, totalItems]);

  if (totalItems === 0) return null;

  return (
    <div className={cn('relative w-full', className)}>
      <div className="relative overflow-hidden rounded-lg">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{
            transform: `translateX(-${currentIndex * 100}%)`,
          }}
        >
          {childrenArray.map((child, index) => (
            <div key={index} className="min-w-full flex-shrink-0">
              {child}
            </div>
          ))}
        </div>
      </div>

      {totalItems > 1 && (
        <>
          <Button
            variant="outline"
            size="icon"
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white shadow-lg"
            onClick={goToPrev}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white shadow-lg"
            onClick={goToNext}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {childrenArray.map((_, index) => (
              <button
                key={index}
                className={cn(
                  'h-2 rounded-full transition-all',
                  index === currentIndex
                    ? 'w-8 bg-white'
                    : 'w-2 bg-white/50 hover:bg-white/75'
                )}
                onClick={() => goToSlide(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

interface CarouselItemProps {
  children: React.ReactNode;
  className?: string;
}

export function CarouselItem({ children, className }: CarouselItemProps) {
  return <div className={cn('w-full', className)}>{children}</div>;
}









