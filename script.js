let faqData = [];

// Učitavanje pitanja iz faq.json
async function loadFAQ() {
  try {
    const response = await fetch('faq.json');
    faqData = await response.json();
  } catch (err) {
    console.error('Failed to load FAQ', err);
    faqData = [];
  }
}

window.onload = () => {
  loadFAQ();
};

// 🔍 Funkcija koja traži odgovor po ključnim rečima
function getAnswer(userInput) {
  const input = userInput.toLowerCase();
  for (const faq of faqData) {
    if (
      faq.keywords.some(keyword =>
        input.includes(keyword.toLowerCase())
      )
    ) {
      return faq.answer;
    }
  }
  return "I’ll connect you to a live agent for further assistance.";
}

const chatWindow = document.getElementById('chatWindow');
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');
const resetBtn = document.getElementById('resetBtn');
const typingIndicator = document.getElementById('typingIndicator');

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
    const answer = getAnswer(question);
    appendMessage(answer, 'ai');
    typingIndicator.classList.add('hidden');
  }, 1000);
});

resetBtn.addEventListener('click', () => {
  chatWindow.innerHTML = '';
});
