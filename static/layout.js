function handle_navbar_search() {
    const search_term = $("#search-input").val();
    $("#search-input").val("");
        if (search_term.replaceAll(" ", "").length === 0) {
            $("#search").focus();
            return;
        }
        window.location.href = `/search/${search_term}`
        return false;
}

$(document).ready(function() {
    $("#search-input").on("keypress", function(e) {
        if (e.which === 13) {
            handle_navbar_search();
        }
    });

    $("#search-button").on("click", function() {
        handle_navbar_search();
    });
    if(localStorage.getItem("session_id") != null) {
        $.ajax({
            type: "POST",
            url: "/session",
            data: JSON.stringify({
                "session_id": localStorage.getItem("session_id")
            }),
            contentType: "application/json; charset=utf-8",
            dataType: "json"
        });
    }
});