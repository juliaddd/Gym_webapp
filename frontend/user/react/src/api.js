import config from './config';

const apiBaseUrl = config.apiBaseUrl;

// Helper function
const handleResponse = async (response) => {
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorText}`);
    }
    // For 204 No Content -> return null
    if (response.status === 204) {
        return null;
    }
    return response.json();
};

// === Users ===

// Create a new user
export const createUser = async (userData) => {
    try {
        const response = await fetch(`${apiBaseUrl}/users/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });
        return handleResponse(response);
    } catch (error) {
        console.error('Error creating user:', error);
        throw error;
    }
};

// Get list of users with pagination
export const fetchUsers = async (skip = 0, limit = 100) => {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${apiBaseUrl}/users/?skip=${skip}&limit=${limit}`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            }
        );
        return handleResponse(response);
    } catch (error) {
        console.error('Error fetching users:', error);
        throw error;
    }
};

// Get user by ID
export const fetchUserById = async (userId) => {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${apiBaseUrl}/users/${userId}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
        return handleResponse(response);
    } catch (error) {
        console.error(`Error fetching user with ID ${userId}:`, error);
        throw error;
    }
};
// User login
export const loginUser = async (credentials) => {
    try {
        const formData = new URLSearchParams();
        formData.append('username', credentials.email);
        formData.append('password', credentials.password);

        const response = await fetch(`${apiBaseUrl}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: formData.toString(),
        });
        return handleResponse(response);
    } catch (error) {
        console.error('Error logging in user:', error);
        throw error;
    }
};

// Get user statistics by subscription type
export const fetchUserStatsBySubscription = async () => {
    try {
        const response = await fetch(`${apiBaseUrl}/users/stats/subscriptions`);
        return handleResponse(response);
    } catch (error) {
        console.error('Error fetching user stats by subscription:', error);
        throw error;
    }
};

// Search users with filters
export const searchUsers = async (search = '', subscriptionType = '', role = '') => {
    try {
        const params = new URLSearchParams();
        if (search) params.append('search', search);
        if (subscriptionType) params.append('subscription_type', subscriptionType);
        if (role) params.append('role', role);
        const response = await fetch(`${apiBaseUrl}/users/search/?${params.toString()}`);
        return handleResponse(response);
    } catch (error) {
        console.error('Error searching users:', error);
        throw error;
    }
};

// Update user information
export const updateUser = async (userId, userData) => {
    try {
        const response = await fetch(`${apiBaseUrl}/users/${userId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });
        return handleResponse(response);
    } catch (error) {
        console.error(`Error updating user with ID ${userId}:`, error);
        throw error;
    }
};

// Delete user
export const deleteUser = async (userId) => {
    try {
        console.log("I AM IN.");
        const token = localStorage.getItem('token');
        const response = await fetch(`${apiBaseUrl}/users/${userId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
        return handleResponse(response);
    } catch (error) {
        console.error(`Error deleting user with ID ${userId}:`, error);
        throw error;
    }
};

// === Categories ===

// Get all categories
export const fetchCategories = async () => {
    try {
        const response = await fetch(`${apiBaseUrl}/categories/`);
        return handleResponse(response);
    } catch (error) {
        console.error('Error fetching categories:', error);
        throw error;
    }
};

// Get category by ID
export const fetchCategoryById = async (categoryId) => {
    try {
        const response = await fetch(`${apiBaseUrl}/categories/${categoryId}`);
        return handleResponse(response);
    } catch (error) {
        console.error(`Error fetching category with ID ${categoryId}:`, error);
        throw error;
    }
};

// === Trainings ===

// Create new training
export const createTraining = async (trainingData) => {
    try {
        const response = await fetch(`${apiBaseUrl}/trainings/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(trainingData),
        });
        return handleResponse(response);
    } catch (error) {
        console.error('Error creating training:', error);
        throw error;
    }
};

// Get training statistics by category with date range
export const fetchStatsByCategory = async (userId, dateFrom, dateTo) => {
    try {
        const token = localStorage.getItem('token');
        const params = new URLSearchParams({
            date_from: dateFrom,
            date_to: dateTo,
        });
        if (userId !== undefined && userId !== null) params.append('user_id', userId.toString());
        const response = await fetch(`${apiBaseUrl}/trainings/stats/by-category/?${params.toString()}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
        return handleResponse(response);
    } catch (error) {
        console.error('Error fetching stats by category:', error);
        throw error;
    }
};

// Get all-time training statistics by category
export const fetchStatsAllTime = async (userId) => {
    try {
        const response = await fetch(`${apiBaseUrl}/trainings/stats/by-category/${userId}`);
        return handleResponse(response);
    } catch (error) {
        console.error(`Error fetching all-time stats for user ID ${userId}:`, error);
        throw error;
    }
};

// Get total training time
export const fetchTotalTrainingTime = async (userId, dateFrom, dateTo) => {
    try {
        const token = localStorage.getItem('token');
      const params = new URLSearchParams({
        date_from: dateFrom,
        date_to: dateTo,
      });
      if (userId) params.append('user_id', userId);
      const response = await fetch(`${apiBaseUrl}/trainings/stats/total-time/?${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error fetching total training time:', error);
      throw error;
    }
};

// Get statistics by category and subscription type
export const fetchStatsByCategoryAndSubscription = async (userId, dateFrom, dateTo) => {
    try {
        const params = new URLSearchParams({
            date_from: dateFrom,
            date_to: dateTo,
        });
        if (userId) params.append('user_id', userId);
        const response = await fetch(`${apiBaseUrl}/trainings/stats/by-subscription/?${params.toString()}`);
        return handleResponse(response);
    } catch (error) {
        console.error('Error fetching stats by category and subscription:', error);
        throw error;
    }
};

// Get statistics by day of week
export const fetchStatsByDayOfWeek = async (userId, dateFrom, dateTo) => {
    try {
        const token = localStorage.getItem('token');
        const params = new URLSearchParams({
            date_from: dateFrom,
            date_to: dateTo,
        });
        if (userId) params.append('user_id', userId);
        const response = await fetch(`${apiBaseUrl}/trainings/stats/by-day-of-week/?${params.toString()}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
        return handleResponse(response);
    } catch (error) {
        console.error('Error fetching stats by day of week:', error);
        throw error;
    }
};