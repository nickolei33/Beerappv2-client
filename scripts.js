// Enhanced scripts.js
document.addEventListener("DOMContentLoaded", () => {
  fetchAndDisplayBeers();
  setupModalEvents();
});

// Variables globales pour stocker l'état des filtres
const filterState = {
  selectedTypes: [],
  searchTerm: "",
};

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

// Fonction pour créer les checkboxes de types de bière
function createTypeCheckboxes(types) {
  const checkboxContainer = document.getElementById("type-checkboxes");
  checkboxContainer.innerHTML = "";

  types.forEach((type) => {
    const checkboxItem = document.createElement("div");
    checkboxItem.classList.add("checkbox-item");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.id = `type-${type.replace(/\s+/g, "-").toLowerCase()}`;
    checkbox.value = type;

    // Pré-cocher les cases si le type est dans les types sélectionnés
    if (filterState.selectedTypes.includes(type)) {
      checkbox.checked = true;
    }

    const label = document.createElement("label");
    label.htmlFor = checkbox.id;
    label.textContent = type;

    checkboxItem.appendChild(checkbox);
    checkboxItem.appendChild(label);
    checkboxContainer.appendChild(checkboxItem);
  });
}

function setupModalEvents() {
  const modal = document.getElementById("filter-modal");
  const filterButton = document.getElementById("type-filter-button");
  const closeModal = document.querySelector(".close-modal");
  const applyButton = document.getElementById("apply-filters");
  const clearButton = document.getElementById("clear-filters");

  // Ouvrir le modal quand on clique sur le bouton de filtre
  filterButton.addEventListener("click", () => {
    modal.style.display = "block";
  });

  // Fermer le modal quand on clique sur la croix
  closeModal.addEventListener("click", () => {
    modal.style.display = "none";
  });

  // Fermer le modal quand on clique en dehors
  window.addEventListener("click", (event) => {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  });

  // Appliquer les filtres
  applyButton.addEventListener("click", () => {
    // Récupérer tous les checkboxes cochés
    const checkedTypes = Array.from(
      document.querySelectorAll(
        "#type-checkboxes input[type='checkbox']:checked"
      )
    ).map((checkbox) => checkbox.value);

    // Mettre à jour l'état des filtres
    filterState.selectedTypes = checkedTypes;

    // Mettre à jour le compteur de sélection
    updateSelectedCount();

    // Filtrer et afficher les bières
    filterAndDisplayBeers();

    // Fermer le modal
    modal.style.display = "none";
  });

  // Effacer tous les filtres
  clearButton.addEventListener("click", () => {
    // Décocher toutes les cases
    document
      .querySelectorAll("#type-checkboxes input[type='checkbox']")
      .forEach((checkbox) => {
        checkbox.checked = false;
      });

    // Réinitialiser l'état des filtres de type
    filterState.selectedTypes = [];

    // Mettre à jour le compteur
    updateSelectedCount();
  });

  // Configurer la recherche
  setupSearch();
}

function updateSelectedCount() {
  const selectedCount = document.getElementById("selected-count");
  if (filterState.selectedTypes.length > 0) {
    selectedCount.textContent = filterState.selectedTypes.length;
    selectedCount.style.display = "inline-flex";
  } else {
    selectedCount.style.display = "none";
  }
}

function setupSearch() {
  const searchInput = document.getElementById("beer-search");

  searchInput.addEventListener("input", (e) => {
    filterState.searchTerm = e.target.value.toLowerCase().trim();
    filterAndDisplayBeers();
  });
}

async function fetchAndDisplayBeers() {
  try {
    const response = await fetch("https://nico-c.info/api/beers");
    if (!response.ok) {
      throw new Error("Impossible de récupérer les données");
    }

    const beers = await response.json();

    // Stocker les bières dans une variable globale pour filtrage ultérieur
    window.allBeers = beers;

    // Créer les checkboxes pour les types de bière
    const types = getUniqueTypes(beers);
    createTypeCheckboxes(types);

    // Afficher toutes les bières au départ
    displayBeers(beers);

    // Initialiser le compteur de bières
    document.getElementById("beer-count-number").textContent = beers.length;
  } catch (error) {
    console.error("Erreur lors du chargement des bières:", error);
    document.getElementById("beer-list").innerHTML = `
      <div class="error-message">
        <p>Une erreur est survenue lors du chargement des bières. Veuillez réessayer plus tard.</p>
      </div>
    `;
  }
}

function filterAndDisplayBeers() {
  if (!window.allBeers) return;

  let filteredBeers = window.allBeers;

  // Filtrer par terme de recherche
  if (filterState.searchTerm) {
    filteredBeers = filteredBeers.filter((beer) => {
      return (
        beer.name.toLowerCase().includes(filterState.searchTerm) ||
        beer.brewery.name.toLowerCase().includes(filterState.searchTerm) ||
        beer.type.toLowerCase().includes(filterState.searchTerm)
      );
    });
  }

  // Filtrer par types sélectionnés
  if (filterState.selectedTypes.length > 0) {
    filteredBeers = filteredBeers.filter((beer) => {
      return filterState.selectedTypes.includes(beer.type);
    });
  }

  // Afficher les bières filtrées
  displayBeers(filteredBeers);
}
