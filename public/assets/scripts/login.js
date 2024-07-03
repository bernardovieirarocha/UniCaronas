const loginapi = "http://localhost:3000";

function loginUser(username, password) {
    $.ajax({
        url: `${loginapi}/user-login`,
        type: "POST",
        data: JSON.stringify({
            username: username,
            password: password,
        }),
        contentType: "application/json",
        success: function (response) {
            console.log("Login efetuado com sucesso");
            const user = {
                username: response.username,
                id: response.token,
                nome: response.nome,
                email: response.email,
            };
            sessionStorage.setItem("usuarioCorrente", JSON.stringify(user));
            window.location.href = "index.html";
        },
        error: function (error) {
            console.error("Erro ao fazer login:", error);
            showLoginAlert();
        },
    });
}

var alertTimeout;

function showLoginAlert() {
    $("#loginAlert").show();

    clearInterval(alertTimeout);

    alertTimeout = setInterval(hideLoginAlert, 9000);
}

function hideLoginAlert() {
    $("#loginAlert").hide();
}

$("#loginForm").submit(function (event) {
    event.preventDefault();

    var username = $("#username").val();
    var password = $("#password").val();

    loginUser(username, password);
});

function logout() {
    sessionStorage.removeItem("usuarioCorrente");
    window.location.href = "login.html";
}
