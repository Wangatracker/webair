let let peopleOnline = 0;
let uptimeStart = Date.now();

function switchTab(tab) {
  const editors = document.querySelectorAll("textarea, .ai-gen");
  editors.forEach(ed => ed.classList.remove("active"));
  document.getElementById(tab).classList.add("active");
}

function runCode() {
  const html = document.getElementById("html").value;
  const css = "<style>" + document.getElementById("css").value + "</style>";
  const js = "<script>" + document.getElementById("js").value + "<\/script>";
  const output = document.getElementById("output");
  output.srcdoc = html + css + js;
}

function clearCode() {
  document.querySelectorAll("textarea").forEach(t => t.value = "");
  document.getElementById("output").srcdoc = "";
}

// Countdown Timer
setInterval(() => {
  let elapsed = Date.now() - uptimeStart;
  let hours = Math.floor(elapsed / (1000 * 60 * 60));
  let minutes = Math.floor((elapsed % (1000 * 60 * 60)) / (1000 * 60));
  let seconds = Math.floor((elapsed % (1000 * 60)) / 1000);
  document.getElementById("countdownTimer").textContent = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}, 1000);

function pad(num) {
  return num < 10 ? '0' + num : num;
}

// Simulated Online Users
setInterval(() => {
  peopleOnline += Math.floor(Math.random() * 2);
  document.getElementById("onlineCount").textContent = peopleOnline;
}, 5000);

// AI Code Generator (you need to replace 'YOUR_API_KEY' with actual key)
async function generateCode() {
  const prompt = document.getElementById("aiPrompt").value;
  if (!prompt) return alert("Type something for AI to generate.");

  const response = await fetch("https://api.openai.com/v1/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer YOUR_API_KEY"
    },
    body: JSON.stringify({
      model: "text-davinci-003",
      prompt: `Write code: ${prompt}`,
      max_tokens: 300
    })
  });

  const data = await response.json();
  if (data.choices && data.choices.length > 0) {
    document.getElementById("html").value = data.choices[0].text.trim();
    switchTab('html');
  }
}￼Enter
