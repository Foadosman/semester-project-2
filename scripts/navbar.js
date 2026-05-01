const navActions = document.getElementById("navActions");

const token = localStorage.getItem("token");
const username = localStorage.getItem("username");

if (navActions && token && username) {
    navActions.innerHTML = `
        <span class="me-3">Hello, ${username}</span>
        <a href="/profile/index.html" class="btn btn-secondary-custom">Profile</a>
        <button id="logoutBtn" class="btn btn-primary-custom">Logout</button>
    `;

    const logoutBtn = document.getElementById("logoutBtn");

    logoutBtn.addEventListener("click", () => {
        localStorage.removeItem("token");
        localStorage.removeItem("username");

        window.location.href = "/index.html";
    });
}
