const api = 'https://json-servert1.glitch.me';


function showLoadingSpinner() {
    $("#loadingSpinner").show();
}

function hideLoadingSpinner() {
    $("#loadingSpinner").hide();
}


let startingPointChoices = new Choices("#startingPointDropdown", {
    searchEnabled: true,
    removeItemButton: true,
    allowHTML: true,

});
let destinationChoices = new Choices("#destinationDropdown", {
    searchEnabled: true,
    removeItemButton: true,
    allowHTML: true,

});

const sexFilter = new Choices("#sexFilter", {
    searchEnabled: false,
    allowHTML: true,

});
const daysFilter = new Choices("#daysFilter", {
    removeItemButton: true,
    maxItemCount: 7,
    searchEnabled: false,
    placeholder: true,
    placeholderValue: "Selecione os Dias",
    allowHTML: true,
});

function fetchNeighborhoods() {
    showLoadingSpinner();

    const settings = {
        async: true,
        url: `${api}/bairros/`,
        method: "GET",
    };

    $.ajax(settings).done(function (response) {
        populateDropdownNeighborhoods(
            startingPointChoices,
            response.result,
            "name"
        );
        hideLoadingSpinner();

    });
}

function fetchUniversities() {
    showLoadingSpinner();

    $.ajax({
        url: `${api}/universidades/`,
        type: "GET",
        contentType: "application/json",
    }).done(function (response) {
        populateDropdown(destinationChoices, response, "nome");
        hideLoadingSpinner();
    });
}

function populateDropdown(choicesInstance, data, key) {
    data.forEach((element) => {
        choicesInstance.setChoices(
            [
                {
                    value: element.id,
                    label: element[key],
                    selected: false,
                },
            ],
            "value",
            "label",
            false
        );
    });
}

function populateDropdownNeighborhoods(choicesInstance, data) {
    data.forEach((element) => {
        choicesInstance.setChoices(
            [
                {
                    value: element.name,
                    label: element.name,
                    selected: false,
                },
            ],
            "value",
            "label",
            false
        );
    });
}

$(document).ready(function () {
    fetchNeighborhoods();
    fetchUniversities();

    $("#searchForm").on("submit", function (e) {
        e.preventDefault();
        var startPoint = $("#startingPointDropdown").val();
        var destination = $("#destinationDropdown").val();

        if (!startPoint || !destination) {
            alert("Por favor, selecione o ponto de partida e o destino.");
            return;
        }

        fetchUsers(startPoint, destination);
    });
    $("#timeFilter").timepicker({
        timeFormat: "H:mm", // Correct format for 24-hour time with minutes
        interval: 60, // Time intervals in minutes
        minTime: "05:00", // Minimum time selection as 00:00
        maxTime: "23:30", // Maximum time selection as 23:30
        dropdown: true, // Allows the dropdown to appear
        scrollbar: true, // Allows scrolling in the timepicker dropdown
    });
    $("#clearFilters").on("click", function () {
        $("#sexFilter").val("");
        $("#daysFilter").val("");
        $("#timeFilter").val("");
        $("#results").empty();
    });
});
function fetchUsers(startPoint, destination) {
    showLoadingSpinner();
    $.ajax({
        url: `${api}/users/`,
        type: "GET",
        contentType: "application/json",
        success: function (users) {
            var sex = $("#sexFilter").val();
            var days = $("#daysFilter").val() || [];
            var time = $("#timeFilter").val();
            var results = [];

            users.forEach((user) => {
                var sexMatch = !sex || user.sexo === sex;
                user.trajetos.forEach((trajeto) => {
                    var daysMatch =
                        !days.length ||
                        days.some((day) =>
                            trajeto.regularidade.includes(day)
                        );
                    var timeMatch = !time || trajeto.hour === time;
                    var startPointMatch =
                        !startPoint ||
                        trajeto.start_point.includes(startPoint);
                    var destinationMatch =
                        !destination ||
                        trajeto.destination.includes(destination);

                    if (
                        sexMatch &&
                        daysMatch &&
                        timeMatch &&
                        startPointMatch &&
                        destinationMatch
                    ) {
                        results.push({
                            nome: user.nome,
                            email: user.email,
                            trajeto: trajeto,
                        });
                    }
                });
            });
            hideLoadingSpinner();
            displayResults(results);
        },
        error: function (xhr, status, error) {
            console.error("Error fetching users: " + error);
        },
    });
}

function displayResults(results) {
    // Minha parte não incluiu o display dos resultados e nem a conexão desse resultado com a página de perfil do usuário para poder realmente marcar a carona
    var $results = $("#results");
    $results.empty();
    if (results.length) {
        results.forEach((result) => {
            var content = `<div>${result.nome} - ${result.email} - From: ${result.trajeto.start_point} to ${result.trajeto.destination} at ${result.trajeto.hour}</div>`;
            $results.append(content);
        });
    } else {
        $results.append("<div>No matches found.</div>");
    }
}