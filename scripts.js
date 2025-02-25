// Enhanced scripts.js
document.addEventListener("DOMContentLoaded", () => {
  fetchAndDisplayBeers();
});

// Function to create elements with animation delays
function createBeerElement(beer, index) {
  const domain = "https://nico-c.info";
  const beerItem = document.createElement("div");
  beerItem.classList.add("beer-item");

  // Add staggered animation delay
  beerItem.style.animationDelay = `${index * 0.1}s`;

  const beerImageUrl = `${domain}${beer.image_url}`;
  const breweryLogoUrl = `${domain}${beer.brewery.logo_url}`;

  // Truncate description to avoid overflow
  const truncatedDescription = truncateDescription(
    beer.description || "Aucune description disponible"
  );

  beerItem.innerHTML = `
        <div class="beer-item-inner">
            <div class="beer-item-front">
                <div class="brewery-name">${beer.brewery.name}</div>
                <div class="beer-name">${beer.name}</div>
                <div><img class="beer-logo" src="${beerImageUrl}" alt="Photo de ${
    beer.name
  }"></div>
                <div class="beer-type">${beer.type}</div>
                <div class="stand-number">${beer.brewery.stand_number}</div>
                <div class="beer-details">
                    <div class="beer-price-wrapper">
                        <div class="beer-price-left">🍷 : ${
                          beer.price_12_5cl
                        }€</div>
                        <div class="beer-price-right">🍺 : ${
                          beer.price_25cl
                        }€</div>
                    </div>
                </div>
                <div class="click-indicator"><i class="fas fa-sync-alt"></i></div>
            </div>
            <div class="beer-item-back">
                <div class="brewery-name">${beer.brewery.name}</div>
                <div class="beer-name">${beer.name}</div>
                <div><img class='brewery-logo' src="${breweryLogoUrl}" alt="Logo de ${
    beer.brewery.name
  }"></div>
                <div class="beer-description">${truncatedDescription}</div>
                <div class="beer-details">
                    <div class="beer-abv-wrapper">
                        <div class="beer-abv">ABV: ${
                          beer.alcohol_percentage
                        }%</div>
                        <div class="beer-ibu">IBU: ${beer.ibu || "N/A"}</div>
                    </div>
                </div>
                <div class="click-indicator"><i class="fas fa-sync-alt"></i></div>
            </div>
        </div>
    `;

  // Add flip animation
  beerItem.addEventListener("click", () => {
    beerItem.classList.toggle("flip");
  });

  return beerItem;
}

// Function to truncate description to fit without scrolling
function truncateDescription(description) {
  // Check if we need to truncate based on length
  // A rough estimate - mobile screens show about 120-150 characters well in 4-5 lines
  const maxLength = 180;

  if (description.length <= maxLength) {
    return description;
  }

  // Find a good breaking point (end of sentence or space)
  let breakPoint = description.lastIndexOf(". ", maxLength);
  if (breakPoint === -1 || breakPoint < maxLength * 0.7) {
    breakPoint = description.lastIndexOf(" ", maxLength);
  }

  if (breakPoint === -1) {
    breakPoint = maxLength;
  }

  return description.substring(0, breakPoint) + "...";
}

function displayBeers(beers) {
  const beerList = document.getElementById("beer-list");

  // Clean existing list
  beerList.innerHTML = "";

  // Update beer count
  document.getElementById("beer-count-number").textContent = beers.length;

  // Sort beers alphabetically by name
  beers.sort((a, b) => a.name.localeCompare(b.name));

  // Add beer items with staggered animation
  beers.forEach((beer, index) => {
    const beerItem = createBeerElement(beer, index);
    beerList.appendChild(beerItem);
  });
}

function getUniqueTypes(beers) {
  // Get unique types and sort alphabetically
  return [...new Set(beers.map((beer) => beer.type))].sort();
}

function populateTypeSelector(types) {
  const selector = document.getElementById("beer-type");
  // Clear selector except "All beers" option
  selector.innerHTML = '<option value="all">Toutes les bières</option>';

  types.forEach((type) => {
    const option = document.createElement("option");
    option.value = type;
    option.textContent = type;
    selector.appendChild(option);
  });
}

function filterBeersByType(beers, selectedType) {
  if (selectedType === "all") {
    return beers;
  }
  return beers.filter((beer) => beer.type === selectedType);
}

function filterBeersBySearchTerm(beers, searchTerm) {
  if (!searchTerm) return beers;

  const normalizedSearchTerm = searchTerm.toLowerCase().trim();

  return beers.filter((beer) => {
    return (
      beer.name.toLowerCase().includes(normalizedSearchTerm) ||
      beer.brewery.name.toLowerCase().includes(normalizedSearchTerm) ||
      beer.type.toLowerCase().includes(normalizedSearchTerm) ||
      (beer.description &&
        beer.description.toLowerCase().includes(normalizedSearchTerm))
    );
  });
}

function applyAllFilters() {
  const typeFilter = document.getElementById("beer-type").value;
  const searchTerm = document.getElementById("beer-search").value;

  let filteredBeers = window.allBeers.filter(
    (beer) => beer.availability === "1"
  );

  // Apply type filter
  filteredBeers = filterBeersByType(filteredBeers, typeFilter);

  // Apply search filter
  filteredBeers = filterBeersBySearchTerm(filteredBeers, searchTerm);

  // Display filtered beers
  displayBeers(filteredBeers);
}

async function fetchAndDisplayBeers() {
  try {
    const response = await fetch("https://nico-c.info/api/beers");

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const beers = await response.json();

    // Store all available beers globally
    window.allBeers = beers.filter((beer) => beer.availability === "1");

    // Get unique types and populate selector
    const uniqueTypes = getUniqueTypes(window.allBeers);
    populateTypeSelector(uniqueTypes);

    // Display all beers initially
    displayBeers(window.allBeers);

    // Add event listeners for filtering
    document
      .getElementById("beer-type")
      .addEventListener("change", applyAllFilters);

    // Add search functionality
    const searchInput = document.getElementById("beer-search");

    // Add real-time filtering as user types
    searchInput.addEventListener("input", applyAllFilters);

    // Add search button click functionality
    document
      .querySelector(".search-icon")
      .addEventListener("click", applyAllFilters);

    // Add enter key functionality to search
    searchInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        applyAllFilters();
      }
    });
  } catch (error) {
    console.error("Erreur lors du chargement des bières:", error);
    document.getElementById("beer-list").innerHTML = `
            <div class="error-message">
                <p>Impossible de charger les bières. Veuillez réessayer plus tard.</p>
                <p>Erreur: ${error.message}</p>
            </div>
        `;
  }
}
