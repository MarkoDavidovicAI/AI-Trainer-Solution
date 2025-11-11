// script.js

let faqData = []; // ovde ćemo čuvati sva pitanja

// učitavanje FAQ pitanja iz faq.json
async function loadFAQ() {
    try {
        const response = await fetch('faq.json');
        faqData = await response.json();
        populateDropdown();
    } catch (err) {
        console.error('Failed to load FAQ', err);
        faqData = [];
    }
}

// popunjavanje dropdown-a sa svim pitanjima
function populateDropdown() {
    const input = document.getElementById('userInput');
    const dropdown = document.getElementById('faqDropdown');

    faqData.forEach(faq => {
        const option = document.createElement('option');
        option.value = faq.question;
        dropdown.appendChild(option);
    });

    // kada korisnik klikne na input, dropdown se pojavi
    input.addEventListener('focus', () => {
        dropdown.style.display = 'block';
    });

    // kada korisnik izabere opciju iz dropdown-a
    dropdown.addEventListener('change', () => {
        input.value = dropdown.value;
        sendMessage(); // automatski pošalji izabrano pitanje
        dropdown.style.display = 'none';
    });

    // sakrij dropdown ako klikne van inputa
    document.addEventListener('click', (e) => {
        if (e.target !== input && e.target !== dropdown) {
            dropdown.style.display = 'none';
        }
    });
}

// pronalazi odgovor na osnovu ključnih reči
function getAnswer(userInput) {
    const input = userInput.toLowerCase();

    // tražimo sva pitanja koja sadrže neku ključnu reč
    const match = faqData.find(faq => {
        return faq.keywords.some(keyword => input.includes(keyword.toLowerCase()));
    });

    if (match) {
        return match.answer;
    } else {
        return "I'll connect you to a live agent for further assistance.";
    }
}

// prikaz poruke u chat prozoru
function appendMessage(message, sender) {
    const chatWindow = document.getElementById('chatWindow');
    const div = document.createElement('div');
    div.textContent = message;
    div.classList.add('chat-message', sender);
    chatWindow.appendChild(div);
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

// slanje poruke
function sendMessage() {
    const input = document.getElementById('userInput');
    const typingIndicator = document.getElementById('typingIndicator');
    const question = input.value.trim();
    if (!question) return;

    appendMessage(question, 'user');
    input.value = '';

    typingIndicator.classList.remove('hidden');

    setTimeout(() => {
        const answer = getAnswer(question);
        appendMessage(answer, 'ai');
        typingIndicator.classList.add('hidden');
    }, 800);
}

// reset chat
function resetChat() {
    const chatWindow = document.getElementById('chatWindow');
    chatWindow.innerHTML = '';
}

// inicijalizacija
window.onload = () => {
    loadFAQ();

    // dugmad
    document.getElementById('sendBtn').addEventListener('click', sendMessage);
    document.getElementById('resetBtn').addEventListener('click', resetChat);

    // enter key
    const input = document.getElementById('userInput');
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
};
