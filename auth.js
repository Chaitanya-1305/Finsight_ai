// Authentication Helper Functions
const API_URL = 'http://localhost:5000/api';

// Token management
const AuthHelper = {
    // Save token
    saveToken(token) {
        localStorage.setItem('token', token);
    },

    // Get token
    getToken() {
        return localStorage.getItem('token');
    },

    // Remove token
    removeToken() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },

    // Save user data
    saveUser(user) {
        localStorage.setItem('user', JSON.stringify(user));
    },

    // Get user data
    getUser() {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },

    // Check if logged in
    isLoggedIn() {
        return !!this.getToken();
    },

    // Check if admin
    isAdmin() {
        const user = this.getUser();
        return user && user.role === 'admin';
    },

    // Logout
    logout() {
        this.removeToken();
        window.location.href = 'login.html';
    },

    // Get auth headers
    getAuthHeaders() {
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.getToken()}`
        };
    },

    // Make authenticated request
    async authenticatedFetch(url, options = {}) {
        const token = this.getToken();
        
        if (!token) {
            throw new Error('Not authenticated');
        }

        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            ...options.headers
        };

        const response = await fetch(url, {
            ...options,
            headers
        });

        // If unauthorized, redirect to login
        if (response.status === 401 || response.status === 403) {
            this.logout();
            throw new Error('Session expired. Please login again.');
        }

        return response;
    },

    // Require authentication (call this on protected pages)
    requireAuth() {
        if (!this.isLoggedIn()) {
            window.location.href = 'login.html';
            return false;
        }
        return true;
    },

    // Require admin (call this on admin pages)
    requireAdmin() {
        if (!this.isLoggedIn() || !this.isAdmin()) {
            window.location.href = 'login.html';
            return false;
        }
        return true;
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AuthHelper;
}
