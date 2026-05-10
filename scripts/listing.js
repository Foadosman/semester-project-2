import { API_BASE_URL } from "./api.js";

const listingContainer = document.getElementById("listingContainer");

const username = localStorage.getItem("username");

const params = new URLSearchParams(window.location.search);
const listingId = params.get("id");

async function fetchListing() {
    try {
        const response = await fetch(`${API_BASE_URL}/auction/listings/${listingId}?_bids=true&_seller=true`);
        const result = await response.json();
        const listing = result.data;
        renderListing(listing);
        renderBidHistory(listing.bids);

        console.log("Single listing:", result.data);
    } catch (error) {
        console.error("Failed to fetch listing:", error);
    }
}

function renderListing(listing) {
    const token = localStorage.getItem("token");

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

    listingContainer.innerHTML = `
        <div class="row g-4">
            <div class="col-12 col-md-6">
                ${
                    listing.media && listing.media.length > 0
                        ? `
                            <img
                                src="${listing.media[0].url}"
                                alt="${listing.media[0].alt || "Listing image"}"
                                id="mainListingImage"
                                class="img-fluid rounded single-listing-image mb-3"
                            >
                            
                            <div class="d-flex gap-2 flex-wrap">
                                ${listing.media
                                    .map(
                                        (img) => `
                                            <img
                                                src="${img.url}"
                                                alt="${img.alt || "Listing image"}"
                                                class="listing-thumbnail rounded"
                                            >
                                        `
                                    )
                                    .join("")}
                            </div>
                        `
                        : `<div class= "listing-image-placeholder"></div>`
                }
            </div>
            <div class="col-12 col-md-6">
                <h1 class="mb-2">${listing.title}</h1>
                <p class="text-muted mb-2">Bids: ${listing._count.bids ?? 0}</P>
                <p class="mb-3">Ends: ${endsAtText}</p>
                <p class="mb-4">${listing.description || "No description available"}</p>
                
                ${listing.seller?.name === username
                     ? `
                        <div class="d-flex gap-2 my-3">
                            <a href="./edit.html?id=${listing.id}" class="btn btn-primary-custom">Edit listing</a>
                            <buttun id="deleteListingBtn" class="btn btn-danger">Delete listing</button>
                        </div>
                    `
                : token?`
                    <form id="bidForm" class="d-flex gap-2 my-3">
                        <input
                            type="number"
                            id="bidAmount"
                            class="form-control"
                            placeholder="Enter bid amount"
                            required
                        >
                        <button type="submit" class="btn btn-primary-custom">Place bid</button>
                    </form>
                    ` : `
                        <div class="alert alert-info mt-3">
                            Please log in to place a bid.
                        </div>
                    `
                }
                <div class="bid-history mt-4">
                    <h2 class="h4">Bid History</h2>
                    <div id="bidHistoryContainer"></div>
                </div>
            </div>
        </div>
    `;

    const bidForm = document.getElementById("bidForm");

    if (bidForm) {
        bidForm.addEventListener("submit", async (event) => {
            event.preventDefault();

            const amount = document.getElementById("bidAmount").value;

            const token = localStorage.getItem("token");

            try {
                const response = await fetch(`${API_BASE_URL}/auction/listings/${listing.id}/bids`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                        "X-Noroff-API-Key": "366c81fc-445b-4c5c-baea-4fad513762ba"
                    },
                    body: JSON.stringify({
                        amount: Number(amount)
                    })
                });

                const result = await response.json();

                if (!response.ok) {
                    const errorMessage = result.errors?.[0]?.message || "Bid failed. Please try again.";
                    alert(errorMessage);
                    return;
                }
                fetchListing();
            } catch (error) {
                console.error("Bid failed:", error);
            }
        });
    }

    const deleteListingBtn = document.getElementById("deleteListingBtn");

    if (deleteListingBtn) {
        deleteListingBtn.addEventListener("click", async () =>{
            const confirmed = confirm("Are you sure you want to delete this listing?");

            if (!confirmed) {
                return;
            }

            const token = localStorage.getItem("token");

            try {
                const response = await fetch(`${API_BASE_URL}/auction/listings/${listing.id}`, {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "X-Noroff-API-Key": "366c81fc-445b-4c5c-baea-4fad513762ba"
                    }
                });

                window.location.href = "../profile/index.html";
            } catch (error) {
                console.error("Delete failed", error);
            }
        });
    }
    
    const mainImage = document.getElementById("mainListingImage");
    const thumbnails = document.querySelectorAll(".listing-thumbnail");

    thumbnails.forEach((thumb) => {
        thumb.addEventListener("click", () => {
            mainImage.src = thumb.src;
            mainImage.alt = thumb.alt;
        });
    });
}

function renderBidHistory(bids) {
    const bidHistoryContainer = document.getElementById("bidHistoryContainer");

    if (!bidHistoryContainer) {
        return;
    }

    if (!bids || bids.length === 0) {
        bidHistoryContainer.innerHTML = `<p class="text-muted">No bids Yet.</p>`;
        return;
    }

    bidHistoryContainer.innerHTML = [...bids]
    .sort((a, b) => new Date(b.created) - new Date(a.created))
    .map(
        (bid) => `
            <div class="card p-2 mb-2 shadow-sm">
                <p class="mb-1"><strong>${bid.amount} credits</strong></p>
                <p class="text-muted mb-0">Bidder: ${bid.bidder?.name || "unknown"}</p>
            </div>
        `
    )
    .join("");
}

fetchListing();