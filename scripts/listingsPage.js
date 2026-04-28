import { API_BASE_URL } from "./api.js";

const listingsGrid = document.getElementById("listingsGrid");
const searchInput = document.getElementById("searchInput");

let allListings = [];

async function fetchListings () {
    try {
        const response = await fetch(`${API_BASE_URL}/auction/listings`);
        const result = await response.json();

        allListings = result.data;
        renderListings(allListings);

        console.log("Listings:", allListings);
    } catch (error) {
        console.error("Failed to fetch listings:", error);
    }
}

function renderListings(listings) {
    listingsGrid.innerHTML = "";

    listings.forEach((listing) => {
        const col = document.createElement("div");
        col.classList.add("col-12", "col-md-6", "col-lg-4");

        const listingCard = document.createElement("article");
        listingCard.classList.add("listing-card", "shadow-sm", "h-100");

        const imageUrl =
            listing.media && listing.media.length > 0 && listing.media[0].url
                ? listing.media[0].url
                : "";

        const imageAlt =
            listing.media && listing.media.length > 0 && listing.media[0].alt
                ? listing.media[0].alt
                : "Listing image";

        const endsAtText = listing.endsAt
            ? new Date(listing.endsAt).toLocaleDateString()
            : "No deadline set";

        listingCard.innerHTML = `
            ${
                imageUrl
                    ? `<img src="${imageUrl}" alt="${imageAlt}" class="listing-image">`
                    : `<div class="listing-image-placeholder"></div>`
            }
            <h3 class="h5 mb-1">${listing.title}</h3>
            <p class="text-muted mb-1">Bids: ${listing._count?.bids ?? 0}</p>
            <p class="listing-deadline">Ends: ${endsAtText}</p>
            <a href="./listing.html?id=${listing.id}" class="btn btn-secondary-custom mt-auto">View Listing</a>
        `;

        col.appendChild(listingCard);
        listingsGrid.appendChild(col);
    });
}

function filterAndRenderListings () {
    const searchValue = searchInput.value.trim().toLowerCase();

    let filteredListings = allListings;

    if (searchValue) {
        filteredListings = allListings.filter((listing) =>
            listing.title.toLowerCase().includes(searchValue)
        );
    }

    renderListings(filteredListings);
}

fetchListings();

searchInput.addEventListener("input", filterAndRenderListings);