import { apiRequest } from './api';

// Authentication service
class AuthService {
  constructor() {
    this.token = localStorage.getItem('techbro24_token');
    this.user = JSON.parse(localStorage.getItem('techbro24_user') || 'null');
  }

  // Login user
  async login(emailOrUsername, password, userType) {
    try {
      let body;
      if (userType === 'agent') {
        body = { username: emailOrUsername, password, userType };
      } else {
        body = { email: emailOrUsername, password, userType };
      }
      const response = await apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify(body)
      });

      

      if (response.success) {
        this.token = response.data.token;
        this.user = response.data.user;

        // Store in localStorage
        localStorage.setItem('techbro24_token', this.token);
        localStorage.setItem('techbro24_user', JSON.stringify(this.user));
        localStorage.setItem('techbro24_agentId', this.user.id);

        return response;
      } else {
        throw new Error(response.error || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  // Register new agent
  async register(name, email, phone, role = 'agent') {
    try {
      const response = await apiRequest('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, phone, role })
      });

      return response;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  // Logout user
  async logout() {
    try {
      if (this.token) {
        await apiRequest('/auth/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.token}`
          }
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      this.clearAuth();
    }
  }

  // Get current user profile
  async getProfile() {
    try {
      const response = await apiRequest('/auth/profile', {
        headers: {
          'Authorization': `Bearer ${this.token}`
        }
      });

      if (response.success) {
        this.user = response.data;
        localStorage.setItem('techbro24_user', JSON.stringify(this.user));
        return response;
      }
    } catch (error) {
      console.error('Profile fetch error:', error);
      throw error;
    }
  }

  // Update user profile
  async updateProfile(updates) {
    try {
      const response = await apiRequest('/auth/profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${this.token}`
        },
        body: JSON.stringify(updates)
      });

      if (response.success) {
        this.user = response.data;
        localStorage.setItem('techbro24_user', JSON.stringify(this.user));
        return response;
      }
    } catch (error) {
      console.error('Profile update error:', error);
      throw error;
    }
  }

  // Change password
  async changePassword(currentPassword, newPassword) {
    try {
      const response = await apiRequest('/auth/change-password', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.token}`
        },
        body: JSON.stringify({ currentPassword, newPassword })
      });

      return response;
    } catch (error) {
      console.error('Password change error:', error);
      throw error;
    }
  }

  // Refresh token
  async refreshToken() {
    try {
      const response = await apiRequest('/auth/refresh', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.token}`
        }
      });

      if (response.success) {
        this.token = response.data.token;
        localStorage.setItem('techbro24_token', this.token);
        return response;
      }
    } catch (error) {
      console.error('Token refresh error:', error);
      this.clearAuth();
      throw error;
    }
  }

  // Check authentication status
  async checkAuth() {
    try {
      if (!this.token) {
        return { authenticated: false };
      }

      const response = await apiRequest('/auth/check', {
        headers: {
          'Authorization': `Bearer ${this.token}`
        }
      });

      return response.data;
    } catch (error) {
      console.error('Auth check error:', error);
      this.clearAuth();
      return { authenticated: false };
    }
  }

  // Get all users (admin only)
  async getAllUsers() {
    try {
      const response = await apiRequest('/auth/users', {
        headers: {
          'Authorization': `Bearer ${this.token}`
        }
      });

      return response;
    } catch (error) {
      console.error('Users fetch error:', error);
      throw error;
    }
  }

  // Clear authentication data
  clearAuth() {
    this.token = null;
    this.user = null;
    localStorage.removeItem('techbro24_token');
    localStorage.removeItem('techbro24_user');
    localStorage.removeItem('techbro24_agentId');
  }

  // Get current token
  getToken() {
    return this.token;
  }

  // Get current user
  getUser() {
    return this.user;
  }

  // Check if user is authenticated
  isAuthenticated() {
    return !!this.token && !!this.user;
  }

  // Check if user has specific role
  hasRole(role) {
    return this.user && this.user.role === role;
  }

  // Check if user has specific permission
  hasPermission(permission) {
    if (!this.user || !this.user.permissions) return false;
    return this.user.permissions.includes('all') || this.user.permissions.includes(permission);
  }

  // Get user role
  getUserRole() {
    return this.user ? this.user.role : null;
  }

  // Get user ID
  getUserId() {
    return this.user ? this.user.id : null;
  }

  // Get user name
  getUserName() {
    return this.user ? this.user.name : null;
  }

  // Get user email
  getUserEmail() {
    return this.user ? this.user.email : null;
  }
}

// Create singleton instance
const authService = new AuthService();

export default authService; 