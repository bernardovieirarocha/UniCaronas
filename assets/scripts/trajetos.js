const mulheresImagens = ["pessoa1.jpg", "pessoa2.jpg", "pessoa3.jpg"];
const homensImagens = ["pessoa4.jpg", "pessoa5.jpg"];

const api = "http://localhost:3000/api";
const trajetosAPI = "http://localhost:3000/trajetos";

const daysFilter = new Choices("#daysFilter", {
    removeItemButton: true,
    maxItemCount: 7,
    searchEnabled: false,
    placeholder: true,
    placeholderValue: "Selecione os Dias",
    allowHTML: true,
});

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

function showLoadingSpinner() {
    $("#loadingSpinner").show();
}

function hideLoadingSpinner() {
    $("#loadingSpinner").hide();
}

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
});

function getLoggedUserID() {
    let usuarioCorrenteJSON = sessionStorage.getItem("usuarioCorrente");
    let usuarioCorrente = JSON.parse(usuarioCorrenteJSON);
    return usuarioCorrente.id;
}

let ID = getLoggedUserID();

if (!ID) {
    // Redirect to login page if user is not logged in
    window.location.href = "login.html";
}

function loadUserProfile() {
    fetch(`${api}/users/${ID}`)
        .then((response) => response.json())
        .then((user) => {
            $("#username").text(user.nome || "Usuário");
            $("#idade").html(`<strong>Idade:</strong> ${user.idade}`);
            $("#telefone").html(`<strong>Telefone:</strong> ${user.telefone}`);
            if (user.carro != null && user.tipo.includes("driver")) {
                $("#carro").html(
                    `<strong>Carro</strong>: ${user.carro.marca} ${user.carro.modelo} (${user.carro.cor})`
                );
            } else {
                $("#carro").next("br").remove();
            }
            $("#universidade").html(
                `<strong>Universidade:</strong> ${user.universidade}`
            );
            $("#bio").text(user.bio || "Sem biografia disponível");
            $("#profile_pic").attr(
                "src",
                user.sexo === "masculino"
                    ? "./assets/img/imgprofile/" +
                          homensImagens[
                              Math.floor(Math.random() * homensImagens.length)
                          ]
                    : "./assets/img/imgprofile/" +
                          mulheresImagens[
                              Math.floor(Math.random() * mulheresImagens.length)
                          ]
            );
            $("#avaliacao").html(
                `${user.notaAvaliacao.media}  <i class="bi bi-star-fill"></i>`
            );
            if (user.validadacaoInstitucional == true) {
                $("#validacaoInstitucional").html(
                    `<strong>Validação Institucional: </strong>  <i style="color:green;" class="bi bi-check-circle-fill"></i>`
                );
            } else {
                $("#validacaoInstitucional").html(
                    `<strong>Validação Institucional: </strong> <i style="color:red;" class="bi bi-x-circle-fill"></i>`
                );
            }
        })
        .catch((error) => console.error("Erro ao buscar usuário:", error));
}

document.addEventListener("DOMContentLoaded", function () {
    loadUserProfile();
    fetchTrajetos(); // Carrega os trajetos ao inicializar a página

    setupAddNewTrajeto();
});

function setupAddNewTrajeto() {
    var addButton = document.getElementById("addTrajetoButton");
    if (addButton) {
        addButton.addEventListener("click", function () {
            clearModalInputs();
            document.getElementById("saveTrajeto").onclick = addNewTrajeto;
        });
    } else {
        console.error("Botão 'Adicionar Trajeto' não encontrado.");
    }
}

function clearModalInputs() {
    document.getElementById("startingPointDropdown").value = "";
    document.getElementById("destinationDropdown").value = "";
    document.getElementById("horario").value = "";
    $("#daysFilter").val("");
    daysFilter.removeActiveItems();
    startingPointChoices.removeActiveItems();
    destinationChoices.removeActiveItems();
}

function fetchTrajetos() {
    fetch(`${trajetosAPI}?id=${ID}`, {
        mehtod: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    })
        .then((response) => response.json())
        .then((data) => {
            if (data.length > 0) {
                const tabela = document.getElementById("trajetoData");
                tabela.innerHTML = ""; // Limpa a tabela antes de adicionar novos trajetos
                data.forEach((trajeto) => {
                    let diasSemanas = "";
                    trajeto.regularidade.forEach((diaSemana) => {
                        diasSemanas += `<li>${diaSemana}</li>`;
                    });
                    const linha = `
              <tr>
                  <td>${trajeto.start_point}</td>
                  <td>${trajeto.destination}</td>
                  <td>${trajeto.hour}</td>
                  <td><ul>${diasSemanas}</ul></td>
                  <td>
                      <button class="btn btn-info" onclick="editTrajeto('${trajeto.id}')">Editar</button>
                      <button class="btn btn-danger" onclick="deleteTrajeto('${trajeto.id}')">Deletar</button>
                  </td>
              </tr>`;
                    tabela.innerHTML += linha;
                });
            } else {
                // No trajetos to show
                const tabela = document.getElementById("trajetoData");
                tabela.innerHTML = ""; // Limpa a tabela antes de adicionar novos trajetos
                tabela.innerHTML += `<tr><td colspan="5">Sem trajetos cadastrados.</td></tr>`;
            }
        })
        .catch((error) => console.error("Erro ao buscar trajetos:", error));
}

function addNewTrajeto() {
    console.log("Adicionando novo trajeto...");
    const trajeto = getTrajetoDataFromModal();

    if (!trajeto.start_point || !trajeto.destination || !trajeto.hour) {
        alert("Preencha todos os campos obrigatórios!");
        return;
    }

    fetch(`${trajetosAPI}?id=${ID}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(trajeto),
    })
        .then((response) => response.json())
        .then(() => {
            clearModalInputs();
            $("#trajetoModal").modal("hide");
            fetchTrajetos(); // Atualiza a tabela
        });
}

function editTrajeto(traj_id) {
    clearModalInputs()
    fetch(`${trajetosAPI}?id=${ID}&trajetoID=${traj_id}`)
        .then((response) => response.json())
        .then((data) => {
            fillModalWithData(data);
            document.getElementById("saveTrajeto").onclick = function () {
                updateTrajeto(traj_id);
            };
            $("#trajetoModal").modal("show");
        });
}
function fillModalWithData(data) {
    startingPointChoices.setChoiceByValue(data.start_point);
    destinationChoices.setChoiceByValue(data.destination);
    document.getElementById("horario").value = data.hour;
    daysFilter.setChoiceByValue(data.regularidade);
}

function updateTrajeto(traj_id) {
    const trajeto = getTrajetoDataFromModal();
    fetch(`${trajetosAPI}?id=${ID}&trajetoID=${traj_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(trajeto),
    })
        .then((response) => response.json())
        .then(() => {
            clearModalInputs();
            $("#trajetoModal").modal("hide");
            fetchTrajetos(); // Atualiza a tabela
        });
}

function deleteTrajeto(traj_id) {
    fetch(`${trajetosAPI}?id=${ID}&trajetoID=${traj_id}`, {
        method: "DELETE",
    }).then(() => {
        fetchTrajetos(); // Atualiza a tabela após deletar o trajeto
    });
}

function getTrajetoDataFromModal() {
    const daysFilter = $("#daysFilter").val();
    const horario = document.getElementById("horario").value;

    const trajeto = {
        id: generateUUID(),
        start_point: document.getElementById("startingPointDropdown").value,
        destination: document.getElementById("destinationDropdown").value,
        hour: horario,
        regularidade: daysFilter,
    };

    return trajeto;
}
