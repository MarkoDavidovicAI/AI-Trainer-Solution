let faqData = []; // tu ćemo čuvati sva pitanja

// funkcija koja učitava FAQ iz faq.json
async function loadFAQ() {
  try {
    const response = await fetch('faq.json'); // uzima fajl iz repozitorijuma
    faqData = await response.json();          // čuva podatke u varijablu
  } catch (err) {
    console.error('Failed to load FAQ', err);
    faqData = [];
  }
}

// kada se stranica učita, poziva se loadFAQ()
window.onload = () => {
  loadFAQ();
};

// funkcija koja traži odgovor u faqData na osnovu korisnikovog pitanja
function getAnswer(userInput) {
  const question = userInput.toLowerCase();
  const match = faqData.find(faq => faq.question.toLowerCase() === question);
  if (match) {
    return match.answer; // vraća pravi odgovor iz JSON-a
  } else {
    return "I'm sorry, I don't know the answer yet."; // fallback
  }
}


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


