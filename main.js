function showSection(section) {
    // Remove active class from all sections
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    
    // Remove active class from all nav links
    document.querySelectorAll('nav a').forEach(a => a.classList.remove('active'));
    
    // Add active class to selected section
    document.getElementById(section).classList.add('active');
    
    // Add active class to corresponding nav link
    event.target.classList.add('active');
    
    // Special handling for chatbot section
    if (section === 'chatbot') {
        startChatbot();
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    console.log('Mindful Balance application loaded');
    
    // Check if user is logged in
    const currentUser = getCurrentUser();
    if (currentUser) {
        displayWelcomeMessage(currentUser);
    }
});

// Cleanup on page unload
window.addEventListener('beforeunload', function() {
    if (breathingInterval) {
        clearInterval(breathingInterval);
    }
});

console.log('All scripts loaded successfully!');