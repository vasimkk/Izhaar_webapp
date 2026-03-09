import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Hook to handle mobile back button behavior and show a confirmation modal.
 */
const useBackButton = () => {
    const location = useLocation();
    const [showExitModal, setShowExitModal] = useState(false);

    // Define paths where we want to intercept the back button to show exit modal
    const rootPaths = ['/', '/user/dashboard', '/entry', '/welcome'];

    useEffect(() => {
        const isRootPath = rootPaths.includes(location.pathname);

        if (isRootPath) {
            // Push an initial dummy state if not already there
            if (!window.history.state || !window.history.state.noBack) {
                window.history.pushState({ noBack: true }, '');
            }

            const handlePopState = (event) => {
                // If we popped into a state that doesn't have our flag, it means user pressed "Back"
                if (!event.state || !event.state.noBack) {
                    // Prevent default back behavior and show our custom modal
                    setShowExitModal(true);
                    
                    // Re-push the dummy state so the next back button can be intercepted again
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

    const handleConfirmExit = () => {
        // To truly exit a web app, we let the default back behavior happen multiple times 
        // until we leave the app's history stack. Usually history.go(-(history.length))
        // or just let them go back to whatever site they came from.
        window.history.go(-2); // Go back past our dummy state and the current page
    };

    const handleCancelExit = () => {
        setShowExitModal(false);
    };

    return { showExitModal, handleConfirmExit, handleCancelExit };
};

export default useBackButton;
