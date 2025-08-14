document.addEventListener("DOMContentLoaded", () => {
    // Function to fetch and render the teaching data
    async function loadTeachingData() {
        try {
            const response = await fetch('teaching.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            
            renderTeachingCards(data);
        } catch (error) {
            console.error("Could not load teaching data:", error);
        }
    }

    // Function to render the teaching cards
    function renderTeachingCards(data) {
        const teachingGrid = document.getElementById("teaching-grid");
        if (!teachingGrid) {
            console.error("Teaching grid container not found.");
            return;
        }

        // Loop through each item in the JSON data
        data.forEach(item => {
            const card = document.createElement("div");
            card.className = "teaching-card";

            // Conditional HTML for the 'mode' field
            const modeBadge = item.mode ? `<span class="mode-badge">${item.mode}</span>` : '';
            
            // Conditional HTML for the 'since year' text
            const sinceText = item.startYear < new Date().getFullYear() ? `<p class="since-year">Since ${item.startYear}</p>` : '';

            card.innerHTML = `
                <div class="teaching-card-details">
                    <h3 class="card-title">${item.universityName} ${modeBadge}</h3>
                    <p class="card-subject">${item.subject}</p>
                    ${sinceText}
                </div>
                <div class="teaching-card-logo">
                    <a href="${item.universityLink}" target="_blank" rel="noopener noreferrer">
                        <img src="${item.universityLogo}" alt="${item.universityName} Logo">
                    </a>
                </div>
            `;

            teachingGrid.appendChild(card);
        });
    }

    // Load the data when the DOM is ready
    loadTeachingData();
});
