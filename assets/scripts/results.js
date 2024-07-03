document.addEventListener('DOMContentLoaded', () => {
    const users = [
        {
            name: "João Silva",
            location: "Bairro Coração Eucarístico, Universidade Puc Praça da Liberdade",
            photo: "https://randomuser.me/api/portraits/men/32.jpg",
            bio: "Disponível as 6:00.",
            profileUrl: "https://example.com/perfil/joao"
        },
        {
            name: "Maria Oliveira",
            location: "Bairro Savassi, Universidade Puc Coração Eucarístico",
            photo: "https://randomuser.me/api/portraits/women/44.jpg",
            bio: "Disponível as 8:00.",
            profileUrl: "https://example.com/perfil/maria"
        },
        {
            name: "Carlos Santos",
            location: "Bairro Pampulha, Universidade Federal UFMG",
            photo: "https://randomuser.me/api/portraits/men/45.jpg",
            bio: "Disponível as 19:00.",
            profileUrl: "https://example.com/perfil/carlos"
        },
        {
            name: "Ana Costa",
            location: "Bairro Castelo, Universidade Ibmec",
            photo: "https://randomuser.me/api/portraits/women/50.jpg",
            bio: "Disponível as 13:00.",
            profileUrl: "https://example.com/perfil/ana"
        }
    ];

    const container = document.getElementById('user-cards');

    users.forEach(user => {
        const card = document.createElement('div');
        card.classList.add('card');

        card.innerHTML = `
            <img src="${user.photo}" alt="${user.name}">
            <h2>${user.name}</h2>
            <p>${user.location}</p>
            <p>${user.bio}</p>
            <a href="${user.profileUrl}" target="_blank"><button>Ver Perfil</button></a>
        `;

        container.appendChild(card);
    });
});