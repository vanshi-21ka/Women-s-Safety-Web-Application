// ===== AUTHENTICATION WITH BACKEND =====

const API_URL = "http://localhost:5000/api";

// Switch between Login and Register forms
document.getElementById("show-register").addEventListener("click", (e) => {
  e.preventDefault();
  document.getElementById("login-form").classList.add("hidden");
  document.getElementById("register-form").classList.remove("hidden");
});

document.getElementById("show-login").addEventListener("click", (e) => {
  e.preventDefault();
  document.getElementById("register-form").classList.add("hidden");
  document.getElementById("login-form").classList.remove("hidden");
});

// ===== REGISTER =====
document.getElementById("register-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("reg-name").value.trim();
  const email = document.getElementById("reg-email").value.trim();
  const password = document.getElementById("reg-password").value;
  const phone = document.getElementById("reg-phone").value.trim();

  if (password.length < 6) {
    showToast("Password must be at least 6 characters");
    return;
  }

  try {
    const res = await fetch(`${API_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ name, email, password, phone })
    });

    const data = await res.json();

    if (!res.ok) {
      showToast(data.error || "Registration failed");
      return;
    }

    // Save token and user
    localStorage.setItem("token", data.token);
    localStorage.setItem("currentUser", JSON.stringify(data.user));
    currentUser = data.user;

    document.getElementById("user-name").textContent = currentUser.name;
    showScreen("app-screen");
    showToast("Account created successfully!");
  } catch (error) {
    showToast("Server not running. Please start backend.");
    console.error(error);
  }
});

// ===== LOGIN =====
document.getElementById("login-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("login-email").value.trim();
  const password = document.getElementById("login-password").value;

  try {
    const res = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (!res.ok) {
      showToast(data.error || "Login failed");
      return;
    }

    // Save token and user
    localStorage.setItem("token", data.token);
    localStorage.setItem("currentUser", JSON.stringify(data.user));
    currentUser = data.user;

    // Load emergency contacts if available
    if (data.user.emergencyContacts) {
      emergencyContacts = data.user.emergencyContacts;
      localStorage.setItem("emergencyContacts", JSON.stringify(emergencyContacts));
    }

    document.getElementById("user-name").textContent = currentUser.name;
    showScreen("app-screen");
    showToast("Welcome back, " + currentUser.name + "!");
  } catch (error) {
    showToast("Server not running. Please start backend.");
    console.error(error);
  }
});

// ===== LOGOUT =====
document.getElementById("logout-btn").addEventListener("click", () => {
  currentUser = null;
  localStorage.removeItem("currentUser");
  localStorage.removeItem("token");
  showScreen("auth-screen");

  document.getElementById("login-email").value = "";
  document.getElementById("login-password").value = "";
  document.getElementById("register-form").classList.add("hidden");
  document.getElementById("login-form").classList.remove("hidden");

  showToast("Logged out successfully");
});