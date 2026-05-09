import { API_BASE_URL } from "./api.js"

const createListingForm = document.getElementById("createListingForm");

if (createListingForm) {
    createListingForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const token = localStorage.getItem("token");

        const title = document.getElementById("title").value.trim();
        const description = document.getElementById("description").value.trim();
        const endsAt = document.getElementById("endsAt").value;
        const imageUrl1 = document.getElementById("imageUrl1").value.trim();
        const imageUrl2 = document.getElementById("imageUrl2").value.trim();
        const imageUrl3 = document.getElementById("imageUrl3").value.trim();

        const listingData = {
            title,
            description,
            endsAt,
            media: [imageUrl1, imageUrl2, imageUrl3]
                .filter((url) => url)
                .map((url) => ({
                    url: url,
                    alt: title,
                })),
        };

        try {
            const response = await fetch(`${API_BASE_URL}/auction/listings`, {
                method: "POST",
                headers: {
                    "content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                    "X-Noroff-API-Key": "366c81fc-445b-4c5c-baea-4fad513762ba",
                },
                body: JSON.stringify(listingData),
            });

            const result = await response.json();

            console.log("Create listing result:", result);

            window.location.href = "../profile/index.html";
        } catch (error) {
            console.error("create listing failed;", error);
        }
    });
}
