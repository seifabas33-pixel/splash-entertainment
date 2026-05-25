const activities = [
  { name: "Morning Yoga", time: "08:00", location: "Beach Deck" },
  { name: "Aqua Gym", time: "10:30", location: "Main Pool" },
  { name: "Darts Tournament", time: "12:00", location: "Garden Arena" },
  { name: "Kids Mini Disco", time: "16:30", location: "Family Stage" },
  { name: "Sunset Dance Class", time: "18:00", location: "Terrace" },
  { name: "Evening Show", time: "21:00", location: "Theater" }
];

const introScreen = document.getElementById("intro-screen");
const appShell = document.getElementById("app-shell");
const joinButtons = document.querySelectorAll(".join-button");
const changeModeButton = document.getElementById("change-mode");
const tabButtons = document.querySelectorAll(".tab-button");
const panels = document.querySelectorAll(".tab-panel");

function activateTab(tabId) {
  tabButtons.forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.tab === tabId);
  });
  panels.forEach((panel) => {
    panel.classList.toggle("active", panel.id === tabId);
  });
}

joinButtons.forEach((button) => {
  button.addEventListener("click", () => {
    activateTab(button.dataset.role);
    introScreen.classList.add("hidden");
    appShell.classList.remove("hidden");
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
});

changeModeButton.addEventListener("click", () => {
  appShell.classList.add("hidden");
  introScreen.classList.remove("hidden");
});

for (const button of tabButtons) {
  button.addEventListener("click", () => activateTab(button.dataset.tab));
}

const activityForm = document.getElementById("activity-form");
const guestResult = document.getElementById("guest-result");

activities.forEach((activity) => {
  const card = document.createElement("article");
  card.className = "activity-card";
  card.innerHTML = `
    <div class="activity-head">
      <span class="activity-tag">Featured</span>
      <strong>${activity.name}</strong>
    </div>
    <div class="activity-meta">
      <span class="meta-pill">🕒 ${activity.time}</span>
      <span class="meta-pill">📍 ${activity.location}</span>
    </div>
    <label class="join-toggle">
      <input type="checkbox" name="activity" value="${activity.name}" />
      <span>Join this activity</span>
    </label>
  `;
  activityForm.appendChild(card);
});

document.getElementById("submit-activities").addEventListener("click", () => {
  const selected = [...document.querySelectorAll('input[name="activity"]:checked')].map((input) => input.value);

  if (selected.length === 0) {
    guestResult.textContent = "Please choose at least one activity to continue.";
    return;
  }

  guestResult.textContent = `Great choice! You joined: ${selected.join(", ")}.`;
});

const workerForm = document.getElementById("worker-form");
const workerResult = document.getElementById("worker-result");

workerForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(workerForm);
  const name = formData.get("fullName");
  const email = formData.get("email");

  workerResult.textContent = `Welcome ${name}! Your worker profile was created using ${email}.`;
  workerForm.reset();
});