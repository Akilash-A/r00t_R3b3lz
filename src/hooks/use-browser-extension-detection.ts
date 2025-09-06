'use client';

import { useEffect, useState } from 'react';

/**
 * Hook to detect if browser extensions (like Dark Reader) are modifying the DOM.
 * This can be useful for conditionally applying suppressHydrationWarning or
 * adjusting component behavior when extensions are detected.
 */
export function useBrowserExtensionDetection() {
  const [hasExtensions, setHasExtensions] = useState(false);

  useEffect(() => {
    // Check for common browser extension indicators
    const checkForExtensions = () => {
      // Check for Dark Reader
      const hasDarkReader = 
        document.documentElement.hasAttribute('data-darkreader-mode') ||
        document.documentElement.hasAttribute('data-darkreader-scheme') ||
        document.querySelector('[data-darkreader-inline-bgcolor]') !== null ||
        document.querySelector('[data-darkreader-inline-color]') !== null;

      // Check for other common extensions
      const hasOtherExtensions = 
        document.querySelector('[data-extension]') !== null ||
        document.querySelector('[data-adblock]') !== null ||
        document.querySelector('[data-grammarly]') !== null;

      setHasExtensions(hasDarkReader || hasOtherExtensions);
    };

    // Initial check
    checkForExtensions();

    // Check periodically as extensions may load after initial render
    const interval = setInterval(checkForExtensions, 1000);

    // Cleanup
    return () => clearInterval(interval);
  }, []);

  return hasExtensions;
}
