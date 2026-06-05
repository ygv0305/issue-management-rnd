// Node modules
import type React from 'react';

/**
 * Scrolls a container element to its bottom
 * @param containerRef - React ref object pointing to the scrollable container
 * @param behavior - Scroll behavior: 'smooth' for animated scroll, 'auto' for instant (default: 'smooth')
 */
export function scrollToBottom(
  containerRef: React.RefObject<HTMLDivElement | null>,
  behavior: ScrollBehavior = 'smooth',
): void {
  if (containerRef.current) {
    containerRef.current.scrollTo({
      top: containerRef.current.scrollHeight,
      behavior,
    });
  }
}

/**
 * Checks if a container is scrolled to the bottom (within a small threshold)
 * @param containerRef - React ref object pointing to the scrollable container
 * @param threshold - Pixel threshold for considering "at bottom" (default: 50px)
 * @returns boolean indicating if container is at bottom
 */
export function isAtBottom(
  containerRef: React.RefObject<HTMLDivElement | null>,
  threshold = 50,
): boolean {
  if (!containerRef.current) return true;

  const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
  return scrollHeight - scrollTop - clientHeight < threshold;
}
