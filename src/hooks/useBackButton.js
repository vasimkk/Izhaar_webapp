import { useEffect, useState, useCallback } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Hook to handle mobile back button behavior and show a confirmation modal.
 * Optimized for React Router 7 and modern mobile browsers.
 */
const useBackButton = () => {
    const location = useLocation();
    const [showExitModal, setShowExitModal] = useState(false);

    // Define paths where we want to intercept the back button to show exit modal
    // Added more home-like paths to ensure coverage
    const rootPaths = ['/', '/user/dashboard', '/entry', '/welcome', '/user/true-connection'];

    useEffect(() => {
        const isRootPath = rootPaths.includes(location.pathname);

        if (isRootPath) {
            // Logic to intercept the back button:
            // 1. We stay in an extra 'locked' state so that a back press triggers popstate without leaving
            if (!window.history.state || !window.history.state.noBack) {
                window.history.pushState({ noBack: true }, '');
            }

            const handlePopState = (event) => {
                // If we popped into a state that doesn't have our flag, it means user pressed "Back"
                if (!event.state || !event.state.noBack) {
                    // Prevent default back behavior and show our custom modal
                    setShowExitModal(true);

                    // Re-push the dummy state so the user remains on the current page
                    // and the next back button can be intercepted again
                    window.history.pushState({ noBack: true }, '');
                }
            };

            window.addEventListener('popstate', handlePopState);
            return () => {
                window.removeEventListener('popstate', handlePopState);
            };
        } else {
            // Not a root path, make sure modal is hidden
            setShowExitModal(false);
        }
    }, [location.pathname]);

    const handleConfirmExit = useCallback(() => {
        // To exit, we try to go back past the history we created
        // and ideally leave the site entirely.
        try {
            // Go back past our current state and the entry page
            window.history.go(-10);

            // Fallback for standalone apps or browsers that don't leave on go(-10)
            setTimeout(() => {
                if (window.opener) {
                    window.close();
                }
                // Final fallback: just go to a blank page to simulate exit
                window.location.href = "about:blank";
            }, 300);
        } catch (e) {
            window.location.href = "about:blank";
        }
    }, []);

    const handleCancelExit = useCallback(() => {
        setShowExitModal(false);
    }, []);

    return { showExitModal, handleConfirmExit, handleCancelExit };
};

export default useBackButton;
