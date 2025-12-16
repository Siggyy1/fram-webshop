const chatForm = document.getElementById("chatForm");
const chatInput = document.getElementById("chatInput");
const chatLog = document.getElementById("chatLog");
const chatError = document.getElementById("chatError");
const chatSend = document.getElementById("chatSend");

function addBubble(role, text){
  const div = document.createElement("div");
  div.className = `bubble ${role}`;
  div.textContent = text;
  chatLog.appendChild(div);
  chatLog.scrollTop = chatLog.scrollHeight;
}

let typingBubbleEl = null;

function showTypingBubble() {
  if (!chatLog || typingBubbleEl) return;

  const div = document.createElement("div");
  div.className = "bubble assistant typing";
  div.setAttribute("aria-label", "Assistant is typing");
    div.innerHTML = `<span class="typing-dots" aria-hidden="true">
        <span></span><span></span><span></span>
    </span>`;

  chatLog.appendChild(div);
  typingBubbleEl = div;
  chatLog.scrollTop = chatLog.scrollHeight;
}

function hideTypingBubble() {
  if (!typingBubbleEl) return;
  typingBubbleEl.remove();
  typingBubbleEl = null;
}


function setLoading(isLoading){
  if (chatSend) chatSend.disabled = isLoading;
  if (chatInput) chatInput.disabled = isLoading;

  if (isLoading) showTypingBubble();
  else hideTypingBubble();
}


let messages = [
  { role:"assistant", content:"What can I help you with today?" }
];

if (chatLog){
  addBubble("assistant", "What can I help you with today?");
}

async function sendToApi(userText){
  setLoading(true);
  if (chatError){ chatError.hidden = true; chatError.textContent = ""; }

  messages.push({ role:"user", content:userText });

  try{
    const res = await fetch("http://localhost:3001/api/chat", {
      method:"POST",
      headers:{ "Content-Type":"application/json" },
      body: JSON.stringify({ messages })
    });

    if (!res.ok){
      const txt = await res.text();
      throw new Error(txt || "Bad response");
    }

    const data = await res.json();
    const reply = data.reply || "Sorry—no reply.";
    messages.push({ role:"assistant", content: reply });
    addBubble("assistant", reply);
   } catch (err) {
    if (chatError) {
      chatError.hidden = false;

      const msg = (err && err.message ? String(err.message) : "").toLowerCase();
      if (msg.includes("429") || msg.includes("quota") || msg.includes("rate")) {
        chatError.textContent =
          "Chat quota/rate limit reached. Check your API plan/billing, then try again.";
      } else {
        chatError.textContent = "Failed to connect. Wait and try again later.";
      }
    }
  } finally {

    setLoading(false);
  }
}

chatForm?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const text = (chatInput.value || "").trim();
  if (!text) return;

  addBubble("user", text);
  chatInput.value = "";
  await sendToApi(text);
});
