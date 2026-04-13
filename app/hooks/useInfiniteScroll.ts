import { useEffect, useCallback } from 'react';

interface UseInfiniteScrollOptions {
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
  threshold?: number; // Distance from bottom to trigger fetch (in pixels)
  enabled?: boolean;
}

export const useInfiniteScroll = ({
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
  threshold = 200,
  enabled = true,
}: UseInfiniteScrollOptions) => {
  const handleScroll = useCallback(() => {
    if (!enabled || !hasNextPage || isFetchingNextPage) return;

    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;

    // Check if user is near bottom
    const distanceFromBottom = documentHeight - (scrollTop + windowHeight);

    if (distanceFromBottom < threshold) {
      fetchNextPage();
    }
  }, [enabled, hasNextPage, isFetchingNextPage, fetchNextPage, threshold]);

  useEffect(() => {
    if (!enabled) return;

    // Throttle scroll events for better performance
    let ticking = false;

    const throttledHandleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', throttledHandleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', throttledHandleScroll);
    };
  }, [handleScroll, enabled]);

  return {
    isNearBottom: false, // Could be calculated if needed
  };
};