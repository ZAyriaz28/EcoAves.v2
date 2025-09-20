document.addEventListener('DOMContentLoaded', () => {

    // --- SELECCIÓN DE ELEMENTOS ---
    const botonOrdenar = document.getElementById('botonOrdenar');
    const contenedorAves = document.querySelector('.aves-cards-row');
    const campoBusqueda = document.getElementById('campoBusqueda'); // Nuevo
    const mensajeNoResultados = document.getElementById('mensaje-no-resultados'); // Nuevo

    // --- LÓGICA PARA ORDENAR ALFABÉTICAMENTE ---
    botonOrdenar.addEventListener('click', () => {
        contenedorAves.classList.add('fade-out');
        setTimeout(() => {
            const fichas = Array.from(contenedorAves.querySelectorAll('.col-sm-6.col-md-4'));
            fichas.sort((fichaA, fichaB) => {
                const nombreA = fichaA.querySelector('.aves-card-title').innerText.trim();
                const nombreB = fichaB.querySelector('.aves-card-title').innerText.trim();
                return nombreA.localeCompare(nombreB);
            });
            fichas.forEach(ficha => {
                contenedorAves.appendChild(ficha);
            });
            contenedorAves.classList.remove('fade-out');
        }, 300);
    });

    // --- NUEVA LÓGICA PARA LA BÚSQUEDA EN TIEMPO REAL ---
    campoBusqueda.addEventListener('input', () => {
        // 1. Obtiene el texto del campo de búsqueda y lo convierte a minúsculas para que la búsqueda no distinga mayúsculas/minúsculas.
        const terminoBusqueda = campoBusqueda.value.toLowerCase().trim();
        
        // 2. Selecciona todas las fichas de aves.
        const todasLasFichas = contenedorAves.querySelectorAll('.col-sm-6.col-md-4');
        
        let avesVisibles = 0;

        // 3. Recorre cada una de las fichas para decidir si mostrarla u ocultarla.
        todasLasFichas.forEach(ficha => {
            // Obtiene el nombre del ave de la ficha actual y también lo convierte a minúsculas.
            const nombreAve = ficha.querySelector('.aves-card-title').innerText.toLowerCase();

            // 4. Comprueba si el nombre del ave incluye el texto que el usuario escribió.
            if (nombreAve.includes(terminoBusqueda)) {
                // Si coincide, se asegura de que la ficha esté visible.
                ficha.style.display = 'block';
                avesVisibles++; // Incrementa el contador de aves visibles
            } else {
                // Si no coincide, oculta la ficha.
                ficha.style.display = 'none';
            }
        });
        
        // 5. Muestra u oculta el mensaje de "no resultados".
        if (avesVisibles === 0) {
            mensajeNoResultados.style.display = 'block'; // Muestra el mensaje
        } else {
            mensajeNoResultados.style.display = 'none'; // Oculta el mensaje
        }
    });

});