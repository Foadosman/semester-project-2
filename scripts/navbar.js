import { API_BASE_URL } from "./api.js";

const navActions = document.getElementById("navActions");
const mobileNavActions = document.getElementById("mobileNavActions");

const token = localStorage.getItem("token");
const username = localStorage.getItem("username");

if (navActions && token && username) {
    navActions.innerHTML = `
        <div class="user-info-pill me-3">
            <span>Hello, ${username}</span>
            <span class="user-divider">|</span>
            <span id="navCredits">Credits: ...</span>
        </div>
        <a href="/profile/index.html" class="btn btn-primary-custom">Profile</a>
        <button id="logoutBtn" class="btn btn-danger">Logout</button>
    `;
    
    const mobileUserInfo = document.getElementById("mobileUserInfo");

    if (mobileUserInfo) {
        mobileUserInfo.innerHTML = `
            <div class="user-info-pill">
                <span>Hello, ${username}</span>
                <span class="user-divider">|</span>
                <span id="mobileNavCredits">Credits: ...</span>
            </div>
        `;
    }

    if (mobileNavActions) {
        mobileNavActions.innerHTML = `
            <a href="/profile/index.html" class="btn btn-primary-custom">Profile</a>
            <button id="mobileLogoutBtn" class="btn btn-danger">Logout</button>
        `;
    }

    fetchCredits();

    const logoutBtn = document.getElementById("logoutBtn");

    logoutBtn.addEventListener("click", () => {
        localStorage.removeItem("token");
        localStorage.removeItem("username");

        window.location.href = "/index.html";
    });

    const mobileLogoutBtn = document.getElementById("mobileLogoutBtn");

    if (mobileLogoutBtn) {
        mobileLogoutBtn.addEventListener("click", () => {
            localStorage.removeItem("token");
            localStorage.removeItem("username");
            window.location.href = "/index.html";
        });
    }
} else if (mobileNavActions) {
        mobileNavActions.innerHTML = `
            <a href="/auth/login.html" class="btn btn-primary-custom">Login</a>
            <a href="/auth/register.html" class="btn btn-secondary-custom">Register</a>
        `;
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

        const mobileNavCredits = document.getElementById("mobileNavCredits");

        if (mobileNavCredits) {
            mobileNavCredits.textContent = `Credits: ${result.data.credits}`;
        }
    } catch (error) {
        console.error("Failed to fetch credits:", error);
    }
}

const hamburgerBtn = document.getElementById("hamburgerBtn");
const mobileMenu = document.getElementById("mobileMenu");

if (hamburgerBtn && mobileMenu) {
    hamburgerBtn.addEventListener("click", () => {
        mobileMenu.classList.toggle("active");
    });

window.addEventListener("resize", () => {
    if (window.innerWidth >= 800 && mobileMenu) {
        mobileMenu.classList.remove("active");
    }
});
}