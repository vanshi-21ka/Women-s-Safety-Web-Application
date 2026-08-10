// ===== GLOBAL VARIABLES =====
let currentUser = null;
let emergencyContacts = [];

// ===== HELPLINE DATA (India) =====
const helplines = [
  { name: "National Emergency", number: "112" },
  { name: "Women Helpline", number: "1091" },
  { name: "Police", number: "100" },
  { name: "Ambulance", number: "108" },
  { name: "Domestic Abuse", number: "181" }
];

// ===== TOAST NOTIFICATION =====
function showToast(message, duration = 2500) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => {
    toast.classList.remove("show");
  }, duration);
}

// ===== RENDER HELPLINES =====
function renderHelplines() {
  const container = document.getElementById("helpline-list");
  container.innerHTML = "";

  helplines.forEach(item => {
    const a = document.createElement("a");
    a.href = `tel:${item.number}`;
    a.className = "helpline-item";
    a.innerHTML = `
      <span class="name">${item.name}</span>
      <span class="number">${item.number}</span>
    `;
    container.appendChild(a);
  });
}

// ===== SHOW / HIDE SCREENS =====
function showScreen(screenId) {
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  document.getElementById(screenId).classList.add("active");
}

// ===== MODAL HELPERS =====
function openModal(id) {
  document.getElementById(id).classList.add("active");
}

function closeModal(id) {
  document.getElementById(id).classList.remove("active");
}

// ===== SOS BUTTON (Hold for 2 seconds) =====
let sosTimer = null;
const sosBtn = document.getElementById("sos-btn");

sosBtn.addEventListener("mousedown", startSOS);
sosBtn.addEventListener("touchstart", startSOS);
sosBtn.addEventListener("mouseup", cancelSOS);
sosBtn.addEventListener("mouseleave", cancelSOS);
sosBtn.addEventListener("touchend", cancelSOS);

function startSOS(e) {
  e.preventDefault();
  sosTimer = setTimeout(() => {
    triggerFullEmergency();
  }, 2000);
}

function cancelSOS() {
  if (sosTimer) {
    clearTimeout(sosTimer);
    sosTimer = null;
  }
}

function triggerFullEmergency() {
  showToast("🚨 Emergency Activated!");
  // Trigger Alarm
  if (typeof startAlarm === "function") startAlarm();
  // Share Location automatically
  if (typeof shareLocationEmergency === "function") shareLocationEmergency();
}

// ===== QUICK ACTION BUTTONS =====
document.getElementById("fake-call-btn").addEventListener("click", () => {
  if (typeof startFakeCall === "function") startFakeCall();
});

document.getElementById("alarm-btn").addEventListener("click", () => {
  if (typeof startAlarm === "function") startAlarm();
});

document.getElementById("share-location-btn").addEventListener("click", () => {
  if (typeof openLocationModal === "function") openLocationModal();
});

document.getElementById("contacts-btn").addEventListener("click", () => {
  openContactsModal();
});

// ===== CONTACTS MODAL =====
function openContactsModal() {
  renderContacts();
  openModal("contacts-modal");
}

document.getElementById("close-contacts").addEventListener("click", () => {
  closeModal("contacts-modal");
});

function renderContacts() {
  const list = document.getElementById("contacts-list");
  list.innerHTML = "";

  if (emergencyContacts.length === 0) {
    list.innerHTML = `<p style="color:#64748b; font-size:14px;">No contacts added yet.</p>`;
    return;
  }

  emergencyContacts.forEach((contact, index) => {
    const div = document.createElement("div");
    div.className = "contact-item";
    div.innerHTML = `
      <div class="info">
        <span class="name">${contact.name}</span>
        <span class="phone">${contact.phone}</span>
      </div>
      <a href="tel:${contact.phone}" class="call-btn-small">Call</a>
    `;
    list.appendChild(div);
  });
}

// Add new contact
document.getElementById("add-contact-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.getElementById("contact-name").value.trim();
  const phone = document.getElementById("contact-phone").value.trim();

  if (!name || !phone) return;

  emergencyContacts.push({ name, phone });
  localStorage.setItem("emergencyContacts", JSON.stringify(emergencyContacts));

  document.getElementById("contact-name").value = "";
  document.getElementById("contact-phone").value = "";

  renderContacts();
  showToast("Contact added successfully!");
});

// ===== LOAD DATA ON START =====
function loadLocalData() {
  const savedContacts = localStorage.getItem("emergencyContacts");
  if (savedContacts) {
    emergencyContacts = JSON.parse(savedContacts);
  }

  const savedUser = localStorage.getItem("currentUser");
  if (savedUser) {
    currentUser = JSON.parse(savedUser);
    document.getElementById("user-name").textContent = currentUser.name;
    showScreen("app-screen");
  } else {
    showScreen("auth-screen");
  }
}

// ===== INITIALIZE APP =====
document.addEventListener("DOMContentLoaded", () => {
  renderHelplines();
  loadLocalData();
});