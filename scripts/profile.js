import { API_BASE_URL } from "./api.js";

const profileInfo = document.getElementById("profileInfo");
const profileListings = document.getElementById("profileListings");

const token = localStorage.getItem("token");
const username = localStorage.getItem("username");

if (!token || !username) {
    window.location.href = "../auth/login.html";
}

async function fetchProfile() {
    try {
        const response = await fetch(
            `${API_BASE_URL}/auction/profiles/${username}?_listings=true`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "X-Noroff-API-Key": "366c81fc-445b-4c5c-baea-4fad513762ba"
                }
            }
        );

        const result = await response.json();

        console.log("profile:", result.data);

        renderProfile(result.data);
        renderListings(result.data.listings);
    } catch (error) {
        console.error("failed to fetch profile:", error);
    }
}

function renderProfile(profile) {
    profileInfo.innerHTML = `
        ${
            profile.banner?.url
                ? `<img src="${profile.banner.url}" alt="${profile.banner.alt || "Profile banner"}" class="img-fluid rounded mb-3">`
                : ""
        }

        ${
            profile.avatar?.url
                ?`<img src="${profile.avatar.url}" alt="${profile.avatar.alt || "Profile avatar"}" class="profile-avatar mb-3">`
                : ""
        }
        
        <p><strong>Username:</strong> ${profile.name}</p>
        <p><strong>Email:</strong> ${profile.email}</p>
        <p><strong>Bio:</strong> ${profile.bio || "No bio yet"}</p>
        <p><strong>Credits:</strong> ${profile.credits}</p>

        <a href="./edit.html" class="btn btn-primary-custom mt-3">Edit profile</a>
    `;
}

function renderListings(listings) {
    profileListings.innerHTML = "";

    listings.forEach((listing) => {
        const col = document.createElement("div");
        col.classList.add("col-12", "col-md-6", "col-lg-4");

        const imageUrl =
            listing.media && listing.media.length > 0 && listing.media[0].url
                ? listing.media[0].url
                : "";

        const endsAtText = listing.endsAt
            ? new Date(listing.endsAt).toLocaleDateString()
            : "No deadline set";

        col.innerHTML = `
            <div class="listing-card p-3 shadow-sm h-100">
                ${
                    imageUrl
                        ? `<img src="${imageUrl}" class="img-fluid rounded mb-2">`
                        : `<div class="listing-image-placeholder"></div>`
                }
                <h3 class="h5 mb-1">${listing.title}</h3>
                <p class="text-muted mb-1">Bids: ${listing._count?.bids ?? 0}</p>
                <p class="listing-deadline">Ends: ${endsAtText}</P>
                <a href="../listings/listing.html?id=${listing.id}" class="btn btn-secondary-custom mt-2">View</a>
            </div>
        `;

        profileListings.appendChild(col);
    });
}

fetchProfile();