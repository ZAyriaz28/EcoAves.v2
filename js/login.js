document.querySelector('.form').addEventListener('submit', function (e) {
    e.preventDefault(); // Evita el envío real del formulario
    window.location.href = 'index.html'; // Redirige a la página principal
});
