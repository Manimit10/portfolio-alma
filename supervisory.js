document.addEventListener("DOMContentLoaded", () => {
    // Function to fetch and render the supervisory data
    async function loadSupervisoryData() {
        try {
            const response = await fetch('supervisory.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            
            renderSupervisoryCards(data);
        } catch (error) {
            console.error("Could not load supervisory data:", error);
        }
    }

    // Function to render the supervisory cards
    function renderSupervisoryCards(data) {
        const supervisoryGrid = document.getElementById("supervisory-grid");
        if (!supervisoryGrid) {
            console.error("Supervisory grid container not found.");
            return;
        }

        // Loop through each university entry in the JSON data
        data.forEach(university => {
            const card = document.createElement("div");
            card.className = "supervisory-card";

            // Conditional HTML for the 'mode' field
            const modeBadge = university.mode ? `<span class="mode-badge">${university.mode}</span>` : '';

            let levelOrSubjectText = '';
            // Check if the key is 'EducationalLevel' or 'subject'
            if (university.EducationalLevel) {
                levelOrSubjectText = `<p class="card-subject">${university.EducationalLevel}</p>`;
            } else if (university.subject) {
                // If 'subject' is a string, handle it directly
                if (typeof university.subject === 'string') {
                    levelOrSubjectText = `<p class="card-subject">${university.subject}</p>`;
                } else if (Array.isArray(university.subject)) {
                    // If 'subject' is an array, iterate and create a new line for each
                    levelOrSubjectText = university.subject.map(s => `<p class="card-subject">${s}</p>`).join('');
                }
            }

            const sinceText = university.startYear && university.startYear < new Date().getFullYear() ? `<p class="since-year">Since ${university.startYear}</p>` : '';
            
            card.innerHTML = `
                <div class="supervisory-card-details">
                    <h3 class="card-title">${university.universityName} ${modeBadge}</h3>
                    ${levelOrSubjectText}
                    ${sinceText}
                </div>
                <div class="supervisory-card-logo">
                    <a href="${university.universityLink}" target="_blank" rel="noopener noreferrer">
                        <img src="${university.universityLogo}" alt="${university.universityName} Logo">
                    </a>
                </div>
            `;

            supervisoryGrid.appendChild(card);
        });
    }

    // Load the data when the DOM is ready
    loadSupervisoryData();
});
