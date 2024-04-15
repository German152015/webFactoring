const express = require('express');
const bodyParser = require('body-parser');
const mssql = require('mssql');
const acciones = require('./acciones');


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
    database: 'autoFactoringDemo',
    transaction: true 
  }
};

// Middleware para parsear el cuerpo de las solicitudes
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname));

// Crear una instancia de pool de conexiones
const pool = new mssql.ConnectionPool(config);

// Establecer el evento de error
pool.on('error', function(err) {
  console.error('Error al conectar con la base de datos:', err);
});

// Ruta para manejar la solicitud POST del formulario
app.post('/', async (req, res) => {
  try {
    // Obtener los datos del formulario desde el cuerpo de la solicitud
    const { razon_social, apellidos, rut, email, telefono, tipo_documento, cargarDocumento, comentario } = req.body;

    // Validar que el campo de nombre solo contenga caracteres alfabéticos
    if (!/^[a-zA-Z]+$/.test(razon_social)) {
      return res.status(400).json({ error: 'Nombre ingresado incorrecto' });
    }

    // Conectar a la base de datos
    const pool = await mssql.connect(config);

    // Crear una solicitud de consulta
    const request = pool.request();

    // Definir la consulta de inserción
    const query = `
      INSERT INTO formulario (NombreRazonSocial, Apellidos, Rut, Email, Telefono, TipoDocumento, CargarDocumento, Comentario)
      VALUES (@razon_social, @apellidos, @rut, @email, @telefono, @tipo_documento, @cargarDocumento, @comentario)
    `;

    // Añadir parámetros a la consulta
    request.input('razon_social', mssql.VarChar, razon_social);
    request.input('apellidos', mssql.VarChar, apellidos);
    request.input('rut', mssql.VarChar, rut);
    request.input('email', mssql.VarChar, email);
    request.input('telefono', mssql.VarChar, telefono);
    request.input('tipo_documento', mssql.VarChar, tipo_documento);
    request.input('cargarDocumento', mssql.VarChar, cargarDocumento);
    request.input('comentario', mssql.VarChar, comentario);

    // Ejecutar la consulta de inserción
    await request.query(query);

    // Cerrar la conexión a la base de datos
    await pool.close();

    // Redireccionar al usuario a la página "procesado.html"
    res.sendFile(__dirname + "/procesado.html");

  } catch (error) {
    console.error('Error al procesar el formulario:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Ruta para manejar la solicitud GET en la raíz del servidor
app.get('/', function(req, res) {
  res.send('Recibiendo solicitud GET correctamente'); // Envía una respuesta simple al visitar la raíz del servidor
});

// Iniciar el servidor
const PORT = 5500;
app.listen(PORT, function() {
  console.log(`Servidor iniciado en el puerto ${PORT}`);
});
