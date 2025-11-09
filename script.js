// ---------- FAQ LOAD ----------
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

// ---------- CHAT ELEMENTI ----------
const chatWindow = document.getElementById('chatWindow');
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');
const resetBtn = document.getElementById('resetBtn');
const typingIndicator = document.getElementById('typingIndicator');
const categorySelect = document.getElementById('categorySelect');

// ---------- CHAT FUNKCIJE ----------
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
        searc
