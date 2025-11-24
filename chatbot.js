import { ChatAPI } from "./api.js";

const userId = localStorage.getItem("userId");

const chatBox = document.getElementById("chat-box");
const input = document.getElementById("message-input");
const sendBtn = document.getElementById("send-btn");

function addMessage(text, sender) {
    const msg = document.createElement("div");
    msg.className = sender === "user" ? "user-msg" : "bot-msg";
    msg.innerText = text;
    chatBox.appendChild(msg);
    chatBox.scrollTop = chatBox.scrollHeight;
}

async function loadHistory() {
    try {
        const res = await fetch(`http://localhost:8080/api/chat/history/${userId}`);
        const data = await res.json();

        if (!data.success) {
            console.error("Failed to load history:", data.message);
            return;
        }

        data.data.forEach(chat => {
            addMessage(chat.messageText, "user");
            addMessage(chat.responseText, "bot");
        });

    } catch (err) {
        console.error("Error loading history:", err);
    }
}

sendBtn.addEventListener("click", async () => {
    const text = input.value.trim();
    if (text === "") return;

    addMessage(text, "user");
    input.value = "";

    try {
        const response = await ChatAPI.sendMessage(userId, text);

        if (response.success) {
            addMessage(response.data.response, "bot");
        } else {
            addMessage("Something went wrong!", "bot");
        }
    } catch (err) {
        console.error("Chat API error:", err);
        addMessage("Server error!", "bot");
    }
});

loadHistory();
