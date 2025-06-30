const chatBox = document.getElementById("chat-box");
const form = document.getElementById("message-form");
const messageInput = document.getElementById("message");
const imageInput = document.getElementById("imageInput");

// Convert image file to base64
function toBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = err => reject(err);
    reader.readAsDataURL(file);
  });
}

// Send message to Netlify Function
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const text = messageInput.value.trim();
  const file = imageInput.files[0];
  let image = null;

  if (!text && !file) return;

  if (file) {
    image = await toBase64(file);
  }

  await fetch("/.netlify/functions/send-message", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ text, image })
  });

  messageInput.value = "";
  imageInput.value = "";
  await loadMessages();
});

// Load messages from Netlify Blob
async function loadMessages() {
  try {
    const res = await fetch("/.netlify/functions/get-messages");
    const messages = await res.json();
    chatBox.innerHTML = "";

    messages.forEach(msg => {
      const div = document.createElement("div");
      div.className = "message";
      div.innerHTML = `
        <p>${msg.text || ""}</p>
        ${msg.image ? `<img src="${msg.image}" alt="Image" />` : ""}
        <small>${new Date(msg.timestamp).toLocaleTimeString()}</small>
      `;
      chatBox.appendChild(div);
    });

    chatBox.scrollTop = chatBox.scrollHeight;
  } catch (err) {
    console.error("Failed to load messages", err);
    chatBox.innerHTML = "<p class='loading'>Error loading messages.</p>";
  }
}

// Refresh every 5 seconds
setInterval(loadMessages, 5000);
loadMessages();