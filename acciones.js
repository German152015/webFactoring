// En acciones.js


function enviarFormulario(event) {
    event.preventDefault(); // Evita que se envíe el formulario de forma tradicional
    
    console.log('Enviando formulario...');
  
    // Obtener los datos del formulario
    const formData = {
      razon_social: document.getElementById('razon_social').value,
      apellidos: document.getElementById('apellidos').value,
      rut: document.getElementById('rut').value,
      email: document.getElementById('email').value,
      telefono: document.getElementById('telefono').value,
      tipo_documento: document.getElementById('tipo_documento').value,
      cargarDocumento: document.getElementById('cargarDocumento').value,
      comentario: document.getElementById('comentario').value
    };
  //  
    // Realizar la solicitud POST al servidor
    fetch('/formulario', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    })
    .then(response => {
      if (response.ok) {
        return response.text();
      }
      throw new Error('Error al enviar el formulario');
    })
    .then(data => {
      console.log('Respuesta del servidor:', data);
      alert('¡Formulario enviado correctamente!');
    })
    .catch(error => {
      console.error('Error:', error);
      alert('Error al enviar el formulario');
    });
  }
  