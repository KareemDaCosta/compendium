function createItemCardHTML(item) {
    return `<div class="col-md-4"><a href="/view/${item.id}">
                <div class="item-card" data-id="item-${item.id}">
                    <div class="item-card-image-container">
                        <img src="${item.image}" alt="${item.name}">
                    </div>
                    <div class="item-card-info">
                        <div class="item-card-name">${item.name}</div>
                        <div class="item-card-subtext">Challenge Rating: ${item.cr}</div>
                    </div>
                </div>
            </a></div>`;
}

function display_popular_items(items) {
    $("#popular-items").empty();
    var indices = Object.keys(items);
    indices.sort((a, b) => Number(a) - Number(b));
    for (let i = 0; i < 3; i++) {
        $("#popular-items").append(createItemCardHTML(items[indices[i]]));
    }
}

$(document).ready(function() {
    display_popular_items(data);
});
