document.getElementById("miFormulario").addEventListener("submit", function(event) {
    event.preventDefault(); // Evita que la página se recargue

    // Obtener los valores de los inputs
    let nombre = document.getElementById("name").value;
    let apellido = document.getElementById("apellido").value;
    let num_cedula = document.getElementById("num_cedula").value;
    let fecha_expedicion = document.getElementById("fecha_expedicion").value;
    let email = document.getElementById("email").value;
    let fecha_nacimiento = document.getElementById("fecha_nacimiento").value;
    let telefono = document.getElementById("telefono").value;


    // Verificar que todos los campos obligatorios estén llenos
    if (!nombre || !apellido || !num_cedula || !fecha_expedicion || !email || !fecha_nacimiento || !telefono) {
        alert("Por favor, completa todos los campos obligatorios.");
        return;
    }

    // Abrir una nueva ventana y mostrar los datos
    let nuevaVentana = window.open("", "_blank", "width=400,height=500");

    nuevaVentana.document.write(`
        <html>
        <head>
            <title>Datos Ingresados</title>
            <style>
                body { font-family: Arial, sans-serif; text-align: center; padding: 20px; }
                h2 { color: #333; }
                p { font-size: 18px; }
            </style>
        </head>
        <body>
            <h2>Datos Ingresados</h2>
            <p><strong>Nombres:</strong> ${nombre}</p>
            <p><strong>Apellidos:</strong> ${apellido}</p>
            <p><strong>Teléfono:</strong> ${num_cedula}</p>
            <p><strong>Fecha de Expedición:</strong> ${fecha_expedicion}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Fecha de Nacimiento:</strong> ${fecha_nacimiento}</p>
            <p><strong>Telefono:</strong> ${telefono}</p>
            <p><strong>Archivo Subido:</strong> ${file ? file : "No se subió un archivo"}</p>
            <br>
            <button onclick="window.close()">Cerrar</button>
        </body>
        </html>
    `);
});

// Función para resetear el formulario
function resetFormulario() {
    document.getElementById("miFormulario").reset();
}

// Función para validar que solo se ingresen números en el teléfono
function validarTelefono(input) {
    input.value = input.value.replace(/[^0-9]/g, ''); // Solo permite números
}
