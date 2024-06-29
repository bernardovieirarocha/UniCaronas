var calendar = new Calendar(
    "calendarContainer",
    "small",
    ["Domingo", 3],
    ["#5751d9", "#5751d9", "#ffffff", "#ffecb3"],
    {
        days: [
            "Domingo",
            "Segunda",
            "Terça",
            "Quarta",
            "Quinta",
            "Sexta",
            "Sábado",
        ],
        months: [
            "Janeiro",
            "Fevereiro",
            "Março",
            "Abril",
            "Maio",
            "Junho",
            "Julho",
            "Agosto",
            "Setembro",
            "Outubro",
            "Novembro",
            "Dezembro",
        ],
        indicator: true,
        indicator_type: 1,
        indicator_pos: "bottom",
        placeholder: "<span>Informações do Agendamento...</span>",
    }
);

function getLoggedUserID() {
    let usuarioCorrenteJSON = sessionStorage.getItem("usuarioCorrente");
    let usuarioCorrente = JSON.parse(usuarioCorrenteJSON);
    return usuarioCorrente.id;
}

function getCaronas() {
    fetch(`${api}/caronas`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    })
        .then((response) => response.json())
        .then((data) => {
            console.log(data);
            if (data.length > 0) {
                let usuarioCorrenteID = getLoggedUserID();
                let caronasUsuario = data.filter(
                    (carona) =>
                        carona.driver.id === usuarioCorrenteID ||
                        carona.passenger.id === usuarioCorrenteID
                );
                localStorage.setItem(
                    "caronasUsuario",
                    JSON.stringify(caronasUsuario)
                );
                loadCalendar(caronasUsuario);
            }
        })
        .catch((error) => {
            console.error("Error:", error);
        });
}
function loadCalendar(caronaData) {
    var data = {};

    caronaData.forEach(carona => {
        const { date, hour, driver, passenger } = carona;
        
        // Splitting the date string and converting parts to integers
        let [year, month, day] = date.split('-').map(Number);

        // Initialize the data structure for the year, month, and day if not already present
        data[year] = data[year] || {};
        data[year][month] = data[year][month] || {};
        data[year][month][day] = data[year][month][day] || [];

        // Append the event to the calendar data structure
        data[year][month][day].push({
            startTime: hour,
            endTime: '',
            text: `Driver: ${driver.nome}, Passenger: ${passenger.nome}`,
        });
    });

    // Create an Organizer instance with the populated data
    new Organizer("organizerContainer", calendar, data);
}




$(document).ready(function () {
    getCaronas();
});
