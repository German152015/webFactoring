use autoFactoringDemo
INSERT INTO Formulario (NombreRazonSocial, Apellidos, Rut, Email, Telefono, TipoDocumento, CargarDocumento, Comentario)
VALUES ('Juan Pérez', 'González', '12345678-9', 'juan@example.com', '123456789', 'Factura', 'ruta_del_archivo.txt', 'Este es un comentario de prueba.');

use autoFactoringDemo
select * from dbo.Formulario