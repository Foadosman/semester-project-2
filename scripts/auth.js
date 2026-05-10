import { API_BASE_URL } from "./api.js";

const registerForm = document.getElementById("registerForm");

if (registerForm) {
  registerForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        alert(result.errors?.[0]?.message || "Registration failed");
        return;
      }

      const registerMessage = document.getElementById("registerMessage");

      registerMessage.innerHTML = `
                <div class="alert alert-success">
                    Registration successful! Redirecting to login...
                </div>
            `;

      setTimeout(() => {
        window.location.href = "./login.html";
      }, 2000);
    } catch (error) {
      console.error("Register failed:", error);
    }
  });
}

const loginForm = document.getElementById("loginForm");

if (loginForm) {
  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value.trim();

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        alert(result.errors?.[0]?.message || "Login failed");
        return;
      }

      const { accessToken, name } = result.data;
      localStorage.setItem("token", accessToken);
      localStorage.setItem("username", name);

      const loginMessage = document.getElementById("loginMessage");

      loginMessage.innerHTML = `
                <div class="alert alert-success">
                    Login successful! Redirecting...
                </div>
            `;

      setTimeout(() => {
        window.location.href = "../index.html";
      }, 2000);
    } catch (error) {
      console.error("Login failed:", error);
    }
  });
}
