const api = "http://localhost:3000/";
// https://json-servert1.glitch.me/

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

function formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    const options = { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' };
    return date.toLocaleDateString('pt-BR', options);
}


function CaronaType(carona) {
    let usuarioCorrenteID = getLoggedUserID();
    if (carona.driver.id === usuarioCorrenteID) {
        return true;
    } else if (carona.passenger.id === usuarioCorrenteID) {
        return false;
    }
}

function loadRides(caronasUsuario) {
    let RidesContainer = document.getElementById("rides-list");
    RidesContainer.innerHTML = "";
    caronasUsuario.forEach((carona) => {
        let typeCurrentCarona = CaronaType(carona);
        let iconRide = typeCurrentCarona
            ? '<i class="bi bi-person-arms-up" style="text-align: center;"></i>'
            : '<i class="bi bi-car-front-fill" style="text-align: center;"></i>';
        let status;
        if (carona.status == "solicitacao") {
            status =
                '<i class="bi bi-dot" style="color: red;font-size: 1.3rem; text-align: center"></i>';
        } else if (carona.status == "confirmada") {
            status =
                '<i class="bi bi-dot" style="color: green;font-size: 1.3rem;"></i>';
        } else {
            alert("Erro ao carregar status da carona");
        }
        let needsReview;
        let disabled = "";
        if (typeCurrentCarona) {
            if (carona.status == "solicitacao") {
                needsReview = `<span style="color:#8B8000;">Pendência</span>`;
            } else {
                needsReview = "";
            }
        } else {
            needsReview = "";
        }
        let nameRide = typeCurrentCarona
            ? carona.passenger.nome
            : carona.driver.nome;
        let idRide = carona.id;
        var ride = `<a data-id="${idRide}" class="list-group-item list-group-item-action flex-column align-items-start ${disabled}">
            <div class="d-flex w-100">
                <i class="bi bi-person-circle"></i>
                ${status}
                ${iconRide}
                <p class="mb-0 ms-1">${nameRide}</p>
                <div class="ms-auto"></div>
                ${needsReview}
            </div></a>`;

        $("#rides-list").append(ride);
    });

    $("#rides-list > a").click(function () {
        var rideId = $(this).attr("data-id");
        let caronaCurrent = getCurrentCarona(rideId);
        $(this).toggleClass("ativo");
        $(this).nextAll().removeClass("ativo");
        $(this).prevAll().removeClass("ativo");
        loadChatMessages(caronaCurrent);
        checkNotifications(caronaCurrent);
    });
}

function getCurrentCarona(caronaID) {
    let caronasUsuario = JSON.parse(localStorage.getItem("caronasUsuario"));
    let currentCarona = caronasUsuario.filter(
        (carona) => carona.id === caronaID
    );
    return currentCarona[0];
}

function loadChatMessages(caronaCurrent) {
    console.log(caronaCurrent);
    let chatContainer = $("#chat-container");
    let messageform = $("#messages-form");
    document.getElementById("chat-container").innerHTML = "";
    document.getElementById("messages-form").innerHTML = "";
    getUserInfo(caronaCurrent.driver.id).done(function (response) {
        localStorage.setItem("driverUser", JSON.stringify(response));
    });

    $("#requestRideBlock").remove();
    // Check if the current user is the driver or the passenger (true - driver, false - passenger)
    typeCurrentCarona = CaronaType(caronaCurrent);
    if (typeCurrentCarona) {
        // Driver is the current user
        let title = `Solicitação de ${caronaCurrent.passenger.nome}`;
        let caronaStatus = "ERROR";

        // Check the status of the ride if it is confirmed or pending and set the color accordingly
        if (caronaCurrent.status == "confirmada") {
            caronaStatus = `<small style="color: green;">Confirmada</small>`;
        } else if (caronaCurrent.status == "solicitacao") {
            caronaStatus = `<small style="color:red;">Pendente</small>`;
        }

        let nome = caronaCurrent.passenger.nome;
        let origem = "";
        let destino = "";
        let dias = "";
        let horario = "";
        let trajetoID = caronaCurrent.trajetoID;

        getUserInfo(caronaCurrent.driver.id).done(function (data) {
            trajeto = data.trajetos.filter((trajeto) => {
                if (trajeto.id == trajetoID) {
                    return trajeto.start_point;
                }
            });
            origem = trajeto[0].start_point;
            destino = trajeto[0].destination;
            dias = trajeto[0].regularidade;
            horario = trajeto[0].hour;
            let htmlMessage = `<div class="list-group mt-2">
            <a
                href="#"
                class="list-group-item list-group-item-action"
                aria-current="true"
            >
                <div
                    class="d-flex w-100 justify-content-between"
                >
                 <span id="butaoColapsa"  data-bs-toggle="collapse"
        href="#collapseExample"
        role="button"
        aria-expanded="false"
        aria-controls="collapseExample"><i class="bi bi-list"></i></span>
                    <h5 class="mb-1">
                        ${title}
                    </h5>
                    ${caronaStatus}
                </div>
                <p class="mb-1"></p>
                <div id="collapseExample"  class="collapse mb-1">
                <ul>
                    <li id="nome">
                        <b>Nome:</b>
                        <span id="nome">${nome}</span>
                    </li>
                    <li id="origem">
                        <b>Origem:</b>
                        <span id="origem">${origem}</span>
                    </li>
                    <li id="destino">
                        <b>Destino:</b>
                        <span id="destino">${destino}</span>
                    </li>
                    <li id="dias">
                        <b>Dias:</b>
                        <span id="dias">${dias}</span>
                    </li>
                    <li id="horario">
                        <b>Horário:</b>
                        <span id="horario">${horario}</span>
                    </li>
                </ul>
                </div>
            </a>
            </div>`;
            chatContainer.append(htmlMessage);
        });
    } else {
        let caronaStatus = "ERROR";
        if (caronaCurrent.status == "confirmada") {
            caronaStatus = `<small style="color: green;">Confirmada</small>`;
        } else if (caronaCurrent.status == "solicitacao") {
            caronaStatus = `<small style="color:red;">Pendente</small>`;
        }

        let nome = caronaCurrent.driver.nome;
        let origem = "";
        let destino = "";
        let dias = "";
        let horario = "";
        let trajetoID = caronaCurrent.trajetoID;
        getUserInfo(caronaCurrent.driver.id).done(function (data) {
            trajeto = data.trajetos.filter((trajeto) => {
                if (trajeto.id == trajetoID) {
                    return trajeto.start_point;
                }
            });
            origem = trajeto[0].start_point;
            destino = trajeto[0].destination;
            dias = trajeto[0].regularidade;
            horario = trajeto[0].hour;
            let htmlMessage = `<div  class="list-group mt-2">
                <a
                href="#"
                class="list-group-item list-group-item-action"
                aria-current="true"  class="container mt-0"
                >
                <div 
                class="d-flex w-100 justify-content-between"
                >
                <span id="butaoColapsa"  data-bs-toggle="collapse"
        href="#collapseExample"
        role="button"
        aria-expanded="false"
        aria-controls="collapseExample"><i class="bi bi-list"></i></span>
                <h5 class="mb-1">Minha Solicitação</h5>
                <small>${caronaStatus} </small>

                </div>
                <div id="collapseExample"  class="collapse mb-1">
                <ul>
                    <li id="nome">
                        <b>Nome:</b>
                        <span
                            id="nome"
                        >${nome}</span>
                    </li>
                    <li id="Origem">
                        <b>Origem:</b>
                        <span
                            id="Origem"
                        >${origem}</span>
                    </li>
                    <li id="Destino">
                        <b>Destino:</b>
                        <span id="Destino">${destino}</span>
                    </li>
                    <li id="Dias">
                        <b>Dias:</b>
                        <span id="Dias">${dias}</span>
                    </li>
                    <li id="Horário">
                        <b>Horário:</b>
                        <span id="Horário">${horario}</span>
                    </li>
                        </ul>
                    </div>
                </a>
                </div>`;
            chatContainer.append(htmlMessage);
        });
    }
    // Load the chat messages form box
    let messageBoxForm = `<form id="message-form" class="row g-3 align-items-center">
    <div class="col-12">
      <textarea type="text" class="form-control" id="textMessage" placeholder="Digite sua mensagem" aria-label="Message"></textarea>
    </div>
      <button id="btn-form" type="button" class="btn btn-success">Envie sua observação</button>
  </form>`;
    messageform.append(messageBoxForm);
    loadMessages(caronaCurrent, typeCurrentCarona);
}

function loadMessages(caronaCurrent, typeCurrentCarona) {
    let currentUser = JSON.parse(sessionStorage.getItem("usuarioCorrente"));
    let messages = caronaCurrent.mensagem;
    // Show messages on the chat box
    console.log(messages);
    console.log(typeCurrentCarona);
    let messageBox = $("#messages-box");
    messageBox.html("");
    messages.forEach((message) => {
        let currentmessage = $("<div></div>").addClass("alert");
        let formatTime = formatTimestamp(message.time);
        // Check if the message is from the current user
        if (message.sender == currentUser.id) {
            currentmessage.addClass("alert-info");
            currentmessage.role = 'alert';
            currentmessage.append( `<strong>Você:</strong> <span class="text-muted"  style="float: right;"> (${formatTime})</span> <br>${message.text}`)
            messageBox.append(currentmessage);
        } else if (message.sender == caronaCurrent.driver.id) {
            currentmessage.addClass("alert-dark");
            currentmessage.role = 'alert';
            currentmessage.append( `<strong>${caronaCurrent.driver.nome}:</strong> <span class="text-muted " style="float: right;"> (${formatTime})</span> <br>${message.text}`)
            messageBox.append(currentmessage);
        } else {
            currentmessage.addClass("alert-dark");
            currentmessage.role = 'alert';
            currentmessage.append( `<strong>${caronaCurrent.passenger.nome}:</strong> <span class="text-muted" style="float: right;"> (${formatTime})</span> <br>${message.text}`)
        }
    });


    // make the capacity of the chat box to send new messages written to json server
    $("#btn-form").off('click').on("click",function (event) {
        event.preventDefault();
        const newMessage = {
            sender: currentUser.id,
            text: $("#textMessage").val(),
            time: new Date().toISOString(),
            id: generateUUID(),
        }
        caronaCurrent.mensagem.push(newMessage);
        handleNewMessage(caronaCurrent).then(() => {
            alert("Mensagem enviada com sucesso");
        });
    });
}


// function handleNotRefreshSHOW_NEW_MESSAGE(dataId) {
//     // Using selector directly
//     var specificElement = $('#rides-list a[data-id="' + dataId + '"]');
//     specificElement.click()
//     // Do something with the filtered element
//     specificElement.css('color', 'red'); // Example: Change the text color to red
//     specificElement.addClass('highlighted'); // Example: Add a class
// }

async function handleNewMessage(caronaCurrent) {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: `${api}caronas/${caronaCurrent.id}/`,
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            data: JSON.stringify(caronaCurrent),
            success: function (data) {
                console.log(data);
            },
        }).then((data) => {resolve(data);})
    });
}

function getLoggedUserID() {
    let usuarioCorrenteJSON = sessionStorage.getItem("usuarioCorrente");
    let usuarioCorrente = JSON.parse(usuarioCorrenteJSON);
    let usuarioCorrenteID = usuarioCorrente.id;
    return usuarioCorrenteID;
}

async function getUserCaronas() {
    // Get the chat messages from the server and load them onto the chat container
    var caronasUsuario = [];
    fetch(`${api}caronas/`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    })
        .then((response) => response.json())
        .then((data) => {
            if (data.length > 0) {
                let usuarioCorrenteID = getLoggedUserID();
                caronasUsuario = data.filter(
                    (carona) =>
                        carona.driver.id === usuarioCorrenteID ||
                        carona.passenger.id === usuarioCorrenteID
                );
                localStorage.setItem(
                    "caronasUsuario",
                    JSON.stringify(caronasUsuario)
                );
                loadRides(caronasUsuario);
                return caronasUsuario;
            }
        })
        .catch((error) => {
            console.error("Error:", error);
            return 0;
        });
}

function getUserInfo(userID, trajetoCarona) {
    const url = `${api}users/${userID}`;
    return $.ajax({
        type: "GET",
        dataType: "json",
        url: url,
    });
}

function handleDriverAcceptRide(caronaCurrent) {
    return new Promise((resolve, reject) => {
        caronaCurrent.status = "confirmada";

        $.ajax({
            crossDomain: true,
            async: true,
            url: `${api}caronas/${caronaCurrent.id}/`,
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            processData: false,
            data: JSON.stringify(caronaCurrent),
        }).done(function (data) {
            let message = `Sua solicitação de carona para ${caronaCurrent.driver.nome} foi aceita`;
            let passengerUser = JSON.parse(
                localStorage.getItem("passengerUser")
            );
            let phone_number = passengerUser.telefone;
            sendChatMessage(message, phone_number);
            location.reload();
            // getUserCaronas();
            resolve(data);
        });
    });
}

function handleDriverRejectRide(caronaCurrent) {
    return new Promise((resolve, reject) => {
        $.ajax({
            method: "DELETE",
            type: "DELETE",
            url: `${api}caronas/${caronaCurrent.id}/`,
        }).done(function (data) {
            let message = `Sua solicitação de carona para ${caronaCurrent.driver.nome} foi rejeitada`;
            let passengerUser = JSON.parse(
                localStorage.getItem("passengerUser")
            );
            let phone_number = passengerUser.telefone;
            sendChatMessage(message, phone_number);
            // getUserCaronas()
            location.reload();
            resolve(data);
        });
    });
}

function DriverModal(caronaCurrent) {
    let modalTitle = `Solicitação de carona de ${caronaCurrent.passenger.nome}`;
    $("#modal-title").text(modalTitle);

    let passengerID = caronaCurrent.passenger.id;
    var trajetoCarona = caronaCurrent.trajetoID;
    let modalText = `Você deseja aceitar a solicitação a seguir ?`;
    getUserInfo(passengerID, trajetoCarona).done(function (data) {
        localStorage.setItem("passengerUser", JSON.stringify(data));
        $("#modal-text").text(modalText);
        $("#idade span").text(`${data.idade}`);
        $("#sexo span").text(`${data.sexo}`);
        $("#uni span").text(`${data.Universidade}`);
        $("#validation span").text(`${data.validadacaoInstitucional}`);
        getUserInfo(caronaCurrent.driver.id).done(function (response) {
            let trajeto = response.trajetos.filter((trajeto) => {
                console.log(trajeto.id, trajetoCarona);
                if (trajeto.id == trajetoCarona) {
                    return trajeto;
                }
            });
            console.log(trajeto);
            $("#origem span").text(`${trajeto[0].start_point}`);
            $("#destino span").text(`${trajeto[0].destination}`);
            $("#dias span").text(`${trajeto[0].regularidade}`);
            $("#horarios span").text(`${trajeto[0].hour}`);
        });
    });

    $("#modalClose")
        .off("click")
        .on("click", function () {
            let value = confirm(`Deseja aceitar a solicitação de carona?`);
            if (value) {
                handleDriverAcceptRide(caronaCurrent)
                    .then(() => {
                        $("#modal").modal("hide");
                        // getUserCaronas();
                        location.reload();
                    })
                    .catch((error) => {
                        // Handle the error here
                        console.log("Error in handleDriverAcceptRide: ", error);
                    });
            } else {
                handleDriverRejectRide(caronaCurrent)
                    .then(() => {
                        $("#modal").modal("hide");
                        // getUserCaronas();
                        location.reload();
                    })
                    .catch((error) => {
                        // Handle the error here
                        console.log("Error in handleDriverAcceptRide: ", error);
                    });
            }
        });

    $("#modal").modal("show");
}

function handlePassangerRequestRide(caronaCurrent) {
    return new Promise((resolve, reject) => {
        let message = {
            id: generateUUID(),
            type: "solicitacao",
            caronaID: caronaCurrent.id,
            enviadaNotificacao: true,
        };
        caronaCurrent.mensagem.push(message);
        $.ajax({
            crossDomain: true,
            async: true,
            url: `${api}caronas/${caronaCurrent.id}/`,
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            processData: false,
            data: JSON.stringify(caronaCurrent),
        }).done(function (data) {
            let driverUser = JSON.parse(localStorage.getItem("driverUser"));
            sendChatMessage(
                `Solicitação de carona de ${caronaCurrent.passenger.nome}`,
                driverUser.telefone
            );
            location.reload();
            // getUserCaronas()
            resolve(data);
        });
    });
}

function getCaronasSolicitacao() {
    console.log("Checking notifications");
    let caronasUsuario = JSON.parse(localStorage.getItem("caronasUsuario"));
    let caronasSolicitacao = caronasUsuario.filter(
        (carona) => carona.status == "solicitacao"
    );
    return caronasSolicitacao;
}

function checkNotifications(caronaCurrent) {
    let typeCurrentCarona = CaronaType(caronaCurrent);
    if (typeCurrentCarona && caronaCurrent.status == "solicitacao") {
        DriverModal(caronaCurrent);
    }
}
