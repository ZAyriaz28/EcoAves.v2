document.getElementById('loginForm').addEventListener('submit', function(e) {
  e.preventDefault();

  const email = document.querySelector('#loginForm input[type="email"]').value.trim();
  const password = document.querySelector('#loginForm input[type="password"]').value.trim();

  if (email === '' || password === '') {
    Swal.fire({
      icon: 'warning',
      title: 'Campos vacíos',
      text: 'Por favor ingresa tu correo y contraseña.',
      width: 300 // Tamaño más pequeño
    });
    return;
  }

  Swal.fire({
    icon: 'success',
    title: 'Usuario creado',
    showConfirmButton: false,
    timer: 1500,
    width: 300 // Tamaño más pequeño
  }).then(() => {
    window.location.href = 'inicio.html';
  });
});