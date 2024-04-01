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
/*
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
*/

/*
app.post('/formulario', async (req, res) => {
    try {
      // Crear una conexión individual
      const connection = await mssql.connect(config);

      // Crear un objeto Transaction
      const transaction = new mssql.Transaction(connection);

      // Iniciar la transacción
      await transaction.begin();

      // Definir la consulta con parámetros usando sintaxis de marcador de posición (?)
      const query = `
        INSERT INTO formulario (
          NombreRazonSocial,
          Apellidos,
          Rut,
          Email,
          Telefono,
          TipoDocumento,
          CargarDocumento,
          Comentario
        ) VALUES (
          @nombreRazonSocial,
          @apellidos,
          @rut,
          @email,
          @telefono,
          @tipoDocumento,
          @cargarDocumento,
          @comentario
        );`;

      // Crear una solicitud preparada
      const request = new mssql.Request(transaction);

       // Obtener los datos del formulario
      // var num1 = parseFloat(req.body.numero1);
      var razon_social= document.getElementById('razon_social').value;
      var apellidos = document.getElementById('apellidos').value;
      var rut = document.getElementById('rut').value;
      var email = document.getElementById('email').value;
      var telefono = document.getElementById('telefono').value;
      var tipo_documento = document.getElementById('tipo_documento').value;
      var cargarDocumento = document.getElementById('cargarDocumento').value;
      var comentario = document.getElementById('comentario').value;
    

      // Asignar valores a los parámetros
      request.input('nombreRazonSocial', razon_social);
      request.input('apellidos', apellidos);
      request.input('rut', rut);
      request.input('email', email);
      request.input('telefono', telefono);
      request.input('tipoDocumento', tipo_documento);
      request.input('cargarDocumento', cargarDocumento);
      request.input('comentario', comentario);

      // Ejecutar la consulta preparada
      await request.query(query);

      // Commit de la transacción para guardar los cambios
      await transaction.commit();

      // Cerrar la conexión
      connection.close();

      // Enviar la respuesta al cliente
      res.status(201).json({ message: 'Formulario creado correctamente' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al crear el formulario' });
    }
  });

*/

app.post('/formulario', async (req, res) => {
  try {
      // Obtener los datos del formulario desde el cuerpo de la solicitud
      const { razon_social, apellidos, rut, email, telefono, tipo_documento, cargarDocumento, comentario } = req.body;

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

      // Enviar respuesta al cliente
     // res.status(201).json({ message: 'Formulario creado correctamente' });
     
    
  } catch (error) {
      console.error('Error al procesar el formulario:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
  }
});


  


// Ruta para manejar la solicitud GET en la raíz del servidor

app.get('/', async (req, res) => {

  res.sendFile(__dirname + "/index.html");
});
/*
app.get('/', function(req, res) {
  res.send('recibiendo solicitud get correctamente'); // Envía una respuesta simple al visitar la raíz del servidor
});
*/

/*
app.get('/', async (req, res) => {
    try {
      // Conectar a la base de datos
      const connection = await pool.connect();
  
      // Ejecutar la consulta
      const results = await connection.query('SELECT * FROM formulario');
  
      // Enviar la respuesta al cliente
      res.status(200).json(results);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al obtener los datos del formulario' });
    }
  });
  */

// Iniciar el servidor
const PORT = 5500;
app.listen(PORT, function() {
  console.log(`Servidor iniciado en el puerto ${PORT}`);
});
