document.addEventListener('DOMContentLoaded', function () {

    // --- DATOS DETALLADOS CON FECHAS Y RANGOS ESTIMADOS ---
    const eventos = {
        "Enero": [
            { titulo: "Pico de Aves Migratorias", tipo: "season-migration", desc: "<strong>(Todo el mes)</strong> Los humedales del Pacífico (Lago Xolotlán, Tisma) y Caribe están repletos de patos, aves playeras y garzas." },
            { titulo: "Conteo Navideño de Aves", tipo: "event-count", desc: "<strong>(Hasta el 5 de enero)</strong> Concluye el censo anual de Audubon, una gran oportunidad para contribuir a la ciencia ciudadana." }
        ],
        "Febrero": [
            { titulo: "Anidación del Quetzal", tipo: "season-nesting", desc: "<strong>(Desde mediados de mes)</strong> En reservas como Datanlí-El Diablo, los Quetzales inician su cortejo. ¡La mejor época para verlos!" },
            { titulo: "Migratorias Aún Presentes", tipo: "season-migration", desc: "<strong>(Todo el mes)</strong> Las aves migratorias siguen muy activas en humedales y bosques antes de su viaje de regreso." }
        ],
        "Marzo": [
            { titulo: "Paso Migratorio de Primavera", tipo: "season-migration", desc: "<strong>(Todo el mes)</strong> Aves que invernaron más al sur viajan hacia el norte. Se pueden ver grandes grupos y especies menos comunes." },
            { titulo: "Apogeo del Quetzal", tipo: "season-nesting", desc: "<strong>(Todo el mes)</strong> La actividad de anidación del Quetzal está en su punto más alto. Los machos están muy activos y vocales." }
        ],
        "Abril": [
            { titulo: "Despedida de Migratorias", tipo: "season-migration", desc: "<strong>(Primeras semanas)</strong> Última oportunidad para la mayoría de migratorias. Las rapaces como el Gavilán de Swainson pasan en grandes números." },
            { titulo: "Anidación de Residentes", tipo: "season-nesting", desc: "<strong>(Todo el mes)</strong> El Guardabarranco (Ave Nacional) y otras aves locales están en plena temporada de cría." }
        ],
        "Mayo": [
            { titulo: "Global Big Day", tipo: "event-count", desc: "<strong>(Fecha variable, usualmente un sábado a mediados de mes)</strong> Conteo mundial de 24 horas. Nicaragua participa activamente." },
            { titulo: "Conteo Nacional (MARENA)", tipo: "event-count", desc: "<strong>(Fechas variables)</strong> El Ministerio del Ambiente organiza conteos para monitorear la avifauna del país." }
        ],
        "Junio": [
            { titulo: "Temporada de Aves Residentes", tipo: "season-nesting", desc: "<strong>(Todo el mes)</strong> Con las lluvias, las aves residentes están muy activas alimentando a sus polluelos. Ideal para observar comportamientos." }
        ],
        "Julio": [
            { titulo: "Anidación de la Lapa Verde", tipo: "season-nesting", desc: "<strong>(Todo el mes)</strong> En la Reserva Biológica Indio Maíz, las Lapas Verdes están en su temporada de cría, buscando árboles de almendro." }
        ],
        "Agosto": [
            { titulo: "Aves Juveniles", tipo: "season-nesting", desc: "<strong>(Todo el mes)</strong> Es un buen mes para observar aves juveniles de especies residentes aprendiendo a volar y alimentarse." }
        ],
        "Septiembre": [
            { titulo: "¡Inicia la Migración de Otoño!", tipo: "season-migration", desc: "<strong>(Desde mediados de mes)</strong> Llegan las primeras reinitas y aves playeras desde Norteamérica a las costas y humedales." }
        ],
        "Octubre": [
            { titulo: "Ríos de Rapaces", tipo: "season-migration", desc: "<strong>(Todo el mes, pico a mediados)</strong> ¡Un espectáculo imperdible! Cientos de miles de gavilanes y zopilotes cruzan el istmo de Rivas." },
            { titulo: "Conteo de Aves (MARENA)", tipo: "event-count", desc: "<strong>(Fechas variables)</strong> Segundo conteo nacional del año, enfocado en las recién llegadas aves migratorias." }
        ],
        "Noviembre": [
            { titulo: "Festival Internacional de Aves", tipo: "event-special", desc: "<strong>(Usualmente un fin de semana a mediados de mes)</strong> Celebrado en Granada, con tours en Mombacho y las Isletas." },
            { titulo: "Migratorias Establecidas", tipo: "season-migration", desc: "<strong>(Todo el mes)</strong> La mayoría de aves ya han llegado. Los humedales como el Delta del Estero Real son un paraíso acuático." }
        ],
        "Diciembre": [
            { titulo: "Conteo Navideño de Aves", tipo: "event-count", desc: "<strong>(A partir del 14 de diciembre)</strong> Inicia el conteo de aves más antiguo del mundo. Diversos grupos en Nicaragua organizan rutas." },
            { titulo: "Avistamiento en Cafetales", tipo: "season-migration", desc: "<strong>(Todo el mes)</strong> Las fincas de café de sombra en Matagalpa y Jinotega son refugios vitales para reinitas y otras aves migratorias." }
        ]
    };

    const meses = [
        "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];

    const calendarGrid = document.getElementById('calendar-grid');

    meses.forEach(nombreMes => {
        const eventosDelMes = eventos[nombreMes] || [];
        const monthCard = document.createElement('div');
        monthCard.className = 'month-card';

        let eventosHTML = '';
        if (eventosDelMes.length > 0) {
            eventosDelMes.forEach(evento => {
                eventosHTML += `
                    <div class="event-item ${evento.tipo}">
                        <strong>${evento.titulo}</strong>
                        <p>${evento.desc}</p>
                    </div>
                `;
            });
        } else {
            eventosHTML = `
                <div class="event-item no-event">
                    <strong>Temporada de Aves Residentes</strong>
                    <p>Aunque no hay grandes eventos migratorios, es un excelente momento para enfocarse en las especies residentes y sus comportamientos locales.</p>
                </div>
            `;
        }

        monthCard.innerHTML = `
            <div class="month-header">${nombreMes}</div>
            <div class="events-container">
                ${eventosHTML}
            </div>
        `;

        calendarGrid.appendChild(monthCard);
    });
});