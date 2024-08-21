$(document).ready(function() {
    creature = data
    $( "#creature-image-container" ).html(`<img src='${ creature.image }' alt=${ creature.name }>`); 
    $( "#creature-name" ).text(creature.name);
    $( "#creature-cr").html(`<span id="creature-cr-span">Challenge Rating: </span>${creature.cr}`);
    $ ( "#creature-description" ).text(creature.description);

    $ ("#creature-stats-label").text(`${creature.name} Stats`);

    $( "#creature-size" ).html(`<span class="base bold">Size: </span>${creature.size}`);
    $( "#creature-type" ).html(`<span class="base bold">Type: </span>${creature.type}`);
    $( "#creature-alignment" ).html(`<span class="base bold">Alignment: </span>${creature.alignment}`);
    $( "#creature-hp" ).html(`<span class="base bold">Hit Points: </span>${creature.hp}`);
    $( "#creature-ac" ).html(`<span class="base bold">Armor Class: </span>${creature.ac}`);
    $( "#creature-movement" ).html(`<div class="base bold">Speed: </div>`);
    creature.movement.forEach(item => {
        $( "#creature-movement" ).append(`<div>${item.type}: ${item.distance}ft</div>`);
    });

    $(" #view-more-container ").html(`<a id="creature-view-more-link" href="${creature.url}" target="_blank">View More</a>`);

    $( "#view-more-type ").text(creature.type);
    $( "#view-more-type ").on("click", function() { 
        window.location.href = `/search/${creature.type}`;
    })
    $( "#view-more-alignment ").text(creature.alignment);
    $( "#view-more-alignment ").on("click", function() { 
        window.location.href = `/search/${creature.alignment}`;
    })
    $( "#view-more-cr ").text(`CR ${creature.cr}`);
    $( "#view-more-cr ").on("click", function() { 
        window.location.href = `/search/${creature.cr}`;
    })

    $( "#edit-creature-button" ).on("click", function() {
        window.location.href = `/edit/${creature.id}`;
    });
});