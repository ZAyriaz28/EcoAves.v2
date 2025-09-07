document.querySelector('.form').addEventListener('submit', function (e) {
    e.preventDefault(); // Evita el envío real del formulario
    window.location.href = 'inicio.html'; // Redirige a la página principal
});
