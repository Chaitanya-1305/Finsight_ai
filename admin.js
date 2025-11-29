// Admin Dashboard Functions
const API_URL = 'http://localhost:5000/api';

const AdminDashboard = {
    // Load all admin data
    async loadAllData() {
        try {
            await Promise.all([
                this.loadStats(),
                this.loadUsers(),
                this.loadAnalyses()
            ]);
        } catch (error) {
            console.error('Error loading admin data:', error);
            Utils.showToast('Error loading dashboard data', 'error');
        }
    },

    // Load statistics
    async loadStats() {
        try {
            const response = await AuthHelper.authenticatedFetch(`${API_URL}/admin/stats`);
            const data = await response.json();

            document.getElementById('totalUsers').textContent = data.totalUsers || 0;
            document.getElementById('totalAnalyses').textContent = data.totalAnalyses || 0;
            document.getElementById('activeToday').textContent = data.activeToday || 0;

        } catch (error) {
            console.error('Error loading stats:', error);
        }
    },

    // Load users table
    async loadUsers() {
        try {
            const tbody = document.getElementById('usersTableBody');
            Utils.showLoading(tbody, 'Loading users...');

            const response = await AuthHelper.authenticatedFetch(`${API_URL}/admin/users`);
            const users = await response.json();

            tbody.innerHTML = '';

            // Filter out admins
            const regularUsers = users.filter(u => u.role !== 'admin');

            if (regularUsers.length === 0) {
                tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; color: rgba(255, 255, 255, 0.5);">No users found</td></tr>';
                return;
            }

            // Show top 10 users
            regularUsers.slice(0, 10).forEach(user => {
                const tr = document.createElement('tr');
                const joinDate = Utils.formatDate(user.created_at);
                
                tr.innerHTML = `
                    <td>${user.name}</td>
                    <td>${user.email}</td>
                    <td>${user.analysis_count || 0}</td>
                    <td>${joinDate}</td>
                    <td><span class="status-badge status-active">Active</span></td>
                    <td>
                        <button class="action-btn btn-view" onclick="AdminDashboard.viewUser(${user.id})">
                            <i class="fas fa-eye"></i> View
                        </button>
                        <button class="action-btn btn-delete" onclick="AdminDashboard.deleteUser(${user.id})">
                            <i class="fas fa-trash"></i> Delete
                        </button>
                    </td>
                `;
                tbody.appendChild(tr);
            });

        } catch (error) {
            console.error('Error loading users:', error);
            Utils.showError('usersTableBody', 'Failed to load users');
        }
    },

    // Load analyses table
    async loadAnalyses() {
        try {
            const tbody = document.getElementById('analysesTableBody');
            Utils.showLoading(tbody, 'Loading analyses...');

            const response = await AuthHelper.authenticatedFetch(`${API_URL}/admin/analyses`);
            const analyses = await response.json();

            tbody.innerHTML = '';

            if (analyses.length === 0) {
                tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; color: rgba(255, 255, 255, 0.5);">No analyses found</td></tr>';
                return;
            }

            // Show top 10 analyses
            analyses.slice(0, 10).forEach(analysis => {
                const tr = document.createElement('tr');
                const date = Utils.formatDate(analysis.created_at);
                const size = Utils.formatFileSize(analysis.file_size);
                
                tr.innerHTML = `
                    <td>${analysis.user_name || 'Unknown'}</td>
                    <td>${analysis.file_name}</td>
                    <td>${size}</td>
                    <td>${date}</td>
                    <td><span class="status-badge status-active">Completed</span></td>
                    <td>
                        <button class="action-btn btn-view" onclick="AdminDashboard.viewAnalysis(${analysis.id})">
                            <i class="fas fa-eye"></i> View
                        </button>
                    </td>
                `;
                tbody.appendChild(tr);
            });

        } catch (error) {
            console.error('Error loading analyses:', error);
            Utils.showError('analysesTableBody', 'Failed to load analyses');
        }
    },

    // View user details
    viewUser(userId) {
        Utils.showToast('User details modal - To be implemented', 'success');
        // Implement user details modal here
    },

    // Delete user
    async deleteUser(userId) {
        if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
            return;
        }

        try {
            // Implement delete user API call
            Utils.showToast('User deletion - To be implemented', 'success');
            // After successful deletion, reload users
            // await this.loadUsers();
        } catch (error) {
            console.error('Error deleting user:', error);
            Utils.showToast('Failed to delete user', 'error');
        }
    },

    // View analysis details
    viewAnalysis(analysisId) {
        Utils.showToast('Analysis details modal - To be implemented', 'success');
        // Implement analysis details modal here
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AdminDashboard;
}
