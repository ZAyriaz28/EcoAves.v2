document.addEventListener('DOMContentLoaded', async () => {
    const cameraFeed = document.getElementById('camera-feed');
    const captureBtn = document.getElementById('capture-btn');
    const canvas = document.getElementById('canvas');
    const resultsContainer = document.getElementById('results-container');
    const birdName = document.getElementById('bird-name');
    const scientificName = document.getElementById('scientific-name');
    const birdDescription = document.getElementById('bird-description');
    const birdImage = document.getElementById('bird-image');

    let model = null;
    let avesData = null;

    // --- 1. Cargar el modelo de IA y los datos de las aves ---
    async function loadResources() {
        try {
            captureBtn.textContent = 'Cargando IA...';
            captureBtn.disabled = true;
            model = await mobilenet.load(); // Carga el modelo de IA
            const response = await fetch('aves_data.json'); // Carga nuestro "diccionario" de aves
            avesData = await response.json();
            captureBtn.textContent = 'Capturar y Identificar';
            captureBtn.disabled = false;
            console.log("Modelo y datos cargados exitosamente.");
        } catch (err) {
            console.error("Error al cargar los recursos:", err);
            alert("No se pudo cargar el modelo de IA. Revisa la conexión a internet.");
        }
    }

    // --- 2. Iniciar la cámara ---
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
            .then(stream => {
                cameraFeed.srcObject = stream;
                cameraFeed.play();
            })
            .catch(err => {
                console.error("Error al acceder a la cámara: ", err);
                alert('No se pudo acceder a la cámara. Asegúrate de dar los permisos necesarios.');
            });
    }

    // --- 3. Capturar imagen y predecir ---
    captureBtn.addEventListener('click', async () => {
        if (!model) {
            alert("El modelo de IA no ha terminado de cargar. Por favor, espera.");
            return;
        }

        // Dibujar el frame del video en el canvas
        const context = canvas.getContext('2d');
        canvas.width = cameraFeed.videoWidth;
        canvas.height = cameraFeed.videoHeight;
        context.drawImage(cameraFeed, 0, 0, canvas.width, canvas.height);

        captureBtn.textContent = 'Analizando...';
        captureBtn.disabled = true;

        // Realizar la predicción con el modelo
        const predictions = await model.classify(canvas);
        console.log('Predicciones:', predictions);

        // Buscar la mejor predicción en nuestra base de datos
        let aveEncontrada = null;
        for (const prediction of predictions) {
            // El nombre de la clase puede tener sinónimos, ej: "rock dove, rock pigeon"
            const posiblesNombres = prediction.className.split(', ').map(name => name.toLowerCase());
            for (const nombre of posiblesNombres) {
                if (avesData[nombre]) {
                    aveEncontrada = avesData[nombre];
                    break;
                }
            }
            if (aveEncontrada) break;
        }

        if (aveEncontrada) {
            displayResults(aveEncontrada);
        } else {
            // Si no se encuentra en nuestra base de datos, mostramos la mejor predicción del modelo
            const mejorPrediccion = predictions[0].className;
            displayNotFound(mejorPrediccion);
        }

        captureBtn.textContent = 'Capturar y Identificar';
        captureBtn.disabled = false;
    });

    // --- 4. Mostrar los resultados ---
    function displayResults(data) {
        birdName.textContent = data.nombre_comun;
        scientificName.textContent = data.nombre_cientifico;
        birdDescription.textContent = data.descripcion;
        birdImage.src = data.imagen_referencia;
        birdImage.style.display = 'block';
        resultsContainer.style.display = 'block';
        resultsContainer.scrollIntoView({ behavior: 'smooth' });
    }

    function displayNotFound(predictionName) {
        birdName.textContent = "Ave no encontrada en la base de datos";
        scientificName.textContent = `La IA sugiere: ${predictionName}`;
        birdDescription.textContent = "No tenemos información detallada para esta ave, pero puedes buscarla en nuestra sección de Aves. ¡Añadiremos más especies pronto!";
        birdImage.style.display = 'none'; // Ocultamos la imagen si no hay info
        resultsContainer.style.display = 'block';
        resultsContainer.scrollIntoView({ behavior: 'smooth' });
    }

    // Iniciar la carga al entrar a la página
    loadResources();
});