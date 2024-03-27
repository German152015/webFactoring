function enviarFormulario(event) {
    event.preventDefault(); // Evita que el formulario se envíe de forma tradicional
    
    console.log('Enviando formulario...');

    // Obtener los valores de los campos del formulario
    var razonSocial = document.getElementById('razon_social').value;
    var apellidos = document.getElementById('apellidos').value;
    var rut = document.getElementById('rut').value;
    var email = document.getElementById('email').value;
    var telefono = document.getElementById('telefono').value;
    var tipoDocumento = document.getElementById('tipo_documento').value;
    var cargarDocumento = document.getElementById('cargarDocumento').value;
    var comentario = document.getElementById('comentario').value;

    // Crear un objeto con los datos del formulario
    var formData = {
        razonSocial: razonSocial,
        apellidos: apellidos,
        rut: rut,
        email: email,
        telefono: telefono,
        tipoDocumento: tipoDocumento,
        cargarDocumento: cargarDocumento,
        comentario: comentario
    };

    // Enviar los datos del formulario al servidor
    fetch('/submit-form', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
    .then(response => {
        if (response.ok) {
            console.log('Formulario enviado correctamente');
            mostrarAlerta('Formulario enviado correctamente');
        } else {
            console.error('Error al enviar el formulario:', response.statusText);
            mostrarAlerta('Error al enviar el formulario');
        }
    })
    .catch(error => {
        console.error('Error al enviar el formulario:', error);
        mostrarAlerta('Error al enviar el formulario');
    });
}
