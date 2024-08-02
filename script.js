document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    const contactList = document.getElementById('contactList');
    const photoInput = document.getElementById('photo');
    const imagePreview = document.getElementById('imagePreview');
    const imagePreviewImage = imagePreview.querySelector('.image-preview__image');
    const imagePreviewDefaultText = imagePreview.querySelector('.image-preview__default-text');
    let contacts = [];

    photoInput.addEventListener('change', function() {
        const file = this.files[0];

        if (file) {
            const reader = new FileReader();

            imagePreviewDefaultText.style.display = "none";
            imagePreviewImage.style.display = "block";

            reader.addEventListener('load', function() {
                imagePreviewImage.setAttribute('src', this.result);
            });

            reader.readAsDataURL(file);
        } else {
            imagePreviewDefaultText.style.display = "block";
            imagePreviewImage.style.display = "none";
        }
    });

    contactForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;
        const photoSrc = imagePreviewImage.getAttribute('src');

        const contact = {
            name: name,
            email: email,
            phone: phone,
            photo: photoSrc
        };

        contacts.push(contact);
        updateContactList();
        contactForm.reset();
        imagePreviewDefaultText.style.display = "block";
        imagePreviewImage.style.display = "none";
    });

    function updateContactList() {
        contactList.innerHTML = '';
        contacts.forEach(function(contact, index) {
            const listItem = document.createElement('li');

            const photo = document.createElement('img');
            photo.src = contact.photo || 'placeholder.png';
            photo.alt = 'Foto do Contato';

            const contactInfo = document.createElement('span');
            contactInfo.textContent = `Nome: ${contact.name}, Email: ${contact.email}, Telefone: ${contact.phone}`;

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Remover';
            deleteButton.addEventListener('click', function() {
                contacts.splice(index, 1);
                updateContactList();
            });

            listItem.appendChild(photo);
            listItem.appendChild(contactInfo);
            listItem.appendChild(deleteButton);

            contactList.appendChild(listItem);
        });
    }
});
