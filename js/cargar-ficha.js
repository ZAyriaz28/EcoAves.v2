// Espera a que la página se cargue
document.addEventListener('DOMContentLoaded', () => {
    // Crea un objeto para buscar parámetros en la URL (ej: ?id=5)
    const params = new URLSearchParams(window.location.search);
    // Obtiene el valor del parámetro 'id'
    const aveId = params.get('id');

    // Si encontramos un ID en la URL...
    if (aveId) {
        // ...hacemos una petición a nuestra API para obtener los datos de esa ave específica
        fetch(`http://127.0.0.1:5000/api/ave/${aveId}`)
            .then(response => response.json()) // Convierte la respuesta a JSON
            .then(ave => {
                // Si el servidor devuelve un error, lo mostramos
                if (ave.error) {
                    document.getElementById('nombre-comun').textContent = 'Ave no encontrada';
                    return;
                }

                // Actualizamos todos los elementos del HTML con los datos del ave
                document.title = ave.nombre_comun; // Actualiza el título de la pestaña del navegador
                document.getElementById('nombre-comun').textContent = ave.nombre_comun;
                document.getElementById('imagen-ave').src = ave.ruta_imagen;
                document.getElementById('imagen-ave').alt = ave.nombre_comun;
                document.getElementById('descripcion-ave').textContent = ave.descripcion;
                document.getElementById('mapa-ave').src = ave.ruta_mapa;

                // Llenar la lista de taxonomía
                const listaTaxonomia = document.getElementById('lista-taxonomia');
                listaTaxonomia.innerHTML = `
                    <li><strong>Reino:</strong> ${ave.reino}</li>
                    <li><strong>Filo:</strong> ${ave.filo}</li>
                    <li><strong>Clase:</strong> ${ave.clase}</li>
                    <li><strong>Orden:</strong> ${ave.orden}</li>
                    <li><strong>Familia:</strong> ${ave.familia}</li>
                    <li><strong>Género:</strong> ${ave.genero}</li>
                    <li><strong>Especie:</strong> ${ave.nombre_cientifico}</li>
                `;

                // Llenar las estadísticas (si tienes los IDs puestos)
                // document.getElementById('tamano-poblacion').textContent = ave.tamano_poblacion;
                // ...etcétera para las demás estadísticas.
            })
            .catch(error => {
                console.error('Error al cargar la ficha del ave:', error);
                document.getElementById('nombre-comun').textContent = 'Error de conexión';
            });
    } else {
        // Si no hay ID en la URL, muestra un mensaje de error.
        document.getElementById('nombre-comun').textContent = 'No se ha especificado un ave.';
    }
});