const chatWindow = document.getElementById('chatWindow');
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');
const resetBtn = document.getElementById('resetBtn');
const typingIndicator = document.getElementById('typingIndicator');
const categorySelect = document.getElementById('categorySelect');

const placeholderResponses = {
    personal: {
        "What is my DOB?": "Your DOB is stored securely. For demo purposes, let's say January 1, 1990.",
        "Tell me about me": "You are a valued client. Placeholder AI is here to demonstrate training."
    },
    technical: {
        "App not working": "Please try restarting the app. If the issue persists, contact support.",
        "How to reset password?": "Go to Settings → Account → Reset Password."
    },
    other: {
        "General question": "This is a placeholder response for other inquiries.",
        "Help": "Our AI assistant is here to help with any type of question."
    }
};

function appendMessage(message, sender) {
    const div = document.createElement('div');
    div.textContent = message;
    div.classList.add('chat-message', sender);
    chatWindow.appendChild(div);
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

sendBtn.addEventListener('click', () => {
    const question = userInput.value.trim();
    if (!question) return;

    appendMessage(question, 'user');
    userInput.value = '';

    typingIndicator.classList.remove('hidden');

    setTimeout(() => {
        const category = categorySelect.value;
        const responses = placeholderResponses[category];
        let answer = responses[question] || "This is a placeholder response. In a real scenario, AI would generate a precise answer.";
        appendMessage(answer, 'ai');
        typingIndicator.classList.add('hidden');
    }, 1000);
});

resetBtn.addEventListener('click', () => {
    chatWindow.innerHTML = '';
});
