document.getElementById('loginForm').addEventListener('submit', function(e) {
  e.preventDefault();
  window.location.href = 'inicio.html';
});

document.getElementById('loginForm').addEventListener('submit', function(e) {
  e.preventDefault();
  alert('Usuario creado'); // Notificación para PC y móviles
  window.location.href = 'inicio.html';
});