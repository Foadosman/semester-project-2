import { API_BASE_URL } from "./api.js";

const form = document.getElementById("editProfileForm");

const token = localStorage.getItem("token");
const username = localStorage.getItem("username");

async function fetchProfile() {
    try {
        const response = await fetch(
            `${API_BASE_URL}/auction/profiles/${username}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "X-Noroff-API-Key": "366c81fc-445b-4c5c-baea-4fad513762ba"
                }
            }
        );

        const result = await response.json();
        const profile = result.data;

        fillForm(profile);

        console.log("Edit Profile", profile);
    } catch (error) {
        console.error("Failed to fetch Profile:", error);
    }
}

function fillForm(profile) {
    document.getElementById("bio").value = profile.bio || "";
    document.getElementById("avatar").value = profile.avatar?.url || "";
    document.getElementById("banner").value = profile.banner?.url || "";
}

if (form) {
    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const bio = document.getElementById("bio").value.trim();
        const avatar = document.getElementById("avatar").value.trim();
        const banner = document.getElementById("banner").value.trim();

        const profileData = {
            bio: bio,
            avatar: {
                url: avatar,
                alt: `${username} avatar`,
            },
            banner: {
                url: banner,
                alt: `${username} banner`,
            },
        };

        try {
            const response = await fetch(`${API_BASE_URL}/auction/profiles/${username}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                    "X-Noroff-API-Key": "366c81fc-445b-4c5c-baea-4fad513762ba",
                },
                body: JSON.stringify(profileData),
            });

            const result = await response.json();

            console.log("Update Profile result:", result);

            if (!response.ok) {
                console.error("Profile update failed:", result);
                return;
            }

            //window.location.href = "./index.html";
        } catch (error) {
            console.error("Failed to update Prodile:", error);
        }
    });
}

fetchProfile();