// scripts.js
document.addEventListener('DOMContentLoaded', () => {
    const apiURL = 'https://nico-c.info/api/beers';

    fetch(apiURL)
        .then(response => response.json())
        .then(data => {
            const beers = data;
            displayBeers(beers);
        })
        .catch(error => console.error('Erreur lors de la récupération des données :', error));
});

function displayBeers(beers) {
    const beerList = document.getElementById('beer-list');

    beers.forEach(beer => {
        const beerItem = document.createElement('div');
        beerItem.classList.add('beer-item');

        beerItem.innerHTML = `
            <div class="beer-item-inner">
                <div class="beer-item-front">
                    <div class="beer-logo"><img src="${beer.image_url}" alt="Logo de ${beer.name}"></div>
                    <div class="beer-details">
                        <div class="brewery-name">${beer.brewery.name} - Stand: ${beer.brewery.stand_number}</div>
                        <div class="beer-name">${beer.name}</div>
                        <div class="beer-type">${beer.type}</div>
                        <div class="beer-price">🍷: ${beer.price_12_5cl}€ - 🍺: ${beer.price_25cl}€</div>
                    </div>
                </div>
                <div class="beer-item-back">
                    <div class="brewery-logo"><img src="${beer.brewery.logo_url}" alt="Logo de ${beer.brewery.name}"></div>
                    <div class="beer-details">
                        <div class="beer-description">${beer.description}</div>
                        <div class="beer-abv">ABV: ${beer.alcohol_percentage}%</div>
                        <div class="beer-ibu">IBU: ${beer.ibu}</div>
                    </div>
                </div>
            </div>
        `;

        beerItem.addEventListener('click', () => {
            beerItem.classList.toggle('flip');
        });

        beerList.appendChild(beerItem);
    });
}