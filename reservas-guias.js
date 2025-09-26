document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('reservaForm');
    const formGroups = form.querySelectorAll('.form-group');

    formGroups.forEach((group, index) => {
        group.style.animationDelay = `${index * 0.1}s`;
    });

    const fieldsToValidate = [
        'reservaSelect', 'guiaSelect', 'fecha', 'nombre', 'email', 'participantes'
    ];

    fieldsToValidate.forEach(fieldId => {
        const input = document.getElementById(fieldId);
        const formGroup = input.closest('.form-group');

        if (input.type !== 'checkbox' && formGroup.querySelector('.col-sm-10, .col-sm-4')) {
            const wrapper = formGroup.querySelector('.col-sm-10, .col-sm-4');
            if (!wrapper.classList.contains('input-wrapper')) {
                wrapper.classList.add('input-wrapper');
                wrapper.innerHTML += '<span class="glyphicon glyphicon-ok validation-icon"></span>';
            }
        }

        input.addEventListener('input', () => {
            let isValid = false;
            if (input.type === 'email') {
                isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value);
            } else {
                isValid = input.value.trim() !== '';
            }

            if (isValid) {
                formGroup.classList.add('is-valid');
            } else {
                formGroup.classList.remove('is-valid');
            }
        });
    });

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        const reservaSelect = document.getElementById('reservaSelect');
        const guiaSelect = document.getElementById('guiaSelect');
        const fechaInput = document.getElementById('fecha');
        const horaInput = document.getElementById('hora');
        const participantesInput = document.getElementById('participantes');
        const nombreInput = document.getElementById('nombre');
        const emailInput = document.getElementById('email');

        if (!reservaSelect.value || !guiaSelect.value || !fechaInput.value || !nombreInput.value || !emailInput.value) {
            Swal.fire({
                icon: 'error',
                title: 'Campos Incompletos',
                text: 'Por favor, rellena todos los campos obligatorios.',
            });
            return;
        }

        // --- NUEVA LÓGICA PARA CAPTURAR DATOS Y SIMULAR CORREO ---
        
        const nombreGuia = guiaSelect.options[guiaSelect.selectedIndex].text;
        const nombreReserva = reservaSelect.options[reservaSelect.selectedIndex].text;
        const fecha = fechaInput.value;
        const hora = horaInput.value || 'No especificada';
        const numPersonas = participantesInput.value || 1;
        const nombreUsuario = nombreInput.value;
        
        let serviciosHTML = '';
        const serviciosSeleccionados = document.querySelectorAll('input[name="servicios"]:checked');
        if (serviciosSeleccionados.length > 0) {
            serviciosHTML += '<h5>Servicios Adicionales:</h5><ul>';
            serviciosSeleccionados.forEach(servicio => {
                serviciosHTML += `<li>${servicio.parentElement.textContent.trim()}</li>`;
            });
            serviciosHTML += '</ul>';
        } else {
            serviciosHTML = '<p>No se solicitaron servicios adicionales.</p>';
        }

        const emailBody = `
            <div style="text-align: left; font-family: Arial, sans-serif; line-height: 1.6;">
                <h3 style="color: #2b582b;">¡Hola, ${nombreUsuario}!</h3>
                <p>Tu reserva para una experiencia de aviturismo ha sido confirmada. Aquí están los detalles:</p>
                <hr>
                <ul style="list-style-type: none; padding: 0;">
                    <li><strong>Guía:</strong> ${nombreGuia}</li>
                    <li><strong>Lugar:</strong> ${nombreReserva}</li>
                    <li><strong>Fecha:</strong> ${fecha}</li>
                    <li><strong>Hora:</strong> ${hora}</li>
                    <li><strong>Participantes:</strong> ${numPersonas}</li>
                </ul>
                ${serviciosHTML}
                <hr>
                <p>Recibirás más instrucciones en tu correo. ¡Prepárate para una gran aventura!</p>
                <p><strong>El equipo de EcoAves</strong></p>
            </div>
        `;

        Swal.fire({
            title: '<strong>Notificación Enviada</strong>',
            icon: 'success',
            html: emailBody,
            focusConfirm: false,
            confirmButtonText: '<i class="fa fa-thumbs-up"></i> ¡Entendido!',
            confirmButtonAriaLabel: 'Thumbs up, great!',
        }).then(() => {
            form.reset();
            form.querySelectorAll('.form-group').forEach(group => {
                group.classList.remove('is-valid');
            });
        });
    });
});