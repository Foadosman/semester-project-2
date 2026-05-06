import { API_BASE_URL } from "./api.js";

const form = document.getElementById("editListingForm");

const params = new URLSearchParams(window.location.search);
const listingId = params.get("id");

const token = localStorage.getItem("token");

async function fetchListing() {
    try {
        const response = await fetch(`${API_BASE_URL}/auction/listings/${listingId}`);
        const result = await response.json();

        const listing = result.data;

        fillForm(listing);

        console.log("Edit listing:", listing);
    } catch (error) {
        console.error("Failed to fetch listing:", error);
    }
}

function fillForm(listing) {
    document.getElementById("title").value = listing.title;
    document.getElementById("description").value = listing.description || "";
    document.getElementById("endsAt").value = listing.endsAt?.slice(0, 16) || "";

    if (listing.media && listing.media.length > 0) {
        document.getElementById("imageUrl1").value = listing.media[0]?.url || "";
        document.getElementById("imageUrl2").value = listing.media[1]?.url || "";
        document.getElementById("imageUrl3").value = listing.media[2]?.url || "";
    }
}

if (form) {
    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const title = document.getElementById("title").value.trim();
        const description = document.getElementById("description").value.trim();
        const endsAt = document.getElementById("endsAt").value;
        const imageUrl1 = document.getElementById("imageUrl1").value.trim();
        const imageUrl2 = document.getElementById("imageUrl2").value.trim();
        const imageUrl3 = document.getElementById("imageUrl3").value.trim();

        const listingData = {
            title: title,
            description: description,
            media: [
                {
                    url: imageUrl1,
                    alt: title,
                },
                {
                    url: imageUrl2,
                    alt: title,
                },
                {
                    url: imageUrl3,
                    alt: title,
                },
            ],
        };

        try {
            const response = await fetch(`${API_BASE_URL}/auction/listings/${listingId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                    "X-Noroff-API-Key": "366c81fc-445b-4c5c-baea-4fad513762ba",
                },
                body: JSON.stringify(listingData),
            });

            const result = await response.json();

            console.log("update listing result:", result);

            window.location.href = `./listing.html?id=${listingId}`;
        } catch (error) {
            console.error("Failed to update listing:", error);
        }
    });
}

fetchListing();