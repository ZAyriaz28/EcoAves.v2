/**
 * @file escanear.js
 * @description Script final y optimizado para la identificación de aves de Nicaragua,
 * utilizando un diccionario local para máxima precisión.
 * @author Asistente de Programación
 * @version 4.0 (Experto Regional)
 */
document.addEventListener('DOMContentLoaded', () => {

    // --- 1. SELECCIÓN DE ELEMENTOS DEL DOM ---
    const elements = {
        initialSection: document.getElementById('initial-section'),
        previewSection: document.getElementById('preview-section'),
        cameraFeed: document.getElementById('camera-feed'),
        captureBtn: document.getElementById('capture-btn'),
        imageUploadInput: document.getElementById('image-upload-input'),
        previewImage: document.getElementById('preview-image'),
        analyzeBtn: document.getElementById('analyze-btn'),
        rescanBtn: document.getElementById('rescan-btn'),
        canvas: document.getElementById('canvas'),
        resultsContainer: document.getElementById('results-container'),
        resultsTitle: document.getElementById('results-title'),
        birdInfoPanel: document.getElementById('bird-info')
    };

    // --- 2. ESTADO DE LA APLICACIÓN ---
    let stream = null;
    let model = null;
    let nicaraguanBirdsDictionary = []; // Nuestro diccionario de sinónimos.
    let fullBirdData = []; // Los datos completos de las fichas.

    // --- 3. FUNCIONES DE INICIALIZACIÓN ---

    async function initializeApp() {
        console.log("Inicializando aplicación: modo experto en aves de Nicaragua.");
        try {
            const modelPromise = mobilenet.load();
            const dictionaryPromise = fetch('aves_nicaragua.json').then(res => res.json());
            const birdDataPromise = fetchFullBirdData();

            [model, { aves }, fullBirdData] = await Promise.all([modelPromise, dictionaryPromise, birdDataPromise]);
            nicaraguanBirdsDictionary = aves;

            console.log("¡Éxito! Modelo de IA, diccionario y datos de fichas cargados.");
            elements.captureBtn.textContent = 'Tomar Foto';
            elements.captureBtn.disabled = false;
            startCamera();

        } catch (error) {
            console.error("Error crítico durante la inicialización:", error);
            elements.captureBtn.textContent = 'Error al Cargar IA';
            elements.captureBtn.classList.add('btn-danger');
            alert("No se pudieron cargar los recursos. Revisa la consola y asegúrate que el archivo 'aves_nicaragua.json' existe.");
        }
    }

    async function fetchFullBirdData() {
        const response = await fetch('Ficha-Aves.html');
        if (!response.ok) throw new Error('No se pudo encontrar Ficha-Aves.html');
        const htmlText = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlText, 'text/html');
        
        const data = [];
        doc.querySelectorAll('.aves-card').forEach(card => {
            const title = card.querySelector('.aves-card-title')?.textContent.trim().toLowerCase();
            const link = card.closest('a')?.getAttribute('href');
            const image = card.querySelector('.aves-card-img')?.getAttribute('src');
            if (title && link && image) {
                data.push({ name: title, link, image });
            }
        });
        return data;
    }

    // --- 4. LÓGICA DE ANÁLISIS ---

    async function analyzeImage() {
        if (!model) return alert("El modelo de IA no está listo.");
        
        updateUIForAnalysis();

        try {
            const predictions = await model.classify(elements.previewImage);
            console.log('Predicciones generales de la IA:', predictions);
            
            const localMatch = findNicaraguanBird(predictions);
            displayResults(predictions, localMatch);

        } catch (error) {
            console.error("Error durante la clasificación:", error);
            displayError("Ocurrió un error al analizar la imagen.");
        }
    }

    function findNicaraguanBird(predictions) {
        for (const prediction of predictions) {
            const predictionTerms = prediction.className.toLowerCase().replace(/,/g, '').split(' ');
            
            for (const birdFromDict of nicaraguanBirdsDictionary) {
                if (predictionTerms.some(term => birdFromDict.keywords.includes(term))) {
                    const matchedBirdData = fullBirdData.find(b => b.name === birdFromDict.nombreLocal);
                    if (matchedBirdData) {
                        console.log(`¡COINCIDENCIA! IA predijo "${prediction.className}", que coincide con "${matchedBirdData.name}" vía diccionario.`);
                        return matchedBirdData;
                    }
                }
            }
        }
        console.log("No se encontraron coincidencias en el diccionario de Nicaragua.");
        return null;
    }

    // --- 5. FUNCIONES DE UI Y FLUJO ---
    
    function updateUIForAnalysis() {
        elements.analyzeBtn.disabled = true;
        elements.analyzeBtn.textContent = 'Analizando...';
        elements.resultsContainer.style.display = 'block';
        elements.resultsTitle.textContent = 'Procesando con IA Regional...';
        elements.birdInfoPanel.innerHTML = '<div class="panel-body text-center"><span class="glyphicon glyphicon-leaf"></span> Buscando en el catálogo de aves de Nicaragua...</div>';
        elements.resultsContainer.scrollIntoView({ behavior: 'smooth' });
    }

    function showPreview(imageSrc) {
        elements.previewImage.src = imageSrc;
        stopCamera();
        elements.initialSection.style.display = 'none';
        elements.previewSection.style.display = 'block';
        elements.resultsContainer.style.display = 'none';
    }

    function resetInterface() {
        startCamera();
        elements.initialSection.style.display = 'block';
        elements.previewSection.style.display = 'none';
        elements.resultsContainer.style.display = 'none';
        elements.analyzeBtn.disabled = false;
        elements.analyzeBtn.textContent = 'Analizar Imagen';
        elements.imageUploadInput.value = '';
    }

    async function startCamera() {
        try {
            if (stream) return;
            stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
            elements.cameraFeed.srcObject = stream;
        } catch (err) {
            console.warn("No se pudo iniciar la cámara.");
        }
    }

    function stopCamera() {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            stream = null;
        }
    }

    // --- 6. ASIGNACIÓN DE EVENTOS ---

    elements.captureBtn.addEventListener('click', () => {
        const context = elements.canvas.getContext('2d');
        elements.canvas.width = elements.cameraFeed.videoWidth;
        elements.canvas.height = elements.cameraFeed.videoHeight;
        context.drawImage(elements.cameraFeed, 0, 0, elements.canvas.width, elements.canvas.height);
        showPreview(elements.canvas.toDataURL('image/jpeg'));
    });

    elements.imageUploadInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => showPreview(e.target.result);
            reader.readAsDataURL(file);
        }
    });

    elements.analyzeBtn.addEventListener('click', analyzeImage);
    elements.rescanBtn.addEventListener('click', resetInterface);

    // --- 7. FUNCIONES DE VISUALIZACIÓN DE RESULTADOS ---

    function displayResults(predictions, localMatch) {
        if (localMatch) {
            elements.resultsTitle.innerHTML = `<span class="glyphicon glyphicon-ok-sign"></span> ¡Coincidencia Local Encontrada!`;
            elements.birdInfoPanel.innerHTML = `
                <div class="panel-heading"><h3 class="panel-title">Especie de Nicaragua: ${localMatch.name.replace(/^\w/, c => c.toUpperCase())}</h3></div>
                <div class="panel-body">
                    <p class="text-center">La IA ha identificado una correspondencia con nuestro catálogo de aves de Nicaragua.</p>
                    <div class="text-center"><img src="${localMatch.image}" alt="${localMatch.name}" style="max-width: 200px; border-radius: 8px; margin: 10px 0;"></div>
                    <a href="${localMatch.link}" class="btn btn-primary btn-block">Ver Ficha Completa para Confirmar</a>
                </div>`;
        } else {
            const best = predictions[0];
            const name = best.className.split(',')[0].replace(/^\w/, c => c.toUpperCase());
            elements.resultsTitle.innerHTML = `<span class="glyphicon glyphicon-info-sign"></span> Resultado General`;
            elements.birdInfoPanel.innerHTML = `
                <div class="panel-heading"><h3 class="panel-title">${name}</h3></div>
                <div class="panel-body">
                    <p>Esta ave no se encuentra en nuestro catálogo de 47 especies de Nicaragua. La IA sugiere que podría ser un <strong>${name}</strong>.</p>
                </div>`;
        }
    }
    
    function displayError(message) {
        elements.resultsTitle.textContent = 'Análisis Fallido';
        elements.birdInfoPanel.innerHTML = `<div class="panel-body text-danger">${message}</div>`;
    }

    // --- ARRANQUE DE LA APLICACIÓN ---
    initializeApp();
});