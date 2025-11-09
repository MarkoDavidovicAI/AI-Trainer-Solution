// ---------- FAQ LOAD ----------
let faqData = []; // ovde čuvamo sva pitanja

// učitavanje FAQ iz faq.json
async function loadFAQ() {
    try {
        const response = await fetch('faq.json');
        faqData = await response.json();
        populateCategories(); // popuni dropdown kategorije
    } catch (err) {
        console.error('Failed to load FAQ', err);
        faqData = [];
    }
}

window.onload = () => {
    loadFAQ();
};

// ---------- CHAT LOGIKA ----------
const chatWindow = document.getElementById('chatWindow');
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');
const resetBtn = document.getElementById('resetBtn');
const typingIndicator = document.getElementById('typingIndicator');
const categorySelect = document.getElementById('categorySelect');

// funkcija za dodavanje poruke u chat
function appendMessage(message, sender) {
    const div = document.createElement('div');
    div.textContent = message;
    div.classList.add('chat-message', sender);
    chatWindow.appendChild(div);
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

// funkcija koja traži odgovor iz faqData
function getAnswer(userInput) {
    const question = userInput.toLowerCase();
    // traži samo u odabranoj kategoriji ako je selektovana
    const category = categorySelect.value;
    let searchData = faqData;

    if (category && category !== 'all') {
        searchData = faqData.filter(faq => faq.category.toLowerCase() === category.toLowerCase());
    }

    const match = searchData.find(faq => faq.question.toLowerCase() === question);
    if (match) {
        return match.answer;
    } else {
        return "I'm sorry, I don't know the answer yet.";
    }
}

// funkcija za popunjavanje dropdown sa kategorijama
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

// ---------- SEND MESSAGE ----------
sendBtn.addEventListener('click', () => {
    const question = userInput.value.trim();
    if (!question) return;

    appendMessage(question, 'user');
    userInput.value = '';

    typingIndicator.classList.remove('hidden');

    setTimeout(() => {
        const answer = getAnswer(questio
