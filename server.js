const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const { Connection, Request } = require('tedious');

// Configuración de la conexión a la base de datos
const config = {
    server: 'DESKTOP-TC7TPLS',  // Reemplaza 'DESKTOP-TC7TPLS' con el nombre de tu servidor
    authentication: {
        type: 'default',
        options: {
            userName: 'paly', // Reemplaza 'paly' con tu nombre de usuario
            password: '1234'  // Reemplaza '1234' con tu contraseña
        }
    },
    options: {
        encrypt: false,  // Desactiva la encriptación
        database: 'autoFactoringDemo'  // Reemplaza 'autoFactoringDemo' con el nombre de tu base de datos
    }
};

// Crear una instancia de conexión a la base de datos
const connection = new Connection(config);

// Establecer el evento de conexión
connection.on('connect', function(err) {
    if (err) {
        console.error('Error al conectar con la base de datos:', err);
    } else {
        console.log('Conectado a la base de datos');
    }
});

// Middleware para parsear el cuerpo de las solicitudes
app.use(bodyParser.json());

// Ruta para manejar la solicitud POST del formulario
app.post('/submit-form', function(req, res) {
    // Obtener los datos del formulario del cuerpo de la solicitud
    const formData = req.body;

    // Crear una nueva solicitud a la base de datos
    const request = new Request(
        `INSERT INTO Formulario (NombreRazonSocial, Apellidos, Rut, Email, Telefono, TipoDocumento, CargarDocumento, Comentario)
        VALUES (@NombreRazonSocial, @Apellidos, @Rut, @Email, @Telefono, @TipoDocumento, @CargarDocumento, @Comentario)`,
        function(err) {
            if (err) {
                console.error('Error al ejecutar la consulta:', err);
                res.status(500).send('Error interno del servidor');
            } else {
                console.log('Datos insertados correctamente');
                res.status(200).send('Formulario enviado correctamente');
            }
        }
    );

    // Añadir parámetros a la consulta
    request.addParameter('NombreRazonSocial', TYPES.VarChar, formData.razonSocial);
    request.addParameter('Apellidos', TYPES.VarChar, formData.apellidos);
    request.addParameter('Rut', TYPES.VarChar, formData.rut);
    request.addParameter('Email', TYPES.VarChar, formData.email);
    request.addParameter('Telefono', TYPES.VarChar, formData.telefono);
    request.addParameter('TipoDocumento', TYPES.VarChar, formData.tipoDocumento);
    request.addParameter('CargarDocumento', TYPES.VarChar, formData.cargarDocumento);
    request.addParameter('Comentario', TYPES.VarChar, formData.comentario);

    // Ejecutar la solicitud a la base de datos
    connection.execSql(request);
});

// Iniciar el servidor
const PORT = 5500;
app.listen(PORT, function() {
    console.log(`Servidor iniciado en el puerto ${PORT}`);
});
