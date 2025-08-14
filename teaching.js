document.addEventListener("DOMContentLoaded", () => {
    // Function to calculate the duration in years
    function getDuration(startYear) {
        const currentYear = new Date().getFullYear();
        const duration = currentYear - startYear;
        return `${duration} years`;
    }

    // Function to fetch and process the teaching data
    async function loadTeachingData() {
        try {
            const response = await fetch('teaching.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            
            renderTeachingTable(data);
            renderUniversityCards(data);
        } catch (error) {
            console.error("Could not load teaching data:", error);
        }
    }

    // Function to render the teaching table
    function renderTeachingTable(data) {
        const tableBody = document.querySelector("#teaching-table tbody");
        if (!tableBody) {
            console.error("Teaching table body not found.");
            return;
        }

        data.forEach(item => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${item.subject}</td>
                <td>${item.startYear}</td>
                <td>${getDuration(item.startYear)}</td>
                <td>${item.country}</td>
            `;
            tableBody.appendChild(row);
        });
    }

    // Function to render the university cards
    function renderUniversityCards(data) {
        const universitySection = document.getElementById("university-section");
        if (!universitySection) {
            console.error("University section not found.");
            return;
        }

        // Get unique universities to avoid duplicates
        const uniqueUniversities = data.reduce((unique, item) => {
            if (!unique.some(uni => uni.universityName === item.universityName)) {
                unique.push({
                    name: item.universityName,
                    link: item.universityLink,
                    logo: item.universityLogo
                });
            }
            return unique;
        }, []);

        const cardsContainer = document.createElement("div");
        cardsContainer.className = "university-cards-grid";

        uniqueUniversities.forEach(uni => {
            const card = document.createElement("div");
            card.className = "university-card";
            card.innerHTML = `
                <h3>${uni.name}</h3>
                <a href="${uni.link}" target="_blank" rel="noopener noreferrer" class="university-logo-link">
                    <img src="${uni.logo}" alt="${uni.name} Logo" class="university-logo">
                </a>
            `;
            cardsContainer.appendChild(card);
        });

        universitySection.appendChild(cardsContainer);
    }

    // Load the data when the DOM is ready
    loadTeachingData();
});

