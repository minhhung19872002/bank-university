/**
 * Router Utility
 * Provides helper functions for navigation and route matching
 * Requires ROUTES_CONFIG from js/config/routes.js
 */

const Router = {
    /**
     * Find parent route for a given path
     * @param {string} currentPath - Current page path
     * @returns {object|null} - Parent route object or null
     */
    findParentRoute(currentPath) {
        if (typeof ROUTES_CONFIG === 'undefined') {
            console.warn('ROUTES_CONFIG not loaded. Include js/config/routes.js first.');
            return null;
        }

        // Normalize path
        let normalized = currentPath.replace(/\/$/, '') || '/';
        if (normalized !== '/') normalized += '/';

        // Check exact match first
        for (const route of ROUTES_CONFIG) {
            if (route.path === normalized) {
                return route;
            }
        }

        // Check if current path is a child route
        for (const route of ROUTES_CONFIG) {
            // Check defined children
            for (const child of route.children) {
                if (normalized === child || normalized.startsWith(child)) {
                    return route;
                }
            }

            // Check if path starts with parent (for dynamic child pages)
            if (route.path !== '/' && normalized.startsWith(route.path)) {
                return route;
            }
        }

        return null;
    },

    /**
     * Get active nav label for current path
     * @param {string} currentPath - Current page path
     * @returns {string|null} - Nav label to highlight or null
     */
    getActiveNavLabel(currentPath) {
        const route = this.findParentRoute(currentPath);
        return route ? route.label : null;
    }
};
