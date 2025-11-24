// API Helper Functions

// Get authorization header
function getAuthHeader() {
    const token = localStorage.getItem('token');
    return {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    };
}

// Generic API call wrapper - THIS WAS MISSING OR BROKEN
async function apiCall(endpoint, options = {}) {
    try {
        const token = localStorage.getItem('token');
        
        const defaultOptions = {
            headers: {
                'Content-Type': 'application/json',
                ...(token && { 'Authorization': `Bearer ${token}` })
            }
        };
        
        const url = getApiUrl(endpoint);
        console.log('API Call to:', url, 'with options:', options);
        
        const response = await fetch(url, { ...defaultOptions, ...options });
        
        console.log('Response status:', response.status);
        
        // Handle unauthorized
        if (response.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = 'login.html';
            return { success: false, error: 'Unauthorized' };
        }
        
        const data = await response.json();
        console.log('Response data:', data);
        
        if (!response.ok) {
            throw new Error(data.message || data.error || 'Something went wrong');
        }
        
        return { success: true, data };
        
    } catch (error) {
        console.error('API Error:', error);
        return { success: false, error: error.message };
    }
}

// User Authentication APIs
const AuthAPI = {
    register: async (userData) => {
        console.log('AuthAPI.register called with:', userData);
        
        try {
            const result = await apiCall(API_CONFIG.ENDPOINTS.REGISTER, {
                method: 'POST',
                body: JSON.stringify(userData)
            });
            
            console.log('Register API result:', result);
            
            // Handle nested response from ApiResponseDTO
            if (result && result.success && result.data) {
                if (result.data.success) {
                    return { 
                        success: true, 
                        data: result.data.data 
                    };
                } else {
                    return { 
                        success: false, 
                        error: result.data.message || 'Registration failed' 
                    };
                }
            }
            
            // If result is not successful
            if (result && !result.success) {
                return { 
                    success: false, 
                    error: result.error || 'Registration failed' 
                };
            }
            
            return result;
            
        } catch (error) {
            console.error('Register error:', error);
            return { 
                success: false, 
                error: error.message || 'Registration failed' 
            };
        }
    },
    
    login: async (credentials) => {
        console.log('AuthAPI.login called with email:', credentials.email);
        
        try {
            const result = await apiCall(API_CONFIG.ENDPOINTS.LOGIN, {
                method: 'POST',
                body: JSON.stringify(credentials)
            });
            
            console.log('Login API result:', result);
            
            // Handle nested response from ApiResponseDTO
            if (result && result.success && result.data) {
                if (result.data.success) {
                    return { 
                        success: true, 
                        data: result.data.data 
                    };
                } else {
                    return { 
                        success: false, 
                        error: result.data.message || 'Login failed' 
                    };
                }
            }
            
            // If result is not successful
            if (result && !result.success) {
                return { 
                    success: false, 
                    error: result.error || 'Login failed' 
                };
            }
            
            return result;
            
        } catch (error) {
            console.error('Login error:', error);
            return { 
                success: false, 
                error: error.message || 'Login failed' 
            };
        }
    }
};

export const AssessmentAPI = {

    submitAssessment: async (assessmentData) => {
        return await apiCall("/api/stress/assess", {
            method: "POST",
            body: JSON.stringify(assessmentData)
        });
    },

    getUserAssessments: async (userId) => {
        return await apiCall(`/api/stress/history/${userId}`);
    }
};




// User APIs
const UserAPI = {
    getProfile: async () => {
        return await apiCall(API_CONFIG.ENDPOINTS.USER_PROFILE);
    },
    
    updateProfile: async (profileData) => {
        return await apiCall(API_CONFIG.ENDPOINTS.UPDATE_PROFILE, {
            method: 'PUT',
            body: JSON.stringify(profileData)
        });
    }
};
export const ChatAPI = {

    sendMessage: async (userId, message) => {
        return await apiCall("/api/chat/send", {
            method: "POST",
            body: JSON.stringify({
                userId: userId,
                message: message
            })
        });
    },

    getHistory: async (userId) => {
        return await apiCall(`/api/chat/history/${userId}`);
    }
};
