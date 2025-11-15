let faqData = [];

// LOAD JSON
async function loadFAQ() {
    try {
        const res = await fetch("faq.json");
        faqData = await res.json();
        populateDropdown();
    } catch (e) {
        console.error("FAQ load error", e);
        faqData = [];
    }
}

// POPULATE DROPDOWN
function populateDropdown() {
    const dropdown = document.getElementById("faqDropdown");

    faqData.forEach(faq => {
        const option = document.createElement("option");
        option.value = faq.question;
        dropdown.appendChild(option);
    });
}

// FIND BEST MATCH
function getAnswer(input) {
    const txt = input.toLowerCase();

    // PRECISE MATCH
    let exact = faqData.find(f => txt === f.question.toLowerCase());
    if (exact) return exact.answer;

    // KEYWORD MATCH
    let kw = faqData.find(f =>
        f.keywords.some(k => txt.includes(k.toLowerCase()))
    );
    if (kw) return kw.answer;

    return "A live agent will help you shortly.";
}

// APPEND MESSAGE
function appendMessage(msg, sender) {
    const win = document.getElementById("chatWindow");
    const div = document.createElement("div");
    div.classList.add("msg", sender);
    div.textContent = msg;
    win.appendChild(div);
    win.scrollTop = win.scrollHeight;
}

// SEND
function sendMessage() {
    const input = document.getElementById("userInput");
    const text = input.value.trim();
    if (!text) return;

    appendMessage(text, "user");
    input.value = "";

    const typing = document.getElementById("typingIndicator");
    typing.classList.remove("hidden");

    setTimeout(() => {
        appendMessage(getAnswer(text), "ai");
        typing.classList.add("hidden");
    }, 500);
}

// RESET
function resetChat() {
    document.getElementById("chatWindow").innerHTML = "";
}

// INIT
window.onload = () => {
    loadFAQ();
    document.getElementById("sendBtn").onclick = sendMessage;
    document.getElementById("resetBtn").onclick = resetChat;

    document.getElementById("userInput").addEventListener("keypress", e => {
        if (e.key === "Enter") sendMessage();
    });
};
