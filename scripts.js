// scripts.js
document.addEventListener('DOMContentLoaded', () => {
    // Remplacez cette URL par l'URL réelle de votre API
    const apiURL = 'http://nico-c.info/api/beers';

    fetch(apiURL)
        .then(response => response.json())
        .then(data => {
            const beers = data; // Supposons que la réponse de l'API soit un tableau d'objets bière
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
            <img src="${beer.image_url}" alt="${beer.name}">
            <div class="beer-details">
                <div class="brewery-name">${beer.brewery}</div>
                <div class="beer-name">${beer.name}</div>
                <div class="beer-type">${beer.type}  - ABV:${beer.alcohol_percentage}%</div>
                <div class="beer-price"> 🍷 : ${beer.price_12_5cl}€ - 🍺 : ${beer.price_25cl}€</div>
            </div>
        `;

        beerList.appendChild(beerItem);
    });
}
