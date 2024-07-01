const api = "http://localhost:3000/api";

const cadastroAPI = "http://localhost:3000/user-register";


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


let bairroChoices = new Choices("#bairro", {
    searchEnabled: true,
    removeItemButton: true,
    allowHTML: true,
});
let universidadeChoices = new Choices("#choicesUniversidade", {
    searchEnabled: true,
    removeItemButton: true,
    allowHTML: true,
});

$(document).ready(function () {
    fetchNeighborhoods();
    fetchUniversities();
});

function fetchNeighborhoods() {

    const settings = {
        async: true,
        url: `${api}/bairros/`,
        method: "GET",
    };

    $.ajax(settings).done(function (response) {
        populateDropdownNeighborhoods(bairroChoices, response.result, "name");
    });
}

function fetchUniversities() {

    $.ajax({
        url: `${api}/universidades/`,
        type: "GET",
        contentType: "application/json",
    }).done(function (response) {
        populateDropdown(universidadeChoices, response, "nome");
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

function toggleCarDetails() {
    var tipoUsuario = $("input[name='tipoUsuario']:checked").val();
    if (tipoUsuario == "2" || tipoUsuario == "3") {
        $("#carDetails").show();
        $("#carMarca").attr("required", true);
        $("#carModelo").attr("required", true);
        $("#carCor").attr("required", true);
        $("#carPlaca").attr("required", true);
    } else {
        $("#carDetails").hide();
        $("#carMarca").removeAttr("required");
        $("#carModelo").removeAttr("required");
        $("#carCor").removeAttr("required");
        $("#carPlaca").removeAttr("required");
    }
}


$(document).ready(function () {
    $("#formCadastro").submit(function (event) {
        event.preventDefault(); // Prevent default form submission

        // Collect form data
        var nomeCompleto = $("#nomeCompleto").val();
        var idade = $("#idade").val();
        var cidade = $("#cidade").val();
        var bairro = $("#bairro").val();
        var cep = $("#cep").val();
        var universidade = $("#choicesUniversidade").val();
        var tipoUsuario = $("input[name='tipoUsuario']:checked").val();
        var username = $("#username").val();
        var password = $("#password").val();
        var emailCadastro = $("#emailCadastro").val();
        var emailInst = $("#emailInstitu").val();
        var sexo = $("#sexo").find(":selected").text();
        var telefone = $("#telefone").val();

           // Collect car details if applicable
           var carMarca = $("#carMarca").val();
           var carModelo = $("#carModelo").val();
           var carCor = $("#carCor").val();
           var carPlaca = $("#carPlaca").val();


        tagsTipo = [];
        if (tipoUsuario == 1) {
            tagsTipo.push("passenger");
        } else if (tipoUsuario == 2) {
            tagsTipo.push("driver");
        } else {
            tagsTipo.push("passenger");
            tagsTipo.push("driver");
        }

        console.log(universidade)
        console.log(bairro)

        let dataUser = {
            username: username,
            password: password,
            nome: nomeCompleto,
            email: emailCadastro,
            idade: idade,
            cidade: cidade,
            bairro: bairro,
            CEP: cep,
            universidade: universidade,
            validadacaoInstitucional: emailInst != "" ? true : false,
            sexo: sexo,
            telefone: telefone,
            carro: {
                marca: carMarca,
                modelo: carModelo,
                cor: carCor,
                placa: carPlaca,
            },
            trajetos: [],
            tipo: tagsTipo,
        };


         // Remove car details if the user is not a driver
         if (tipoUsuario == 1) {
            delete dataUser.carro;
        }

        // $.ajax({
        //     url: `${cadastroAPI}`,
        //     type: "POST",
        //     contentType: "application/json",
        //     data: JSON.stringify(dataUser),
        // }).done(function (response) {
        //     if (response.status == 'success') {
        //         alert("Cadastro realizado com sucesso!");
        //         window.location.href = "login.html";
        //     }
        // })
        console.log(dataUser);
    });
});
