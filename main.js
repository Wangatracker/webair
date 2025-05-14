let uptimeStart = Date.now();
setInterval(() => {
  const elapsed = Date.now() - uptimeStart;
  const hrs = Math.floor(elapsed / 3600000);
  const mins = Math.floor((elapsed % 3600000) / 60000);
  const secs = Math.floor((elapsed % 60000) / 1000);
  document.getElementById("countdownTimer").textContent =
    `${pad(hrs)}:${pad(mins)}:${pad(secs)}`;
}, 1000);

const SESSION_ID = crypto.randomUUID();
async function sendHeartbeat() {
  await fetch("/heartbeat", {
    method: "POST",
    headers: { "X-Session-Id": SESSION_ID },
  }).catch(()=>{});
}
sendHeartbeat();
setInterval(sendHeartbeat, 15000);

async function updateOnlineCount() {
  try {
    const res = await fetch("/online-count");
    const { online } = await res.json();
    document.getElementById("onlineCount").textContent = online;
  } catch(e) { /*ignore*/ }
}
updateOnlineCount();
setInterval(updateOnlineCount, 10000);

function switchTab(tab) {
  document.querySelectorAll("textarea").forEach(el => el.classList.remove("active"));
  document.getElementById(tab).classList.add("active");
}

let pyodide;
async function runCode() {
  const html = document.getElementById("html").value;
  const css  = `<style>${document.getElementById("css").value}</style>`;
  const js   = `<script>${document.getElementById("js").value}<\/script>`;
  const py   = document.getElementById("python").value;
  const activeTab = document.querySelector("textarea.active").id;
  const output = document.getElementById("output");

  if (activeTab === "python") {
    output.srcdoc = `<pre>Loading Python...</pre>`;
    if (!pyodide) pyodide = await loadPyodide();
    try {
      const result = await pyodide.runPythonAsync(py);
      output.srcdoc = `<pre>${result}</pre>`;
    } catch (e) {
      output.srcdoc = `<pre style="color:red">${e}</pre>`;
    }
  } else {
    output.srcdoc = html + css + js;
  }
}

function clearCode() {
  document.querySelectorAll("textarea").forEach(t => t.value = "");
  document.getElementById("output").srcdoc = "";
}

function pad(n) {
  return n < 10 ? '0'+n : n;
}

switchTab('html');￼Enter
