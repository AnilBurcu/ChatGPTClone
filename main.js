const chatInput = document.querySelector("#chat-input");
const sendButton = document.querySelector("#send-btn");
const chatContainer = document.querySelector(".chat-container");
const themeButton = document.querySelector("#theme-btn");

let userText = null;

const API_KEY = "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"

const createElemet = (html, className) => {
    // Creating new div with chat class
    // Set divs html contents
    const chatDiv = document.createElement("div")
    chatDiv.classList.add("chat", className)
    chatDiv.innerHTML = html;
    return chatDiv;
}

const getChatResponse = async (incomingChatDiv) => {
    const API_URL = "https://api.openai.com/v1/completions";
    const pElement = document.createElement("p");
    // Define API Request
    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
            model: "text-davinci-003",
            prompt: userText,
            max_tokens: 2048,
            temperature: 0.2,
            n: 1,
            stop: null,
        }),
    };
    //
    try {
        const response = await (await fetch(API_URL, requestOptions)).json();
        console.log(response);
        pElement.textContent = response.choices[0].text.trim();
    } catch (error) {
        console.log(error);
        pElement.textContent = "Opppss";
        pElement.style.color = "red";
    }
    incomingChatDiv.querySelector(".typing-animation").remove();
    incomingChatDiv.querySelector(".chat-details").appendChild(pElement);
    chatContainer.scrollTo(0, chatContainer.scrollHeight);
    localStorage.setItem("all-chats", chatContainer.innerHTML);


};

const showTypingAnimation = () => {
    const html = `
      <div class="chat-content">
      <div class="chat-details">
        <img src="images/chatbot.jpg" alt="chat-images" />
        <div class="typing-animation">
          <div class="typing-dot" style="--delay: 0.2s"></div>
          <div class="typing-dot" style="--delay: 0.25s"></div>
          <div class="typing-dot" style="--delay: 0.3s"></div>
        </div>
      </div>
      <span class="material-symbols-outlined"> content_copy </span>
    </div>
      `;
    const incomingChatDiv = createElemet(html, "incoming");
    chatContainer.appendChild(incomingChatDiv);
    chatContainer.scrollTo(0, chatContainer.scrollHeight);
    getChatResponse(incomingChatDiv);
};

const handleoutGoingChat = () => {
    userText = chatInput.value.trim(); // trim -> Bastaki ve sondaki bosluklari atar(api hata vermemesi icin)
    if (userText == null) return; // Input bos ise calismasin
    const html = `<div class="chat-content">
    <div class="chat-details">
      <img src="images/user.jpg" alt="user-image" />
      <p>
      ${userText}
      </p>
      
    </div>
  </div>`;
    const outGoingChatDiv = createElemet(html, "outgoing");
    outGoingChatDiv.querySelector("p").textContent = userText;
    document.querySelector(".default-text")?.remove();
    chatContainer.appendChild(outGoingChatDiv);
    chatContainer.scrollTo(0, chatContainer.scrollHeight);

    setTimeout(showTypingAnimation, 500);
    // ${} -> For dynamic structure; swift /() 

};

themeButton.addEventListener("click", () => {
    document.body.classList.toggle("light-mode");
    themeButton.innerText = document.body.classList.contains("light-mode")
        ? "dark_mode"
        : "light_mode";
});


sendButton.addEventListener("click", handleoutGoingChat);