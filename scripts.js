// scripts.js
document.addEventListener('DOMContentLoaded', () => {
    fetchAndDisplayBeers();
});

function displayBeers(beers) {
    const beerList = document.getElementById('beer-list');
    const domain = 'https://nico-c.info';
    
    // Nettoie la liste existante
    beerList.innerHTML = '';

    beers.forEach(beer => {
        if (beer.availability === "1") {  // Check if availability is 1
            const beerItem = document.createElement('div');
            beerItem.classList.add('beer-item');

            const beerImageUrl = `${domain}${beer.image_url}`;
            const breweryLogoUrl = `${domain}${beer.brewery.logo_url}`;
            
            beerItem.innerHTML = `
                <div class="beer-item-inner">
                    <div class="beer-item-front">
                        <div class="brewery-name">${beer.brewery.name}</div>
                        <div class="beer-name">${beer.name}</div>
                        <div><img class="beer-logo" src="${beerImageUrl}" alt="Photo de ${beer.name}"></div>
                        <div class="beer-type">${beer.type}</div>
                        <div class="stand-number">${beer.brewery.stand_number}</div>
                        <div class="beer-details">
                            <div class="beer-price-wrapper">
                                <div class="beer-price-left">🍷 : ${beer.price_12_5cl}€</div>
                                <div class="beer-price-right">🍺 : ${beer.price_25cl}€</div>
                            </div>
                        </div>
                    </div>
                    <div class="beer-item-back">
                        <div class="brewery-name">${beer.brewery.name}</div>
                        <div class="beer-name">${beer.name}</div>
                        <div><img class='brewery-logo' src="${breweryLogoUrl}" alt="Logo de ${beer.brewery.name}"></div>
                        <div class="beer-description">${beer.description}</div>
                        <div class="beer-details">
                            <div class="beer-abv-wrapper">
                                <div class="beer-abv">ABV: ${beer.alcohol_percentage}%</div>
                                <div class="beer-ibu">IBU: ${beer.ibu}</div>
                            </div>
                        </div>
                    </div>
                </div>
            `;

            beerItem.addEventListener('click', () => {
                beerItem.classList.toggle('flip');
            });

            beerList.appendChild(beerItem);
        }
    });
}

// Fonction pour obtenir les types uniques de bières
function getUniqueTypes(beers) {
    // Ne prendre que les bières disponibles pour les types
    const availableBeers = beers.filter(beer => beer.availability === "1");
    return [...new Set(availableBeers.map(beer => beer.type))];
}

// Fonction pour remplir le sélecteur avec les types
function populateTypeSelector(types) {
    const selector = document.getElementById('beer-type');
    // Vider d'abord le sélecteur sauf l'option "Toutes les bières"
    selector.innerHTML = '<option value="all">Toutes les bières</option>';
    
    types.forEach(type => {
        const option = document.createElement('option');
        option.value = type;
        option.textContent = type;
        selector.appendChild(option);
    });
}

// Fonction pour filtrer les bières
function filterBeersByType(beers, selectedType) {
    const availableBeers = beers.filter(beer => beer.availability === "1");
    if (selectedType === 'all') {
        return availableBeers;
    }
    return availableBeers.filter(beer => beer.type === selectedType);
}

// Modification de votre fonction fetch existante
async function fetchAndDisplayBeers() {
    try {
        const response = await fetch('https://nico-c.info/api/beers');
        const beers = await response.json();
        
        // Stocke les bières globalement pour le filtrage
        window.allBeers = beers;
        
        // Obtient et affiche les types uniques dans le sélecteur
        const uniqueTypes = getUniqueTypes(beers);
        populateTypeSelector(uniqueTypes);
        
        // Affiche toutes les bières initialement
        displayBeers(filterBeersByType(beers, 'all'));
        
        // Ajoute l'écouteur d'événements pour le filtrage
        document.getElementById('beer-type').addEventListener('change', (e) => {
            const filteredBeers = filterBeersByType(window.allBeers, e.target.value);
            displayBeers(filteredBeers);
        });
        
    } catch (error) {
        console.error('Erreur lors du chargement des bières:', error);
    }
}
