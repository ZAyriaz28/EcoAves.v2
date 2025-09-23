document.addEventListener('DOMContentLoaded', function() {
    // --- 1. DATOS DE LAS RESERVAS ---
    const reservas = [
        { 
            nombre: "Reserva Biológica Indio Maíz", 
            lat: 11.033, lng: -84.05, 
            desc: "Selva tropical densa, ideal para aviturismo extremo.", 
            img: "images/Reserva Biológica Indio Maíz.jpeg",
            actividades: ["aviturismo", "humedales"] 
        },
        { 
            nombre: "Reserva Natural Volcán Mombacho", 
            lat: 11.826, lng: -85.968, 
            desc: "Bosque nuboso con especies endémicas.", 
            img: "images/Reserva Natural Volcán Mombacho.jpg",
            actividades: ["aviturismo", "volcanes", "bosque-nuboso"] 
        },
        { 
            nombre: "Reserva Natural Isla Juan Venado", 
            lat: 12.383, lng: -87.066, 
            desc: "Humedales y manglares, santuario de aves acuáticas.", 
            img: "images/Reserva Natural Isla Juan Venado.jpg",
            actividades: ["aviturismo", "humedales"] 
        },
        {
            nombre: "Parque Nacional Volcán Masaya",
            lat: 11.984, lng: -86.161,
            desc: "Un volcán activo con un paisaje único y aves adaptadas a él.",
            img: "images/Parque Nacional Volcán Masaya.jpg",
            actividades: ["volcanes"]
        },
        {
            nombre: "Refugio de Vida Silvestre Los Guatuzos",
            lat: 11.05, lng: -85.1,
            desc: "Un vasto humedal en la ribera del Lago Cocibolca, reconocido como sitio RAMSAR.",
            img: "images/Refugio de Vida Silvestre Los Guatuzos.jpg",
            actividades: ["aviturismo", "humedales"]
        },
        {
            nombre: "Reserva de Biósfera de Bosawás",
            lat: 13.8, lng: -85.0,
            desc: "El corazón del Corredor Biológico Mesoamericano, con una biodiversidad inmensa.",
            img: "images/Reserva de Biósfera de Bosawás.jpg",
            actividades: ["aviturismo", "bosque-nuboso"]
        },
        {
            nombre: "Reserva Natural Cerro Apante",
            lat: 12.91, lng: -85.89,
            desc: "Macizo montañoso con bosque nuboso y cafetales de altura cerca de Matagalpa.",
            img: "images/Reserva Natural Cerro Apante.jpg",
            actividades: ["aviturismo", "bosque-nuboso"]
        },
         {
            nombre: "Reserva Natural Wawashang",
            lat: 12.67, lng: -83.91,
            desc: "Amplia reserva tropical en la Costa Caribe Sur de Nicaragua, con selvas, ríos y manglares que albergan gran biodiversidad",
            img: "images/Reserva natural wawashang.jpg",
            actividades: ["aviturismo", "bosque-nuboso"]
        }
    ];

    // --- 2. INICIALIZACIÓN DEL MAPA MEJORADO ---
    
    var southWest = L.latLng(10.5, -88.0);
    var northEast = L.latLng(15.2, -83.0);
    var bounds = L.latLngBounds(southWest, northEast);

    var map = L.map('map', {
        center: [12.8654, -85.2072],
        zoom: 7,
        maxBounds: bounds,
        maxBoundsViscosity: 1.0,
        minZoom: 7
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // --- CAMBIOS EN EL ÍCONO ---
    var birdIcon = L.icon({
        iconUrl: 'favicon/android-chrome-192x192.png', // <-- CAMBIO: Usamos una imagen más grande y de mejor calidad
        iconSize: [70, 70],                            // <-- CAMBIO: Ícono más grande (42x42 pixeles)
        iconAnchor: [24, 70],                          // <-- CAMBIO: Ajustamos el anclaje para el nuevo tamaño
        popupAnchor: [0, -70]                          // <-- CAMBIO: Ajustamos el anclaje del pop-up
    });

    reservas.forEach(function(reserva) {
        L.marker([reserva.lat, reserva.lng], { icon: birdIcon })
            .addTo(map)
            .bindPopup(`
                <div style="width: 150px; text-align: center;">
                    <img src="${reserva.img}" alt="${reserva.nombre}" style="width:100%; height:80px; object-fit: cover; border-radius: 4px;">
                    <b style="display: block; margin-top: 5px;">${reserva.nombre}</b>
                </div>
            `);
    });

    // --- 3. FUNCIONALIDAD DE FILTROS Y BÚSQUEDA ---
    const filtroActividad = document.getElementById('filtroActividad');
    const campoBusqueda = document.getElementById('campoBusqueda');
    const contenedorReservas = document.getElementById('listaReservas');
    const todasLasTarjetas = Array.from(contenedorReservas.children);

    function aplicarFiltros() {
        const actividadSeleccionada = filtroActividad.value;
        const terminoBusqueda = campoBusqueda.value.toLowerCase().trim();

        todasLasTarjetas.forEach(tarjeta => {
            const nombreReserva = tarjeta.querySelector('h3').textContent.toLowerCase();
            const actividadesTarjeta = tarjeta.dataset.actividades.split(',');
            
            const coincideBusqueda = nombreReserva.includes(terminoBusqueda);
            const coincideActividad = (actividadSeleccionada === 'todas') || actividadesTarjeta.includes(actividadSeleccionada);

            if (coincideBusqueda && coincideActividad) {
                tarjeta.style.display = 'block';
            } else {
                tarjeta.style.display = 'none';
            }
        });
    }

    filtroActividad.addEventListener('change', aplicarFiltros);
    campoBusqueda.addEventListener('input', aplicarFiltros);
});