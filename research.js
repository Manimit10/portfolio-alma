document.addEventListener('DOMContentLoaded', () => {
    const publicationsList = document.getElementById('publications-list');
    const paginationControls = document.getElementById('pagination-controls');
    const searchBar = document.getElementById('search-bar');
    const yearFilter = document.getElementById('year-filter');
    const categoryFilter = document.getElementById('category-filter');

    let allPublications = [];
    let filteredPublications = [];
    let currentPage = 1;
    const itemsPerPage = 10;

    async function fetchPublications() {
        try {
            const response = await fetch('publications1.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            allPublications = await response.json();
            allPublications.sort((a, b) => b.year - a.year);
            console.log('Publications fetched:', allPublications.length);
            populateFilters();
            applyFiltersAndSearch();
        } catch (error) {
            console.error('Error fetching publications:', error);
            publicationsList.innerHTML = '<p class="error-message">Failed to load publications. Please try again later.</p>';
        }
    }

    function populateFilters() {
        const years = [...new Set(allPublications.map(p => p.year))].sort((a, b) => b - a);
        years.forEach(year => {
            const option = document.createElement('option');
            option.value = year;
            option.textContent = year;
            yearFilter.appendChild(option);
        });

        const categories = [...new Set(allPublications.map(p => p.category))].sort();
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            categoryFilter.appendChild(option);
        });
    }

    function renderPublications(publicationsToRender) {
        publicationsList.innerHTML = '';

        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const publicationsOnPage = publicationsToRender.slice(startIndex, endIndex);

        if (publicationsOnPage.length === 0) {
            publicationsList.innerHTML = '<p class="no-results">No publications found matching your criteria.</p>';
            renderPagination(0);
            return;
        }

        publicationsOnPage.forEach(pub => {
            const card = document.createElement('div');
            card.classList.add('research-paper');

            // Determine the correct download link (DOI or a placeholder if none)
            const downloadUrl = pub.doi ? `https://doi.org/${pub.doi}` : 'https://scholar.google.com/';
            const downloadText = pub.doi ? 'DOI' : 'Google Scholar';
            
            card.innerHTML = `
                <div class="paper-header">
                    <h3 class="paper-title">${pub.title}</h3>
                    <span class="paper-year">${pub.year}</span>
                </div>
            
                <p class="paper-journal">${pub.journal}</p>
                <div class="paper-details">
                    <span class="paper-category">${pub.category}</span>
                    <a href="${downloadUrl}" class="download-link" target="_blank" aria-label="Download from ${downloadText} for ${pub.title}">
                        <i class="fas fa-external-link-alt"></i> Download
                    </a>
                </div>
            `;
            publicationsList.appendChild(card);
        });

        renderPagination(publicationsToRender.length);
    }

    function renderPagination(totalItems) {
        paginationControls.innerHTML = '';
        const totalPages = Math.ceil(totalItems / itemsPerPage);

        if (totalPages <= 1) {
            return;
        }

        const createButton = (text, page, isDisabled = false, isActive = false) => {
            const button = document.createElement('button');
            button.innerHTML = text;
            button.disabled = isDisabled;
            if (isActive) {
                button.classList.add('active');
            }
            button.addEventListener('click', () => {
                currentPage = page;
                renderPublications(filteredPublications);
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
            return button;
        };

        paginationControls.appendChild(createButton('&laquo; Prev', currentPage - 1, currentPage === 1));

        let startPage = Math.max(1, currentPage - 2);
        let endPage = Math.min(totalPages, currentPage + 2);

        if (startPage > 1) {
            paginationControls.appendChild(createButton('1', 1));
            if (startPage > 2) {
                const span = document.createElement('span');
                span.textContent = '...';
                paginationControls.appendChild(span);
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            paginationControls.appendChild(createButton(i.toString(), i, false, i === currentPage));
        }

        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                const span = document.createElement('span');
                span.textContent = '...';
                paginationControls.appendChild(span);
            }
            paginationControls.appendChild(createButton(totalPages.toString(), totalPages));
        }

        paginationControls.appendChild(createButton('Next &raquo;', currentPage + 1, currentPage === totalPages));
    }

    function applyFiltersAndSearch() {
        let currentPublications = [...allPublications];

        const searchTerm = searchBar.value.toLowerCase().trim();
        const selectedYear = yearFilter.value;
        const selectedCategory = categoryFilter.value;

        if (searchTerm) {
            currentPublications = currentPublications.filter(pub =>
                pub.title.toLowerCase().includes(searchTerm) ||
                pub.authors.toLowerCase().includes(searchTerm)
            );
        }

        if (selectedYear) {
            currentPublications = currentPublications.filter(pub =>
                pub.year.toString() === selectedYear
            );
        }

        if (selectedCategory) {
            currentPublications = currentPublications.filter(pub =>
                pub.category === selectedCategory
            );
        }

        filteredPublications = currentPublications;
        currentPage = 1;
        renderPublications(filteredPublications);
    }

    searchBar.addEventListener('input', applyFiltersAndSearch);
    yearFilter.addEventListener('change', applyFiltersAndSearch);
    categoryFilter.addEventListener('change', applyFiltersAndSearch);

    fetchPublications();
});
