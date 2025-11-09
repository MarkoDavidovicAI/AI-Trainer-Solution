// ---------- FAQ LOAD ----------
let faqData = [];

async function loadFAQ() {
  try {
    const res = await fetch('faq.json');
    faqData = await res.json();
    buildSampleList();
  } catch (err) {
    console.error('Failed to load faq.json', err);
    faqData = [];
  }
}

window.addEventListener('load', loadFAQ);

// ---------- UI elements ----------
const chatWindow = document.getElementById('chatWindow');
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');
const resetBtn = document.getElementById('resetBtn');
const typingIndicator = document.getElementById('typingIndicator');
const sampleList = document.getElementById('sampleList');
const filterButtons = document.querySelectorAll('.filter-btn');

// ---------- helpers ----------
function appendMessage(text, sender) {
  const d = document.createElement('div');
  d.className = 'chat-message ' + sender;
  d.textContent = text;
  chatWindow.appendChild(d);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

// very simple keyword matching + question includes
function findBestMatch(text, categoryFilter = 'all') {
  const t = text.toLowerCase();

  // 1) try keywords exact/includes
  for (const item of faqData) {
    if (categoryFilter !== 'all' && item.category !== categoryFilter) continue;
    if (!item.keywords) continue;
    for (const kw of item.keywords) {
      if (t.includes(kw.toLowerCase())) return item;
    }
  }

  // 2) try question includes (fuzzy)
  for (const item of faqData) {
    if (categoryFilter !== 'all' && item.category !== categoryFilter) continue;
    if (item.question && t.length > 2 && item.question.toLowerCase().includes(t)) return item;
  }

  // 3) token overlap: check at least two tokens in common
  const tokens = t.split(/\s+/).filter(s => s.length > 2);
  if (tokens.length) {
    for (const item of faqData) {
      if (categoryFilter !== 'all' && item.category !== categoryFilter) continue;
      const q = item.question.toLowerCase();
      let matches = 0;
      for (const tk of tokens) {
        if (q.includes(tk)) matches++;
        if (matches >= 1) return item; // lenient: return first with any token
      }
    }
  }

  return null;
}

// ---------- send / receive ----------
async function sendQuestion(text) {
  if (!text || !text.trim()) return;
  appendMessage(text, 'user');
  userInput.value = '';
  typingIndicator.classList.remove('hidden');

  // small delay to simulate thinking
  setTimeout(() => {
    const activeCategory = document.querySelector('.filter-btn.active')?.dataset.cat || 'all';
    const match = findBestMatch(text, activeCategory);
    if (match) {
      appendMessage(match.answer, 'ai');
    } else {
      appendMessage("I couldn't find an exact answer. I will forward your question to a live agent for assistance.", 'ai');
    }
    typingIndicator.classList.add('hidden');
  }, 700);
}

sendBtn.addEventListener('click', () => sendQuestion(userInput.value));
userInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') sendQuestion(userInput.value); });
resetBtn.addEventListener('click', () => { chatWindow.innerHTML = ''; });

// ---------- sample list and filters ----------
function buildSampleList() {
  sampleList.innerHTML = '';
  // show up to 20 samples
  const samples = faqData.slice(0, 20);
  for (const s of samples) {
    const b = document.createElement('button');
    b.className = 'sample-btn';
    b.textContent = s.question;
    b.onclick = () => sendQuestion(s.question);
    sampleList.appendChild(b);
  }
  // ensure filters default state
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(x => x.classList.remove('active'));
      btn.classList.add('active');
      // optionally rebuild sampleList to only show that category
      const cat = btn.dataset.cat;
      buildSampleListForCategory(cat);
    });
  });
}

function buildSampleListForCategory(cat) {
  sampleList.innerHTML = '';
  const items = (cat === 'all') ? faqData.slice(0, 20) : faqData.filter(i => i.category === cat).slice(0,20);
  for (const s of items) {
    const b = document.createElement('button');
    b.className = 'sample-btn';
    b.textContent = s.question;
    b.onclick = () => sendQuestion(s.question);
    sampleList.appendChild(b);
  }
}

// set default active filter = all
document.addEventListener('DOMContentLoaded', () => {
  const allBtn = document.querySelector('.filter-btn[data-cat="all"]');
  if (allBtn) allBtn.classList.add('active');
});
