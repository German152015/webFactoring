CREATE TABLE Formulario (
    ID INT PRIMARY KEY IDENTITY,
    NombreRazonSocial VARCHAR(100) NOT NULL,
    Apellidos VARCHAR(100) NOT NULL,
    Rut VARCHAR(20) NOT NULL,
    Email VARCHAR(100) NOT NULL,
    Telefono VARCHAR(20),
    TipoDocumento VARCHAR(50),
    CargarDocumento VARCHAR(255), -- Se puede ajustar dependiendo del tipo de datos que se almacenarán
    Comentario VARCHAR(255)
);
