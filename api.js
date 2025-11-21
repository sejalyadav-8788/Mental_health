const API = {
    // Get current user ID
    getCurrentUserId() {
        const user = getCurrentUser();
        return user ? user.id : null;
    },

    // Stress Assessment APIs
    async submitStressAssessment(assessmentData) {
        try {
            const userId = this.getCurrentUserId();
            const response = await fetch(`${CONFIG.API_BASE_URL}/stress-assessment`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...assessmentData,
                    userId: userId
                })
            });
            
            if (!response.ok) {
                throw new Error('Failed to submit assessment');
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error submitting assessment:', error);
            throw error;
        }
    },

    async getUserAssessments() {
        try {
            const userId = this.getCurrentUserId();
            if (!userId) return [];
            
            const response = await fetch(`${CONFIG.API_BASE_URL}/stress-assessment/user/${userId}`);
            
            if (!response.ok) {
                throw new Error('Failed to fetch assessments');
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error fetching assessments:', error);
            return [];
        }
    },

    // Game Score APIs
    async saveGameScore(scoreData) {
        try {
            const userId = this.getCurrentUserId();
            const response = await fetch(`${CONFIG.API_BASE_URL}/game/score`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...scoreData,
                    userId: userId
                })
            });
            
            if (!response.ok) {
                throw new Error('Failed to save game score');
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error saving game score:', error);
            throw error;
        }
    },

    async getUserGameScores() {
        try {
            const userId = this.getCurrentUserId();
            if (!userId) return [];
            
            const response = await fetch(`${CONFIG.API_BASE_URL}/game/scores/${userId}`);
            
            if (!response.ok) {
                throw new Error('Failed to fetch game scores');
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error fetching game scores:', error);
            return [];
        }
    }
};