const express = require('express');
const bodyParser = require('body-parser');
const mssql = require('mssql');

const app = express();

// Configuración de la conexión a la base de datos
const config = {
  server: 'DESKTOP-TC7TPLS', // Reemplaza 'DESKTOP-TC7TPLS' con el nombre de tu servidor
  authentication: {
    type: 'default',
    options: {
      userName: 'paly', // Reemplaza 'paly' con tu nombre de usuario
      password: '1234' // Reemplaza '1234' con tu contraseña
    }
  },
  options: {
    encrypt: false, // Desactiva la encriptación
    database: 'autoFactoringDemo' // Reemplaza 'autoFactoringDemo' con el nombre de tu base de datos
  }
};

// Middleware para parsear el cuerpo de las solicitudes
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Crear una instancia de pool de conexiones
const pool = new mssql.ConnectionPool(config);

// Establecer el evento de error
pool.on('error', function(err) {
  console.error('Error al conectar con la base de datos:', err);
});

// Ruta para manejar la solicitud POST del formulario
app.post('/submit-form', async function(req, res) {
  try {
    // Obtener los datos del formulario del cuerpo de la solicitud
    const formData = req.body;

    // Conectar al pool
    const connection = await pool.connect();

    // Crear una solicitud de consulta
    const request = connection.request();

    // Añadir parámetros a la consulta usando request.input
    request.input('NombreRazonSocial', formData.razon_social);
    request.input('Apellidos', formData.apellidos);
    request.input('Rut', formData.rut);
    request.input('Email', formData.email);
    request.input('Telefono', formData.telefono);
    request.input('TipoDocumento', formData.tipo_documento);
    request.input('CargarDocumento', formData.cargarDocumento);
    request.input('Comentario', formData.comentario);

    // Ejecutar la consulta de inserción
    await request.query(`
      INSERT INTO Formulario (NombreRazonSocial, Apellidos, Rut, Email, Telefono, TipoDocumento, CargarDocumento, Comentario)
      VALUES (@NombreRazonSocial, @Apellidos, @Rut, @Email, @Telefono, @TipoDocumento, @CargarDocumento, @Comentario)
    `);

    // Cerrar la conexión
    connection.close();

    // Enviar una respuesta al cliente
    res.status(200).send('Formulario enviado correctamente');
  } catch (error) {
    console.error('Error al ejecutar la inserción:', error);
    res.status(500).send('Error interno del servidor');
  }
});

// Ruta para manejar la solicitud GET en la raíz del servidor
app.get('/', function(req, res) {
  res.send('¡Hola, mundo desde el servidor!'); // Envía una respuesta simple al visitar la raíz del servidor
});

// Iniciar el servidor
const PORT = 5500;
app.listen(PORT, function() {
  console.log(`Servidor iniciado en el puerto ${PORT}`);
});
