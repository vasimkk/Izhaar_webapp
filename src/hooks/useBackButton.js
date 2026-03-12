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
    const rootPaths = ['/user/dashboard', '/entry', '/welcome'];

    const checkIsRoot = useCallback((path) => {
        const normalized = path.endsWith('/') && path.length > 1 ? path.slice(0, -1) : path;
        return rootPaths.includes(normalized);
    }, []);

    useEffect(() => {
        const currentIsRoot = checkIsRoot(location.pathname);

        // Update the marker for the current path
        const currentState = window.history.state || {};
        if (currentIsRoot && !currentState.isExitGuard) {
            window.history.replaceState({ ...currentState, isExitGuard: true }, '');
        }

        const handlePopState = (event) => {
            // Check if we are still on a root path
            const isTargetRoot = checkIsRoot(window.location.pathname);

            // If we are at a root path but the state doesn't have our guard,
            // it means the user pressed "Back" to try and leave the app.
            if (isTargetRoot && (!event.state || !event.state.isExitGuard)) {
                setShowExitModal(true);

                // Block the exit by pushing the guard state back
                const stateToRePush = event.state || {};
                window.history.pushState({ ...stateToRePush, isExitGuard: true }, '');
            } else {
                // If it's a normal navigation or we are moving between guarded roots, keep modal hidden
                setShowExitModal(false);
            }
        };

        window.addEventListener('popstate', handlePopState);
        return () => {
            window.removeEventListener('popstate', handlePopState);
        };
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
