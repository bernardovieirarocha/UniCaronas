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

$(document).ready(function () {
    $("#formCadastro").submit(function (event) {
        event.preventDefault(); // Prevent default form submission

        // Collect form data
        var nomeCompleto = $("#nomeCompleto").val();
        var idade = $("#idade").val();
        var estado = $("#estado").val();
        var cidade = $("#cidade").val();
        var bairro = $("#bairro").val();
        var cep = $("#cep").val();
        var universidade = $("#universidade").val();
        var tipoUsuario = $("input[name='tipoUsuario']:checked").val();
        var username = $("#username").val();
        var password = $("#password").val();
        var emailCadastro = $("#emailCadastro").val();
        var emailInst = $("#emailInstitu").val();
        var sexo = $("#sexo").find(":selected").text();
        var telefone = $("#telefone").val();

        tagsTipo = [];
        if (tipoUsuario == 1) {
            tagsTipo.push("passenger");
        } else if (tipoUsuario == 2) {
            tagsTipo.push("driver");
        } else {
            tagsTipo.push("passenger");
            tagsTipo.push("driver");
        }

        let dataUser = {
            id: generateUUID(),
            login: username,
            senha: password,
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
                marca: "",
                modelo: "",
                cor: "",
                placa: "",
            },
            trajetos: [],
            tipo: tagsTipo,
        };
        console.log(dataUser);
    });
});
