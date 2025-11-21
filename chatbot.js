let currentQuestion = 0;
let stressScore = 0;
let userAnswers = [];

const questions = [
    {
        q: "How often do you feel overwhelmed by your responsibilities?",
        options: ["Rarely", "Sometimes", "Often", "Very Often"],
        scores: [0, 1, 2, 3]
    },
    {
        q: "How well are you sleeping lately?",
        options: ["Very Well", "Fairly Well", "Not Great", "Poorly"],
        scores: [0, 1, 2, 3]
    },
    {
        q: "How often do you feel anxious or worried?",
        options: ["Rarely", "Sometimes", "Often", "Constantly"],
        scores: [0, 1, 2, 3]
    },
    {
        q: "How satisfied are you with your work-life balance?",
        options: ["Very Satisfied", "Satisfied", "Unsatisfied", "Very Unsatisfied"],
        scores: [0, 1, 2, 3]
    },
    {
        q: "How often do you take time for self-care activities?",
        options: ["Daily", "Weekly", "Monthly", "Rarely"],
        scores: [0, 1, 2, 3]
    }
];

function startChatbot() {
    currentQuestion = 0;
    stressScore = 0;
    userAnswers = [];
    const chatMessages = document.getElementById('chatMessages');
    chatMessages.innerHTML = '<div class="bot-message message">Hello! I\'m here to help you assess your stress levels. I\'ll ask you a few questions. Please answer honestly. 😊</div>';
    setTimeout(() => showQuestion(), 1000);
}

function showQuestion() {
    if (currentQuestion >= questions.length) {
        showResult();
        return;
    }

    const question = questions[currentQuestion];
    const chatMessages = document.getElementById('chatMessages');
    const chatOptions = document.getElementById('chatOptions');
    
    chatMessages.innerHTML += `<div class="bot-message message">${question.q}</div>`;
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    chatOptions.innerHTML = question.options.map((opt, idx) => 
        `<button onclick="selectAnswer(${idx})">${opt}</button>`
    ).join('');
}

function selectAnswer(optionIndex) {
    const question = questions[currentQuestion];
    const chatMessages = document.getElementById('chatMessages');
    
    // Add user's answer to chat
    chatMessages.innerHTML += `<div class="user-message message">${question.options[optionIndex]}</div>`;
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    // Store answer
    userAnswers.push({
        question: question.q,
        answer: question.options[optionIndex]
    });
    
    // Add to score
    stressScore += question.scores[optionIndex];
    currentQuestion++;
    
    // Clear options
    document.getElementById('chatOptions').innerHTML = '';
    
    // Show next question after delay
    setTimeout(() => showQuestion(), 800);
}

async function showResult() {
    const chatMessages = document.getElementById('chatMessages');
    const chatOptions = document.getElementById('chatOptions');
    
    let level, advice, color;
    
    if (stressScore <= 4) {
        level = "Low Stress";
        color = "#4caf50";
        advice = "Great job! You're managing stress well. Keep up your healthy habits and self-care routines.";
    } else if (stressScore <= 8) {
        level = "Moderate Stress";
        color = "#ff9800";
        advice = "You're experiencing some stress. Try incorporating more relaxation techniques and consider talking to someone you trust.";
    } else {
        level = "High Stress";
        color = "#f44336";
        advice = "Your stress levels are elevated. Please prioritize self-care and consider speaking with a mental health professional for support.";
    }
    
    chatMessages.innerHTML += `
        <div class="stress-result" style="background: ${color};">
            <h3>Your Stress Level: ${level}</h3>
            <p>${advice}</p>
            <p style="margin-top: 1rem;">Score: ${stressScore}/15</p>
        </div>
    `;
    
    chatOptions.innerHTML = '<button onclick="startChatbot()">Take Assessment Again</button>';
    chatMessages.scrollTop = chatMessages.scrollHeight;

    // Save assessment to backend
    try {
        const assessmentData = {
            score: stressScore,
            level: level,
            timestamp: new Date().toISOString(),
            answers: userAnswers
        };
        
        await API.submitStressAssessment(assessmentData);
        console.log('Assessment saved successfully');
    } catch (error) {
        console.error('Failed to save assessment:', error);
    }
}