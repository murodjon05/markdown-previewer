import { useEffect, useRef } from 'react';

/**
 * Custom hook for synchronizing scroll positions between two elements
 * Uses scroll percentage to handle different content heights
 *
 * @param {React.RefObject} sourceRef - Reference to the source element (editor)
 * @param {React.RefObject} targetRef - Reference to the target element (preview)
 */
function useScrollSync(sourceRef, targetRef) {
    // Track which element is being scrolled to prevent feedback loops
    const isScrolling = useRef(false);
    const scrollTimeout = useRef(null);

    useEffect(() => {
        const source = sourceRef.current;
        const target = targetRef.current;

        if (!source || !target) return;

        /**
         * Calculate and apply scroll synchronization
         * @param {HTMLElement} scrolledElement - The element being scrolled
         * @param {HTMLElement} otherElement - The element to sync
         */
        const syncScroll = (scrolledElement, otherElement) => {
            if (isScrolling.current) return;

            isScrolling.current = true;

            // Calculate scroll percentage of the scrolled element
            const scrollHeight = scrolledElement.scrollHeight - scrolledElement.clientHeight;
            const scrollPercentage = scrollHeight > 0
                ? scrolledElement.scrollTop / scrollHeight
                : 0;

            // Apply the same percentage to the other element
            const otherScrollHeight = otherElement.scrollHeight - otherElement.clientHeight;
            otherElement.scrollTop = scrollPercentage * otherScrollHeight;

            // Reset the scrolling flag after a short delay
            clearTimeout(scrollTimeout.current);
            scrollTimeout.current = setTimeout(() => {
                isScrolling.current = false;
            }, 50);
        };

        // Event handlers
        const handleSourceScroll = () => syncScroll(source, target);
        const handleTargetScroll = () => syncScroll(target, source);

        // Add event listeners
        source.addEventListener('scroll', handleSourceScroll, { passive: true });
        target.addEventListener('scroll', handleTargetScroll, { passive: true });

        // Cleanup
        return () => {
            source.removeEventListener('scroll', handleSourceScroll);
            target.removeEventListener('scroll', handleTargetScroll);
            clearTimeout(scrollTimeout.current);
        };
    }, [sourceRef, targetRef]);
}

export default useScrollSync;