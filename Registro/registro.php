<?php
// 1. Conexión a la base de datos
$conn = new mysqli("localhost", "root", "", "usuarios_fraude");
if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}

// 2. Recoger datos del formulario
$nombre = $_POST['name'];
$apellido = $_POST['apellido'];
$cedula = $_POST['num_cedula'];
$fecha_expedicion = $_POST['fecha_expedicion'];
$email = $_POST['email'];
$contrasena = password_hash($_POST['contraseña'], PASSWORD_DEFAULT);
$fecha_nacimiento = $_POST['fecha'];
$telefono = $_POST['telefono'];

// 3. Insertar en la base de datos
$sql = "INSERT INTO usuarios (nombre, apellido, cedula, fecha_expedicion, email, contrasena, fecha_nacimiento, telefono)
        VALUES ('$nombre', '$apellido', '$cedula', '$fecha_expedicion', '$email', '$contrasena', '$fecha_nacimiento', '$telefono')";

if ($conn->query($sql) === TRUE) {
    echo "Registro exitoso";
} else {
    echo "Error: " . $conn->error;
}

$conn->close();
?>
