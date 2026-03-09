import { useEffect, useState, useCallback, useRef } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Hook to handle mobile back button behavior and show a confirmation modal.
 * Optimized for React Router 7 and modern mobile browsers.
 */
const useBackButton = () => {
    const location = useLocation();
    const [showExitModal, setShowExitModal] = useState(false);
    const lastPathRef = useRef(location.pathname);

    // Define paths where we want to intercept the back button to show exit modal
    const rootPaths = ['/', '/user/dashboard', '/entry', '/welcome',];

    const checkIsRoot = useCallback((path) => {
        const normalized = path.endsWith('/') && path.length > 1 ? path.slice(0, -1) : path;
        return rootPaths.includes(normalized);
    }, []);

    useEffect(() => {
        const currentIsRoot = checkIsRoot(location.pathname);
        lastPathRef.current = location.pathname;

        if (currentIsRoot) {
            // Logic to intercept the back button:
            // Crucial: We MUST merge with existing state so we don't break React Router (idx, key, usr)
            const currentState = window.history.state || {};

            // Check if we are already in the guard state
            if (!currentState.isExitGuard) {
                // If not, push the guard state. 
                // This adds an extra entry in history that points to the SAME URL but with a marker.
                window.history.pushState({ ...currentState, isExitGuard: true }, '');
            }

            const handlePopState = (event) => {
                // If we popped into a state that doesn't have our flag, it means user pressed "Back"
                // but stayed on the same path (or is trying to leave it)
                if (!event.state || !event.state.isExitGuard) {
                    // Trigger the modal
                    setShowExitModal(true);

                    // Re-push the guard state immediately so they don't actually leave the app
                    const stateToRePush = event.state || {};
                    window.history.pushState({ ...stateToRePush, isExitGuard: true }, '');
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
    }, [location.pathname, checkIsRoot]);

    const handleConfirmExit = useCallback(() => {
        try {
            // Try to jump back far enough to exit the app's history
            window.history.go(-20);

            // Redirect to Google as the "exit" page
            setTimeout(() => {
                window.location.href = "https://www.google.com";
                if (window.opener) window.close();
            }, 50);
        } catch (e) {
            window.location.href = "https://www.google.com";
        }
    }, []);

    const handleCancelExit = useCallback(() => {
        setShowExitModal(false);
    }, []);

    return { showExitModal, handleConfirmExit, handleCancelExit };
};

export default useBackButton;
