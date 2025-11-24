// API Configuration
const API_CONFIG = {
    BASE_URL: 'http://localhost:8080/api',
    ENDPOINTS: {
        // Auth endpoints
        REGISTER: '/auth/register',
        LOGIN: '/auth/login',
        LOGOUT: '/auth/logout',
        
        // User endpoints
        USER_PROFILE: '/users/profile',
        UPDATE_PROFILE: '/users/profile',
        
        // Assessment endpoints
        CREATE_ASSESSMENT: '/assessments',
        GET_ASSESSMENTS: '/assessments/user',
        GET_ASSESSMENT_BY_ID: '/assessments',
        DELETE_ASSESSMENT: '/assessments'
    }
};

// Get full API URL
function getApiUrl(endpoint) {
    return API_CONFIG.BASE_URL + endpoint;
}
