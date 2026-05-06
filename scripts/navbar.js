import { API_BASE_URL } from "./api.js";

const navActions = document.getElementById("navActions");

const token = localStorage.getItem("token");
const username = localStorage.getItem("username");

if (navActions && token && username) {
    navActions.innerHTML = `
        <span class="me-3">Hello, ${username}</span>
        <span id="navCredits" class="me-3">Credits: ...</span>
        <a href="/profile/index.html" class="btn btn-secondary-custom">Profile</a>
        <button id="logoutBtn" class="btn btn-primary-custom">Logout</button>
    `;

    fetchCredits();

    const logoutBtn = document.getElementById("logoutBtn");

    logoutBtn.addEventListener("click", () => {
        localStorage.removeItem("token");
        localStorage.removeItem("username");

        window.location.href = "/index.html";
    });
}

async function fetchCredits() {
    try {
        const response = await fetch(`${API_BASE_URL}/auction/profiles/${username}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                "X-Noroff-API-Key": "366c81fc-445b-4c5c-baea-4fad513762ba",
            },
        });

        const result = await response.json();

        const navCredits = document.getElementById("navCredits");

        if (navCredits) {
            navCredits.textContent = `Credits: ${result.data.credits}`;
        }
    } catch (error) {
        console.error("Failed to fetch credits:", error);
    }
}
