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

        // Loop through each university entry in the JSON data
        data.forEach(university => {
            const card = document.createElement("div");
            card.className = "teaching-card";

            // Conditional HTML for the 'mode' field
            const modeBadge = university.mode ? `<span class="mode-badge">${university.mode}</span>` : '';
            
            // Generate list of subjects for this university, handling the array
            // The map function iterates over the subject array to create a new <p> tag for each subject
            const subjectList = university.subject.map(subject => {
                const sinceText = university.startYear < new Date().getFullYear() ? `<span class="since-year">Since ${university.startYear}</span>` : '';
                // Each subject gets its own paragraph, ensuring it starts on a new line
                return `<p class="card-subject">${subject}</p>`;
            }).join(''); // The join('') method ensures no commas are added between the paragraphs

            card.innerHTML = `
                <div class="teaching-card-details">
                    <h3 class="card-title">${university.universityName} ${modeBadge}</h3>
                    ${subjectList}
                </div>
                <div class="teaching-card-logo">
                    <a href="${university.universityLink}" target="_blank" rel="noopener noreferrer">
                        <img src="${university.universityLogo}" alt="${university.universityName} Logo">
                    </a>
                </div>
            `;

            teachingGrid.appendChild(card);
        });
    }

    // Load the data when the DOM is ready
    loadTeachingData();
});
