document.addEventListener('DOMContentLoaded', () => {
    const cameraFeed = document.getElementById('camera-feed');
    const capturedImage = document.getElementById('captured-image');
    const captureBtn = document.getElementById('capture-btn');
    const rescanBtn = document.getElementById('rescan-btn');
    const canvas = document.getElementById('canvas');
    const resultsContainer = document.getElementById('results-container');
    const resultsTitle = document.getElementById('results-title');
    const birdInfoPanel = document.getElementById('bird-info');

    let stream = null;
    let model = null; // Variable para guardar el modelo de IA

    // --- 1. CARGAR EL MODELO DE IA ---
    async function loadModel() {
        console.log("Cargando modelo de IA...");
        try {
            // MobileNet es un modelo eficiente y potente para clasificación de imágenes
            model = await mobilenet.load();
            console.log("¡Modelo de IA cargado exitosamente!");
            captureBtn.textContent = 'Identificar Ave';
            captureBtn.disabled = false;
        } catch (err) {
            console.error("Error al cargar el modelo:", err);
            alert("No se pudo cargar la IA. Revisa tu conexión a internet.");
        }
    }

    // --- 2. INICIAR Y DETENER LA CÁMARA ---
    async function startCamera() {
        try {
            stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
            cameraFeed.srcObject = stream;
            cameraFeed.style.display = 'block';
            capturedImage.style.display = 'none';
            if (model) { // Solo habilita el botón si la IA ya cargó
                captureBtn.style.display = 'block';
            }
            rescanBtn.style.display = 'none';
            resultsContainer.style.display = 'none';
        } catch (err) {
            console.error("Error al acceder a la cámara:", err);
            alert('No se pudo acceder a la cámara. Asegúrate de dar los permisos y usar Live Server.');
        }
    }

    function stopCamera() {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
        }
    }

    // --- 3. LÓGICA DE CAPTURA Y ANÁLISIS REAL ---
    captureBtn.addEventListener('click', async () => {
        if (!model) {
            alert("La IA aún no ha cargado. Por favor espera.");
            return;
        }

        // Captura la imagen
        const context = canvas.getContext('2d');
        canvas.width = cameraFeed.videoWidth;
        canvas.height = cameraFeed.videoHeight;
        context.drawImage(cameraFeed, 0, 0, canvas.width, canvas.height);
        const imageDataUrl = canvas.toDataURL('image/jpeg');
        capturedImage.src = imageDataUrl;
        
        // Actualiza la UI
        capturedImage.style.display = 'block';
        stopCamera();
        cameraFeed.style.display = 'none';
        captureBtn.style.display = 'none';
        rescanBtn.style.display = 'block';
        resultsContainer.style.display = 'block';
        resultsTitle.textContent = 'Analizando con IA...';
        birdInfoPanel.innerHTML = '<div class="panel-body text-center"><p>Procesando la imagen...</p></div>';
        resultsContainer.scrollIntoView({ behavior: 'smooth' });

        // --- 4. EJECUCIÓN REAL DE LA IA ---
        // Aquí no hay simulación. Usamos el modelo cargado para clasificar la imagen del canvas.
        try {
            const predictions = await model.classify(canvas);
            console.log('Predicciones de la IA:', predictions);
            displayResults(predictions); // Muestra los resultados reales
        } catch (err) {
            console.error("Error durante la clasificación:", err);
            alert("Ocurrió un error al analizar la imagen.");
        }
    });

    // --- 5. LÓGICA PARA VOLVER A ESCANEAR ---
    rescanBtn.addEventListener('click', () => {
        startCamera();
    });

    // --- 6. MOSTRAR LOS RESULTADOS REALES ---
    function displayResults(predictions) {
        if (predictions && predictions.length > 0) {
            // Tomamos la predicción más probable (la primera)
            const bestPrediction = predictions[0];
            const probability = (bestPrediction.probability * 100).toFixed(2); // Convertir a porcentaje
            
            // Capitalizamos el nombre del ave
            const birdName = bestPrediction.className.split(',')[0].replace(/^\w/, c => c.toUpperCase());
            
            resultsTitle.textContent = 'Resultados del Análisis';
            const content = `
                <div class="panel-heading">
                    <h3 class="panel-title">Mejor resultado: ${birdName}</h3>
                </div>
                <div class="panel-body">
                    <p><strong>Probabilidad:</strong> ${probability}%</p>
                    <p>La IA ha identificado la imagen con la clasificación anterior. Puedes buscar más información sobre esta ave en nuestra sección "Aves".</p>
                    <hr>
                    <h4>Otras posibilidades:</h4>
                    <ul class="list-group">
                        ${predictions.slice(1).map(p => `<li class="list-group-item">${p.className.split(',')[0]}</li>`).join('')}
                    </ul>
                </div>
            `;
            birdInfoPanel.innerHTML = content;
        } else {
            resultsTitle.textContent = 'No se pudo identificar';
            birdInfoPanel.innerHTML = '<div class="panel-body"><p>La IA no pudo reconocer un ave en la imagen. Por favor, intenta de nuevo con una foto más clara.</p></div>';
        }
    }

    // --- Iniciar todo ---
    startCamera();
    loadModel();
});