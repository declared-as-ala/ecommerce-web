"use client";

import { useMemo, useRef, useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { CATEGORIES } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface CategoryFilterProps {
  selectedCategory: string | null;
  onCategoryChange: (category: string | null) => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
}

export const CategoryFilter = ({
  selectedCategory,
  onCategoryChange,
  onClearFilters,
  hasActiveFilters,
}: CategoryFilterProps) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  // Memoize category images for better performance
  const categoryImages = useMemo(() => {
    const images = new Map<string, string>();
    CATEGORIES.forEach((cat) => {
      images.set(cat.name, cat.image || 'https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg');
    });
    return images;
  }, []);

  // Check scroll position to show/hide arrows
  const checkScrollPosition = () => {
    if (!scrollContainerRef.current) return;
    
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    setShowLeftArrow(scrollLeft > 0);
    setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    checkScrollPosition();
    container.addEventListener('scroll', checkScrollPosition);
    window.addEventListener('resize', checkScrollPosition);

    return () => {
      container.removeEventListener('scroll', checkScrollPosition);
      window.removeEventListener('resize', checkScrollPosition);
    };
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    
    const scrollAmount = 200;
    const currentScroll = scrollContainerRef.current.scrollLeft;
    const targetScroll = direction === 'left' 
      ? currentScroll - scrollAmount 
      : currentScroll + scrollAmount;
    
    scrollContainerRef.current.scrollTo({
      left: targetScroll,
      behavior: 'smooth',
    });
  };

  return (
    <div className="mb-4 md:mb-6">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-gray-700">Catégories</h2>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="text-xs text-gray-600 hover:text-gray-900"
          >
            <X className="h-3 w-3 mr-1" />
            Réinitialiser
          </Button>
        )}
      </div>
      
      {/* Scrollable Categories Container */}
      <div className="relative group">
        {/* Left Arrow */}
        {showLeftArrow && (
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur-sm hover:bg-white shadow-lg rounded-full p-2 transition-all duration-200 hover:scale-110 opacity-0 group-hover:opacity-100"
            aria-label="Scroll left"
          >
            <ChevronLeft className="h-5 w-5 text-gray-700" />
          </button>
        )}

        {/* Right Arrow */}
        {showRightArrow && (
          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur-sm hover:bg-white shadow-lg rounded-full p-2 transition-all duration-200 hover:scale-110 opacity-0 group-hover:opacity-100"
            aria-label="Scroll right"
          >
            <ChevronRight className="h-5 w-5 text-gray-700" />
          </button>
        )}

        {/* Scrollable Categories */}
        <div
          ref={scrollContainerRef}
          className="overflow-x-auto scrollbar-hide scroll-smooth pb-2"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch',
            willChange: 'scroll-position',
          }}
          onScroll={checkScrollPosition}
        >
          
          <div className="flex gap-2 md:gap-3 min-w-max px-1">
            {/* All Categories Button */}
            <button
              onClick={() => onCategoryChange(null)}
              className={cn(
                "flex-shrink-0 flex flex-col items-center gap-1.5 px-3 py-2.5 rounded-xl transition-all duration-200 border-2 min-w-[80px] md:min-w-[100px] shadow-sm transform hover:scale-105 active:scale-95",
                !selectedCategory
                  ? "bg-gradient-to-br from-green-50 to-emerald-50 border-green-500 text-green-700 font-medium shadow-md"
                  : "border-gray-200 hover:border-green-300 hover:bg-green-50/50 text-gray-700 bg-white hover:shadow-md"
              )}
            >
              <div
                className={cn(
                  "w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center text-white font-bold text-xs shadow-lg transition-transform duration-200",
                  !selectedCategory && "scale-110"
                )}
              >
                Tous
              </div>
              <span className="text-[10px] md:text-xs font-semibold text-center">
                Tous
              </span>
            </button>

            {/* Category Buttons */}
            {CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat.name;
              const imageUrl = categoryImages.get(cat.name) || cat.image;

              return (
                <button
                  key={cat.id}
                  onClick={() => onCategoryChange(cat.name)}
                  className={cn(
                    "flex-shrink-0 flex flex-col items-center gap-1.5 px-3 py-2.5 rounded-xl transition-all duration-200 border-2 min-w-[80px] md:min-w-[100px] shadow-sm transform hover:scale-105 active:scale-95",
                    isSelected
                      ? "bg-gradient-to-br from-green-50 to-emerald-50 border-green-500 shadow-md"
                      : "border-gray-200 hover:border-green-300 hover:shadow-md bg-white"
                  )}
                >
                  <div
                    className={cn(
                      "relative w-10 h-10 md:w-12 md:h-12 rounded-xl overflow-hidden shadow-md transition-transform duration-200",
                      isSelected && "scale-110 ring-2 ring-green-500"
                    )}
                  >
                    <Image
                      src={imageUrl}
                      alt={cat.name}
                      fill
                      className="object-cover"
                      loading="eager"
                      priority={isSelected}
                      sizes="(max-width: 768px) 40px, 48px"
                    />
                    {isSelected && (
                      <div className="absolute inset-0 bg-green-500/20 ring-2 ring-green-500 rounded-xl" />
                    )}
                  </div>
                  <span
                    className={cn(
                      "text-[10px] md:text-xs font-semibold text-center line-clamp-2 w-full transition-colors duration-200",
                      isSelected ? "text-green-700" : "text-gray-700"
                    )}
                  >
                    {cat.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

