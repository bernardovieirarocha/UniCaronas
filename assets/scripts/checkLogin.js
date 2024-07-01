// Verificar se o usuário está logado
$(document).ready(function() {

    const userToken = sessionStorage.getItem('usuarioCorrente');

    if (!userToken) {
        redirectToLogin();
    } else {
        console.log('User is logged in');
    }
});

function redirectToLogin() {
    window.location.href = 'login.html'; // substitua por sua página de login
}

