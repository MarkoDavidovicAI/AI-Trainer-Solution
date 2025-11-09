let faqData = [];

async function loadFAQ() {
    try {
        const response = await fetch('faq.json');
        faqData = await response.json();
        populateCategories();
    } catch (err) {
        console.error('Failed to load FAQ', err);
        faqData = [];
    }
}

window.onload = () => {
    loadFAQ();
};

const chatWindow = document.getElementById('chatWindow');
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');
const resetBtn = document.getElementById('resetBtn');
const typingIndicator = document.getElementById('typingIndicator');
const categorySelect = document.getElementById('categorySelect');

function appendMessage(message, sender) {
    const div = document.createElement('div');
    div.textContent = message;
    div.classList.add('chat-message', sender);
    chatWindow.appendChild(div);
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

function getAnswer(userInput) {
    const question = userInput.toLowerCase();
    const category = categorySelect.value;
    let searchData = faqData;

    if (category && category !== 'all') {
        searchData = faqData.filter(faq => faq.category.toLowerCase() === category.toLowerCase());
    }

    const match = searchData.find(faq => faq.question.toLowerCase().includes(question));
    if (match) {
        return match.answer;
    } else {
        return "Your question will be forwarded to a live agent.";
    }
}

function populateCategories() {
    if (!categorySelect) return;
    const categories = [...new Set(faqData.map(f => f.category))];
    categorySelect.innerHTML = '<option value="all">All</option>';
    categories.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat;
        option.textContent = cat;
        categorySelect.appendChild(option);
    });
}

sendBtn.addEventListener('click', () => {
    const question = userInput.value.trim();
    if (!question) return;

    appendMessage(question, 'user');
    userInput.value = '';

    typingIndicator.classList.remove('hidden');

    setTimeout(() => {
        const answer = getAnswer(question);
        appendMessage(answer, 'ai');
        typingIndicator.classList.add('hidden');
    }, 800);
});

userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendBtn.click();
});

resetBtn.addEventListener('click', () => {
    chatWindow.innerHTML = '';
});
