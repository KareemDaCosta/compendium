function createItemCardHTML(item) {
    const field = item["match"]
    const data = item["data"]
    const length = item["length"]
    const index = item["index"]
    var extra_info = "";
    var name_info = "";
    if (field == "name") {
        const name_info_span = `<span class="bold">${data.name.substring(index, index+length)}</span>`;
        name_info = data.name.substring(0, index) + name_info_span + data.name.substring(index+length);
        extra_info = `<div class="item-card-subtext">Challenge Rating: ${data.cr}</div>`;
    }
    else if (field == "cr") {
        extra_info = `<div class="item-card-subtext">Challenge Rating: <span class="bold">${data.cr}</span></div>`;
    }
    else if (field == "type") {
        const bold_span = `<span class="bold">${data.type.substring(index, index+length)}</span>`;
        const type = data.type.substring(0, index) + bold_span + data.type.substring(index+length);
        extra_info = `<div class="item-card-subtext">Type: ${type}</div>`;
    }
    else if (field == "alignment") {
        const bold_span = `<span class="bold">${data.alignment.substring(index, index+length)}</span>`;
        const alignment = data.alignment.substring(0, index) + bold_span + data.alignment.substring(index+length);
        extra_info = `<div class="item-card-subtext">Alignment: ${alignment}</div>`;
    }
    return `<a href="/view/${data.id}">
                <div class="item-card" data-id="item-${data.id}">
                    <div class="item-card-image-container">
                        <img src="${data.image}" alt="${data.name}">
                    </div>
                    <div class="item-card-info">
                        <div class="item-card-name">${name_info == "" ? data.name : name_info}</div>
                        ${extra_info}
                    </div>
                </div>
            </a>`;
}

function display_search_entries(items, search_term) {
    $("#search-results").empty();
    $( "#search-results-label").append(`Search Results for <span id="search-term">${search_term}</span>`);
    if (items.length === 0) {
        $("#search-results-container").prepend(`<div id="no-results" class="bold">No results found</div>`);
    }
    else {
        $("#search-results-container").prepend(`<div id="results-count"><span class="bold">${items.length}</span> results found</div>`);
    }
    items.forEach(item => {
        $("#search-results").append(createItemCardHTML(item)); 
    });
}

$(document).ready(function() {
    display_search_entries(data, search_term);
});
