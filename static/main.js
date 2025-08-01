// Function to toggle dark mode and persist the setting
function toggleDarkMode() {
  document.body.classList.toggle("dark-mode");
  const isDark = document.body.classList.contains("dark-mode");
  localStorage.setItem("darkMode", isDark ? "enabled" : "disabled");
}

// Set up dark mode on page load based on localStorage setting
window.addEventListener("DOMContentLoaded", () => {
  const darkModeSetting = localStorage.getItem("darkMode");
  if (darkModeSetting === "enabled") {
    document.body.classList.add("dark-mode");
  }

  document.getElementById("toggleMode").addEventListener("click", toggleDarkMode);
});

// Function to send symptoms to the Flask API
async function sendSymptoms() {
  const input = document.getElementById("symptoms").value;
  const responseBox = document.getElementById("response");

  responseBox.innerText = "⏳ Processing...";

  try {
    const res = await fetch("http://127.0.0.1:8080/api/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ symptoms: input })
    });

    const data = await res.json();

    responseBox.innerText = data.triage_category
      ? `🩺 Prediction: ${data.triage_category}`
      : `⚠️ Error: ${data.error}`;
  } catch (error) {
    responseBox.innerText = "❌ Failed to connect to server.";
  }
}
