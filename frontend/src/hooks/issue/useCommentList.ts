// Node modules
import { useEffect, useRef, useState, useCallback } from 'react';

// Types
import type { CommentData } from '../../types/issueTypes';

// Utils
import { scrollToBottom, isAtBottom } from '../../utils/scrollToBottomComment';

interface UseCommentListProps {
  comments: CommentData[];
  isLoading: boolean;
  fetchNextPage: () => void;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
}

export function useCommentList({
  comments,
  isLoading,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
}: UseCommentListProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const lastScrollHeightRef = useRef<number>(0);
  const isInitialLoadRef = useRef<boolean>(true);

  const handleScroll = useCallback(() => {
    if (!scrollContainerRef.current) return;

    const { scrollTop } = scrollContainerRef.current;
    setShowScrollButton(!isAtBottom(scrollContainerRef));

    // Reverse Infinite Scroll Logic
    // If the user scrolls to the top (scrollTop === 0) and more pages exist, fetch them
    if (scrollTop === 0 && hasNextPage && !isFetchingNextPage) {
      // Record current scrollHeight so we can adjust scroll position after loading
      lastScrollHeightRef.current = scrollContainerRef.current.scrollHeight;
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Handle scroll position preservation when older comments are loaded at the top
  useEffect(() => {
    if (
      scrollContainerRef.current &&
      lastScrollHeightRef.current > 0 &&
      !isFetchingNextPage
    ) {
      // Calculate how much the height increased
      const newScrollHeight = scrollContainerRef.current.scrollHeight;
      const heightDifference = newScrollHeight - lastScrollHeightRef.current;

      // Offset the scroll position by the height difference to prevent the "jump"
      scrollContainerRef.current.scrollTop = heightDifference;
      lastScrollHeightRef.current = 0;
    }
  }, [comments, isFetchingNextPage]);

  const handleScrollToBottom = () => {
    scrollToBottom(scrollContainerRef);
  };

  // Auto-scroll to bottom only on initial load or when a NEW comment (not paginated) is added
  useEffect(() => {
    if (
      comments.length > 0 &&
      !isLoading &&
      !isFetchingNextPage &&
      lastScrollHeightRef.current === 0
    ) {
      if (isInitialLoadRef.current) {
        // Unconditional scroll to bottom on initial load
        scrollToBottom(scrollContainerRef, 'auto');
        isInitialLoadRef.current = false;
      } else {
        // If we are already near the bottom, scroll to bottom
        if (isAtBottom(scrollContainerRef, 100)) {
          scrollToBottom(scrollContainerRef, 'smooth');
        }
      }
    }
  }, [comments.length, isLoading, isFetchingNextPage]);

  return {
    scrollContainerRef,
    showScrollButton,
    handleScroll,
    handleScrollToBottom,
  };
}
