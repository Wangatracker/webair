let uptimeStart = Date.now();
setInterval(() => {
  const elapsed = Date.now() - uptimeStart;
  const hrs = Math.floor(elapsed / 3600000);
  const mins = Math.floor((elapsed % 3600000) / 60000);
  const secs = Math.floor((elapsed % 60000) / 1000);
  document.getElementById("countdownTimer").textContent =
    `${pad(hrs)}:${pad(mins)}:${pad(secs)}`;
}, 1000);

function switchTab(tab) {
  document.querySelectorAll("textarea").forEach(el => el.classList.remove("active"));
  document.getElementById(tab).classList.add("active");
}

let pyodideReadyPromise = loadPyodide();

async function runCode() {
  const html = document.getElementById("html").value;
  const css  = `<style>${document.getElementById("css").value}</style>`;
  const js   = `<script>${document.getElementById("js").value}<\/script>`;
  const py   = document.getElementById("python").value;
  const activeTab = document.querySelector("textarea.active").id;
  const output = document.getElementById("output");

  if (activeTab === "python") {
    output.srcdoc = `<pre>Loading Python...</pre>`;
    try {
      const pyodide = await pyodideReadyPromise;
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
