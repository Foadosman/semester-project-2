import { API_BASE_URL } from "./api.js";

const listingsGrid = document.getElementById("homeListingsGrid");
const searchInput = document.getElementById("searchInput");

let allListings = [];

function displayError(container, messageText = "Something went wrong. Please try again later.") {
    if (container) {
        container.innerHTML = `<p class="error-message">${messageText}</p>`;
    }
    console.error("Error:", messageText);
}

function filterAndRenderListings() {
    const searchValue = searchInput.value.trim().toLowerCase();

    let filteredListings = allListings;

    if (searchValue) {
        filteredListings = allListings.filter((listing) =>
            listing.title.toLowerCase().includes(searchValue)
        );
    }
    renderListings(filteredListings);
}

function renderListings(listings) {
    listingsGrid.innerHTML = "";

    if (!listings || listings.length === 0) {
        listingsGrid.innerHTML = `
            <p class="error-message">No listings found.</p>
        `;
        return;
    }

    listings.slice(0,6).forEach((listing) => {
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
                    ? `<a href="./listings/listing.html?id=${listing.id}"><img src="${imageUrl}" alt="${imageAlt}" class="listing-image"></a>`
                    : `<div class="listing-image-placeholder"></div>`
            }
            <h3 class="h5 mb-1">${listing.title}</h3>
            <p class="text-muted-mb-1">Current bid: ${listing._count?.bids ?? 0} bids</p>
            <p class="listing-deadline">Ends: ${endsAtText}</p>
            <a href="./listings/listing.html?id=${listing.id}" class="btn btn-secondary-custom mt-auto">View Listing</a>
        `;
        col.appendChild(listingCard);
        listingsGrid.appendChild(col);
    });
}

async function fetchListings() {
    try {
        const response = await fetch (`${API_BASE_URL}/auction/listings`);
        const result = await response.json();

        allListings = result.data;

        if (!Array.isArray(allListings) || allListings.length === 0) {
            displayError(listingsGrid, "No listings found.");
            return;
        }

        renderListings(allListings);
        renderCarousel(allListings);
    } catch (error) {
        console.error(error);
        displayError(listingsGrid, "failed to load listings.");
    }
}

function renderCarousel(listings) {
    const carouselContent = document.getElementById("carouselContent");
    const carouselContainer = document.getElementById("carouselContainer");


    if (!carouselContent || !carouselContainer || !listings || listings.length === 0) {
        return;
    }

    const featuredListings = listings.slice(0, 3);
    let currentIndex = 0;

    function showSlide(index) {
        const listing = featuredListings[index];

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

        carouselContent.innerHTML = `
            <div class="carousel-slide">
                ${
                    imageUrl
                        ? `<img src="${imageUrl}" alt="${imageAlt}" class="carousel-image">`
                        : `<div class="carousel-image-placeholder"></div>`
                }
                <div class="carousel-overlay">
                    <p class="hero-label">Featured Listing</p>
                    <h1>${listing.title}</h1>
                    <p class="hero-text">Ends: ${endsAtText}</p>
                    <a href="./listings/listing.html?id=${listing.id}" class="btn btn-secondary-custom">View Listing</a>
                </div>
            </div>
        `;
    
    }

    function createButtons() {
        const prevBtn = document.createElement("button");
        prevBtn.textContent = "<";
        prevBtn.classList.add("carousel-btn", "left");

        const nextBtn = document.createElement("button");
        nextBtn.textContent = ">";
        nextBtn.classList.add("carousel-btn", "right");

        prevBtn.addEventListener("click", () => {
            currentIndex = (currentIndex - 1 + featuredListings.length) % featuredListings.length;
            showSlide(currentIndex);
        });

        nextBtn.addEventListener("click", () => {
            currentIndex = (currentIndex + 1) % featuredListings.length;
            showSlide(currentIndex);
        });

        carouselContainer.appendChild(prevBtn);
        carouselContainer.appendChild(nextBtn);
    }

    showSlide(currentIndex);
    createButtons();
}

searchInput.addEventListener("input", filterAndRenderListings);

fetchListings();