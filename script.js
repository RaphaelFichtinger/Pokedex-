let pokemonArray = []; // after fetch for the URL, pokemons get pushed into this array
let limit = 10;
let loaded = false
let enoughTimePassed = false   

async function loadPokemon() {
    
    try {
        // Fetch the list of Pokemon names
        let namesResponse = await fetch(`https://pokeapi.co/api/v2/pokemon?limit= ${limit}`);
        let namesData = await namesResponse.json();
        let allPokemonNames = namesData.results.map(pokemon => pokemon.name);
        // Fetch details for each Pokemon
        const promises = allPokemonNames.map(async (pokemonName) => {
            let url = `https://pokeapi.co/api/v2/pokemon/${pokemonName}`;
            let response = await fetch(url); // function to get data from API
            return response.json();
        });
        pokemonArray = await Promise.all(promises);
        createPokedex();
    } catch (error) {
        console.error('Error loading Pokemon:', error);
    }
}


function loadMore() {
    limit += 10;
    pokedex.innerHTML = "";
    loadPokemon();
}


function createFilteredPokedex(filteredPokemon) {
    let pokedex = document.getElementById('pokedex');
    pokedex.innerHTML = '';                                      // searching function
    for (let i = 0; i < filteredPokemon.length; i++) {
        let currentPokemon = filteredPokemon[i];
        let originalIndex = pokemonArray.indexOf(currentPokemon);
        pokedex.innerHTML += filteredPokemonTemplate(originalIndex, currentPokemon);
        showBgbyType(currentPokemon, originalIndex);
    }
}


            // searching function
window.addEventListener("load", function () {
    if (enoughTimePassed) { hidePreloader() }
    loaded = true
})
setTimeout(() => {
    if (loaded) { hidePreloader() }
    enoughTimePassed = true
}, 1000)
function hidePreloader() {
    document.getElementById("preloader").remove()
}


function addSearchBarHandler() {
    let input = document.getElementById("searchInput");
    function search() {
        let searchTerm = input.value.toLowerCase();
        let filteredPokemon = pokemonArray.filter(pokemon => {
            let nameOfPokemon = pokemon.name.toLowerCase();
            return nameOfPokemon.includes(searchTerm);
        });
        createFilteredPokedex(filteredPokemon)
    }
    input.oninput = search;
}


function createPokedex() { // creates all cards in  first main-overview 
    let pokedex = document.getElementById('pokedex');
    for (let i = 0; i < pokemonArray.length; i++) {
        let currentPokemon = pokemonArray[i];
        pokedex.innerHTML += pokedexTemplate(i, currentPokemon);
        showBgbyType(currentPokemon, i);
    }
}


function createPokemonCard(i) {   // shows pokemon in overlay
    let selectedPokemon = pokemonArray[i];
    let card = document.getElementById('pokemonCard');
    card.classList.remove('d-none');
    card.innerHTML = overlayCardTemplate(i, selectedPokemon);
    showOverlayBgbyType(selectedPokemon, i);
}

function goBackToPokedex() { // leads back to main-overview
    let card = document.getElementById('pokemonCard');
    card.innerHTML = '';
    card.classList.add('d-none');
}


function previousPokemon(i) {   //perv-button
    if (i == 0) {
        i = pokemonArray.length - 1;
    } else {
        i--;
    }
    createPokemonCard(i);
    console.log(i);
}


function nextPokemon(i) {      //next-button
    if (i == pokemonArray.length - 1) {
        i = 0;
    } else {
        i++;
    }
    createPokemonCard(i);
}


function showBgbyType(currentPokemon, i) {  // adds background colors for specific types of pokemon
    let type = currentPokemon['types'][0]['type']['name'];
    let infoCard = document.getElementById(`cardBodyElement${i}`);
    infoCard.classList.add(type);
    
}


function showOverlayBgbyType(selectedPokemon, i) { // adds colored images to bgs for specific pokemon types
    let type = selectedPokemon['types'][0]['type']['name'];
    let overlayImage = document.getElementById(`elementIcon${i}`)
    let overlayBg = document.getElementById(`contentOverlay${i}`)
    overlayImage.classList.add(`bg-img-${type}`);
    overlayBg.classList.add(`bg-${type}SUB`);
    
}


function pokedexTemplate(i, currentPokemon) { // HTML Templates
    return `<div id="pokedex-card" class="pokedex-card"">
                <img onclick="createPokemonCard(${i})" id="pokemonImage${currentPokemon}" 
                src="${currentPokemon['sprites']['other']['dream_world']['front_default']}" class="card-img-main">
         <div id="cardBodyElement${i}" class="card-body-pokemon">
               
        <div class="texts">
         <p class="texts1">${currentPokemon.name}</p>
         <p class="texts2">Type: ${currentPokemon.types[0].type.name}</p>
        </div>
    </div>`;
}


function overlayCardTemplate(i, currentPokemon) {
    return `
    <div> <button id="previousButton" onclick="previousPokemon(${i})"><</button>
    </div>        
    <div id="contentOverlay${i}" class="content-overlay">      
                <div id="overlayTop">
                    <div id="pokemonNumber">#${currentPokemon.id}
                    </div>
                        <div id="pokemonName">${currentPokemon.name}
                        </div>
                            <p id="pokemonType${currentPokemon.name}"</p>
            <div id="pokemonWeight">Weight: ${currentPokemon.weight}
            </div>
            <div id="elementIcon${i}">
            </div>
            <img class="image-overlay"id="pokemonOverlayImage" src="${currentPokemon['sprites']['other']['home']['front_default']}"> 
        </div>       
    




        <div id="containers-of-bottom-overlay">

                <div id="overlay-stats">
                    <h1 id="headingStats">Stats</h1>
                        <div id="infoBars">
                            <div class="overlayHpBar"> HP
                                <div>${currentPokemon['stats'][0]['base_stat']}
                                </div> 
                            </div>        
                            <div class="overlayHpBar"> ATK
                                <div>${currentPokemon['stats'][1]['base_stat']}
                                </div> 
                            </div>
                            <div class="overlayHpBar"> DEF
                                        <div >${currentPokemon['stats'][2]['base_stat']}
                                        </div>
                            </div>
                            <div class="overlayHpBar"> SPD
                                <div>${currentPokemon['stats'][5]['base_stat']}
                                </div>
                            </div>
                        </div>   
                        </div>          
        



                        <div id="overlay-evo">
                        <h1>Evolution Forms</h1>


                        
                        </div>          
            



















        
        <button id="backButton" onclick="goBackToPokedex()">Back to Pokedex</button>














        
        <div class="media-buttons">
                        <button id="previousButtonMedia" onclick="previousPokemon(${i})"><</button>
                <div>   
                <button id="nextButtonMedia" onclick="nextPokemon(${i})">></button>
                </div>  
        </div>
                        
        
        </div>
            </div>    
        <div>
                            <button id="nextButton" onclick="nextPokemon(${i})">></button>
    </div>  
                `;
}


function filteredPokemonTemplate(originalIndex, currentPokemon) {
    return `
    <div id="pokedex-card">
            <img onclick="createPokemonCard(${originalIndex})" src="${currentPokemon['sprites']['other']['dream_world']['front_default']}" class="card-img-main">
        <div id="cardBodyElement${originalIndex}" class="card-body-pokemon">
                <div class="texts">
                    <p class="texts1">${currentPokemon.name}</p>
                    <p class="texts2">Type: ${currentPokemon.types[0].type.name}</p>
                </div>
            </div>
        </div>`;
}

