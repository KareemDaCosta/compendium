var currentSpeedIndex = 0;

var speeds = [
    
]

function createSpeedRow(index, type="Walk", speed="") {
    return `<div class="row speed-row" id="speed-row-${index}">
                <div class="col-5">
                    <select
                        name="speed-type-${index}"
                        id="edit-form-speed-type-${index}"
                        class="form-select edit-form-speed-type"
                        required>
                        <option ${type=="Burrow" ? "selected=selected": ""}>Burrow</option>
                        <option ${type=="Climb" ? "selected=selected": ""}>Climb</option>
                        <option ${type=="Fly" ? "selected=selected": ""}>Fly</option>
                        <option ${type=="Swim" ? "selected=selected": ""}>Swim</option>
                        <option ${type=="Walk" ? "selected=selected": ""}>
                            Walk
                        </option>
                    </select>
                </div>
                <div class="col-6">
                    <input
                        type="text"
                        class="form-control edit-form-speed-distance"
                        id="edit-form-speed-${index}"
                        name="speed-${index}"
                        value="${speed}"
                        required></input>
                </div>
                ${index === 0 ? "" : 
                `<div class="col-1">
                    <button type="button" class="btn btn-outline-danger remove-speed-button" id="remove-speed-button-${index}">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
                            <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
                        </svg>
                    </button>
                </div>`}
                <div class="col-md-12">
                    <div
                        class="invalid-feedback"
                        id="invalid-speed-feedback-${index}"></div>
                </div>
            </div>`
}

function addSpeedHandlers() {
    $(".edit-form-speed-type").change(function() {
        const index = parseInt($(this).attr("id").split("-").pop());
        const speedType = $(this).val();
        speeds[index].type = speedType;
    });
    $(".edit-form-speed-distance").change(function() {
        const index = parseInt($(this).attr("id").split("-").pop());
        const distance = $(this).val();
        speeds[index].distance = distance;
    });
    $(".remove-speed-button").click(function() {
        const index = parseInt($(this).attr("id").split("-").pop());
        speeds.splice(index, 1);
        currentSpeedIndex--;
        $("#add-additional-speed-button").show();
        $("#speeds-container").empty();
        for(i = 0; i <= currentSpeedIndex; i++) {
            $("#speeds-container").append(
                createSpeedRow(i, speeds[i].type, speeds[i].distance)
            )
        }
        addSpeedHandlers();
    });    
}

$(document).ready(function() {

    creature = data
    $("#edit-form-name").val(creature.name);
    $("#edit-form-image").val(creature.image);
    $("#edit-form-image-preview").html(`<img src="${creature.image}" alt="Creature Image">`);
    $("#edit-form-description").val(creature.description);
    $("#edit-form-url").val(creature.url);
    $("#edit-form-cr").val(creature.cr);
    $("#edit-form-type").val(creature.type);
    $("#edit-form-alignment").val(creature.alignment);
    $("#edit-form-size").val(creature.size);
    $("#edit-form-hp").val(creature.hp);
    $("#edit-form-ac").val(creature.ac);
    speeds = creature.movement;
    speeds = speeds.map(speed => {
        return {
            type: speed.type.charAt(0).toUpperCase() + speed.type.slice(1),
            distance: speed.distance.toString()
        }
    })

    currentSpeedIndex = speeds.length - 1;

    $("#speeds-container").empty();
    for(i = 0; i <= currentSpeedIndex; i++) {
        $("#speeds-container").append(
            createSpeedRow(i, speeds[i].type, speeds[i].distance)
        )
    }
    $("#cancel-button").on("click", function() {
        $('#cancel-modal').modal('show');
    });

    $("#confirm-discard-changes").on("click", function() {
        window.location.href = `/view/${creature.id}`;
    });

    $("#edit-form-name").focus();

    addSpeedHandlers();

    $("#add-additional-speed-button").click(function() {
        if (currentSpeedIndex >= 4) {
            return;
        }
        currentSpeedIndex++;
        if (currentSpeedIndex === 4) {
            $("#add-additional-speed-button").hide();
        }
        speeds[currentSpeedIndex] = {
            type: "Walk",
            distance: ""
        }
        $("#speeds-container").empty();
        for(i = 0; i <= currentSpeedIndex; i++) {
            $("#speeds-container").append(
                createSpeedRow(i, speeds[i].type, speeds[i].distance)
            )
        }
        addSpeedHandlers();
    });

    $("#edit-form-image").change(function() {
        const image = $(this).val();
        if (image.replaceAll(" ", "").length === 0) {
            return;   
        }
        $("#edit-form-image-preview").html(`<img src="${image}" alt="Creature Image">`);
    });

    $("#submit-button").click(function() {
        const name = $("#edit-form-name").val();
        const image = $("#edit-form-image").val();
        const description = $("#edit-form-description").val();
        const url = $("#edit-form-url").val();
        const cr = $("#edit-form-cr").val();
        const type = $("#edit-form-type").val();
        const alignment = $("#edit-form-alignment").val();
        const size = $("#edit-form-size").val();
        const hp = $("#edit-form-hp").val();
        const ac = $("#edit-form-ac").val();
        foundError = false
        foundSpeeds = new Set()
        for (i = 0; i <= currentSpeedIndex; i++) {
            if (speeds[i].distance.replaceAll(" ", "").length === 0 || isNaN(speeds[i].distance) || speeds[i].type.replaceAll(" ", "").length === 0 || foundSpeeds.has(speeds[i].type)){
                $(`#edit-form-speed-${i}`).focus();
                $(`#invalid-speed-feedback-${i}`).text("Please enter a valid speed");
                if (isNaN(speeds[i].distance)) {
                    $(`#invalid-speed-feedback-${i}`).text("Please enter a valid number");
                }
                if (foundSpeeds.has(speeds[i].type)) {
                    $(`#invalid-speed-feedback-${i}`).text("Duplicate Speed Type");
                }
                foundError = true;
            }
            else {
                foundSpeeds.add(speeds[i].type);
                $(`#invalid-speed-feedback-${i}`).text("");
            }
        }
        if (ac.replaceAll(" ", "").length === 0 || isNaN(ac)) {
            $("#edit-form-ac").focus();
            $("#invalid-ac-feedback").text("Please enter creature AC");
            if (isNaN(ac)) {
                $("#invalid-ac-feedback").text("Please enter a valid number");
            }
            foundError = true;
        }
        else {
            $("#invalid-ac-feedback").text("");
        }
        if (hp.replaceAll(" ", "").length === 0 || isNaN(hp)) {
            $("#edit-form-hp").focus();
            $("#invalid-hp-feedback").text("Please enter creature HP");
            if (isNaN(hp)) {
                $("#invalid-hp-feedback").text("Please enter a valid number");
            }
            foundError = true;
        }
        else {
            $("#invalid-hp-feedback").text("");
        }
        if (size.replaceAll(" ", "").length === 0) {
            $("#edit-form-size").focus();
            $("#invalid-size-feedback").text("Please enter a size");
            foundError = true;
        }
        else {
            $("#invalid-size-feedback").text("");
        }
        if (alignment.replaceAll(" ", "").length === 0) {
            $("#edit-form-alignment").focus();
            $("#invalid-alignment-feedback").text("Please enter an alignment");
            foundError = true;
        }
        else {
            $("#invalid-alignment-feedback").text("");
        }
        if (type.replaceAll(" ", "").length === 0) {
            $("#edit-form-type").focus();
            $("#invalid-type-feedback").text("Please enter a type");
            foundError = true;
        }
        else {
            $("#invalid-type-feedback").text("");
        }
        if (cr.replaceAll(" ", "").length === 0 || isNaN(cr)) {
            $("#edit-form-cr").focus();
            $("#invalid-cr-feedback").text("Please enter a Challenge Rating");
            if (isNaN(cr)) {
                $("#invalid-cr-feedback").text("Please enter a valid number");
            }
            foundError = true;
        }
        else {
            $("#invalid-cr-feedback").text("");
        }
        if (url.replaceAll(" ", "").length === 0) {
            $("#edit-form-url").focus();
            $("#invalid-url-feedback").text("Please enter a URL");
            foundError = true;
        }
        else {
            $("#invalid-url-feedback").text("");
        }
        if (description.replaceAll(" ", "").length === 0) {
            $("#edit-form-description").focus();
            $("#invalid-description-feedback").text("Please enter a description");
            foundError = true;
        }
        else {
            $("#invalid-description-feedback").text("");
        }
        if (image.replaceAll(" ", "").length === 0) {
            $("#edit-form-image").focus();
            $("#invalid-image-feedback").text("Please enter a URL");
            foundError = true;
        }
        else {
            $("#invalid-image-feedback").text("");
        }
        if (name.replaceAll(" ", "").length === 0) {
            $("#edit-form-name").focus();
            $("#invalid-name-feedback").text("Please enter a name");
            foundError = true;
        }
        else {
            $("#invalid-name-feedback").text("");
        }     

        if (foundError) {
            return;
        }
        $.ajax({
            type: "POST",
            url: "/edit_creature",
            data: JSON.stringify({
                "id": creature.id,
                "name": name,
                "image": image,
                "description": description,
                "url": url,
                "cr": cr,
                "type": type,
                "alignment": alignment,
                "size": size,
                "hp": hp,
                "ac": ac,
                "speeds": speeds,
                "session_id": localStorage.getItem("session_id"),
            }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function(data){
                if (data["success"]) {
                    $("#edit-creature-form").trigger("reset");
                    $("#speeds-container").empty();
                    $("#add-additional-speed-button").show();
                    currentSpeedIndex = 0;
                    speeds = [{
                        type: "Walk",
                        speed: ""
                    }];
                    $("#speeds-container").append(createSpeedRow(0, "Walk", ""));
                    addSpeedHandlers();
                    $("#error-message").text("");
                    $("#edit-form-name").focus();
                    $('.invalid-feedback').empty()
                    const url = localStorage.getItem("session_id") ? `/view/${creature.id}?session_id=${localStorage.getItem("session_id")}` : `/view/${creature.id}`;
                    window.location.href = url;
                } else {
                    $("#error-message").text(data["error"]);
                }
            }
        });
        
    });
});