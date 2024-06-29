const api = "https://json-servert1.glitch.me";

const URLParams = new URLSearchParams(window.location.search);

const userID = URLParams.get("userID");
const desiredTrajeto = URLParams.get("desiredTrajeto");

const mulheresImagens = ['pessoa1.jpg', 'pessoa2.jpg', 'pessoa3.jpg']
const homensImagens = [ 'pessoa4.jpg', 'pessoa5.jpg', ]

function dayOfWeekAsNumber(day) {
    const map = { Dom: 0, Seg: 1, Ter: 2, Qua: 3, Qui: 4, Sex: 5, Sab: 6 };
    return map[day];
}

function findNextAvailableDate(days) {
    const today = new Date();
    const todayDayOfWeek = today.getDay();
    const daysOfWeek = days.map((day) => dayOfWeekAsNumber(day));

    let daysUntilNext = daysOfWeek
        .map((day) => (day - todayDayOfWeek + 7) % 7)
        .filter((day) => day > 0);
    if (daysUntilNext.length === 0) return null; // No available days

    const nextAvailableDay = Math.min(...daysUntilNext);
    const nextAvailableDate = new Date(today);
    nextAvailableDate.setDate(today.getDate() + nextAvailableDay);
    return nextAvailableDate;
}

function formatDateForCalendar(date) {
    // Ensure the input is a Date object
    if (!(date instanceof Date)) {
        console.error("Input must be a Date object.");
        return null;
    }

    // Extract year, month, and day
    const year = date.getFullYear();
    // getMonth() returns 0-11; adding 1 to get 1-12 and padding with '0' if necessary
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    // getDate() returns the day of the month, padding with '0' if necessary
    const day = date.getDate().toString().padStart(2, "0");

    // Format the date string
    const formattedDate = `${year}-${month}-${day}`;

    return formattedDate;
}
function loadUserProfile() {
  fetch(`${api}/users/${userID}`)
      .then(response => response.json())
      .then(user => {
          $('#username').text(user.nome || 'Usuário');
          $('#idade').html(`<strong>Idade:</strong> ${user.idade}`);
          $('#telefone').html(`<strong>Telefone:</strong> ${user.telefone}`);
          $('#carro').html(`<strong>Carro</strong>: ${user.carro.marca} ${user.carro.modelo} (${user.carro.cor})`);
          $("#universidade").html(`<strong>Universidade:</strong> ${user.Universidade}`);
          $('#bio').text(user.bio || 'Sem biografia disponível');
          $('#profile_pic').attr('src', user.sexo === "masculino" 
              ? "./assets/img/imgprofile/" + homensImagens[Math.floor(Math.random() * homensImagens.length)]
              : "./assets/img/imgprofile/" + mulheresImagens[Math.floor(Math.random() * mulheresImagens.length)]);
      })
      .catch(error => console.error("Erro ao buscar usuário:", error));
}



document.addEventListener("DOMContentLoaded", function () {
    fetchTrajetos(); // Carrega os trajetos ao inicializar a página
    loadUserProfile();
});

function generateUUID() {
    // Public Domain/MIT
    var d = new Date().getTime(); //Timestamp
    var d2 = (performance && performance.now && performance.now() * 1000) || 0; //Time in microseconds since page-load or 0 if unsupported
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
        /[xy]/g,
        function (c) {
            var r = Math.random() * 16; //random number between 0 and 16
            if (d > 0) {
                //Use timestamp until depleted
                r = (d + r) % 16 | 0;
                d = Math.floor(d / 16);
            } else {
                //Use microseconds since page-load if supported
                r = (d2 + r) % 16 | 0;
                d2 = Math.floor(d2 / 16);
            }
            return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
        }
    );
}

function createCarona(driver, objectTRAJETO, passenger, date) {
    let carona = {
        id: generateUUID(),
        status: "solicitacao",
        driver: {
            nome: driver.nome,
            id: driver.id,
        },
        passenger: {
            nome: passenger.nome,
            id: passenger.id,
        },
        date: date,
        trajetoID: objectTRAJETO.id,
        hour: objectTRAJETO.horario,
        mensagem: [],
    };
    fetch(`${api}/caronas`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(carona),
    })
        .then((response) => {
            if (response.ok) {
                console.log("Carona marcada com sucesso!");
                fetchTrajetos(); // Atualiza a tabela de trajetos
            } else {
                console.error("Erro ao marcar carona:", response);
            }
        })
        .catch((error) => console.error("Erro ao marcar carona:", error));
}



function handleCarona(driver, objectTRAJETO) {
    let passenger = JSON.parse(sessionStorage.getItem("usuarioCorrente"));
    if (!passenger) {
        // Redirect to login page if user is not logged in
        window.location.href = "login.html";
    }
    if (objectTRAJETO.diaSemana.length > 1) {
        console.log(objectTRAJETO.diaSemana.length);
        const modalTitle = document.getElementById("staticBackdropLabel");
        modalTitle.textContent = "Escolha um dia para a carona";
        const modalBody = document.getElementById("modal-body");
        modalBody.innerHTML = ""; // Clear existing content
        objectTRAJETO.diaSemana.forEach((day) => {
            const button = document.createElement("button");
            button.className = "btn btn-primary m-2";
            button.textContent = day;
            button.addEventListener("click", function () {
                let date = formatDateForCalendar(findNextAvailableDate([day]));
                createCarona(driver, objectTRAJETO, passenger, date);
                $("#staticBackdrop").modal("hide");
            });
            modalBody.appendChild(button);
        });
        $("#staticBackdrop").modal("show");
    } else {
        let date = formatDateForCalendar(findNextAvailableDate(objectTRAJETO.diaSemana));
        createCarona(driver, objectTRAJETO, passenger, date);
    }
}

// TODO: Must create a function to handle MaxPassengers 
function fetchTrajetos() {
    fetch(`${api}/users`)
        .then((response) => response.json())
        .then((users) => {
            let myUser = users.find((user) => user.id === userID);
            const tabela = document.getElementById("trajetoData");
            tabela.innerHTML = ""; // Limpa a tabela antes de adicionar novos trajetos

            myUser.trajetos.forEach((trajeto) => {
                const className =
                    trajeto.id === desiredTrajeto ? "table-success" : "";
                let diasSemanas = "";
                trajeto.regularidade.forEach((diaSemana) => {
                    diasSemanas += `<li>${diaSemana}</li>`;
                });
                const objectUSER = {
                    nome: myUser.nome,
                    id: userID,
                };
                const objectTRAJETO = {
                    horario: trajeto.hour,
                    diaSemana: trajeto.regularidade,
                    id: trajeto.id,
                };
                const linha = `
          <tr class="${className}">
            <td>${trajeto.start_point}</td>
            <td>${trajeto.destination}</td>
            <td>${trajeto.hour}</td>
            <td><ul>${diasSemanas}</ul></td>
            <td><a id="marcarCarona" class="btn btn-success" onclick='handleCarona(${JSON.stringify(
                objectUSER
            )}, ${JSON.stringify(objectTRAJETO)})'>Marcar Carona</a></td>
          </tr>`;
                tabela.innerHTML += linha;
            });
        })
        .catch((error) => console.error("Erro ao buscar trajetos:", error));
}
