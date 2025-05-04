<?php
// 1. Conexión a la base de datos
$conn = new mysqli("localhost", "root", "", "usuarios_fraude");
if ($conn->connect_error) {
    die("Error de conexión: " . $conn->connect_error);
}

// Configurar charset para caracteres especiales
$conn->set_charset("utf8");

// 2. Depuración: Mostrar datos recibidos
echo "<h2>Datos recibidos del formulario:</h2>";
echo "<pre>";
print_r($_POST);
echo "</pre>";

// 3. Validar campos obligatorios
$camposRequeridos = ['name', 'apellido', 'num_cedula', 'fecha_expedicion', 'email', 'password', 'fecha', 'telefono'];
$camposFaltantes = [];

foreach ($camposRequeridos as $campo) {
    if (empty($_POST[$campo])) {
        $camposFaltantes[] = $campo;
    }
}

if (!empty($camposFaltantes)) {
    die("Error: Faltan campos obligatorios: " . implode(', ', $camposFaltantes));
}

// 4. Recoger y validar datos - MAPEO CORRECTO DE CAMPOS
$nombre = $conn->real_escape_string($_POST['name']); // Mapeo de 'name' a 'nombre'
$apellido = $conn->real_escape_string($_POST['apellido']);
$cedula = $conn->real_escape_string($_POST['num_cedula']); // Mapeo de 'num_cedula' a 'cedula'
$email = $conn->real_escape_string($_POST['email']);
$contrasena = password_hash($_POST['password'], PASSWORD_DEFAULT);
$telefono = $conn->real_escape_string($_POST['telefono']);

// Convertir fechas al formato correcto (YYYY-MM-DD)
$fecha_expedicion = $_POST['fecha_expedicion'];
$fecha_nacimiento = $_POST['fecha']; // Mapeo de 'fecha' a 'fecha_nacimiento'

echo "<p>Fecha expedición original: $fecha_expedicion</p>";
echo "<p>Fecha nacimiento original: $fecha_nacimiento</p>";

try {
    $fecha_expedicion = date('Y-m-d', strtotime($fecha_expedicion));
    $fecha_nacimiento = date('Y-m-d', strtotime($fecha_nacimiento));
    
    echo "<p>Fecha expedición convertida: $fecha_expedicion</p>";
    echo "<p>Fecha nacimiento convertida: $fecha_nacimiento</p>";
} catch (Exception $e) {
    die("Error al convertir fechas: " . $e->getMessage());
}

// 5. Insertar usando sentencias preparadas
$sql = "INSERT INTO usuarios (nombre, apellido, cedula, fecha_expedicion, email, contrasena, fecha_nacimiento, telefono)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

$stmt = $conn->prepare($sql);
if (!$stmt) {
    die("Error al preparar la consulta: " . $conn->error);
}

$stmt->bind_param("ssssssss", $nombre, $apellido, $cedula, $fecha_expedicion, $email, $contrasena, $fecha_nacimiento, $telefono);

echo "<h2>Intentando ejecutar la consulta...</h2>";

if ($stmt->execute()) {
    echo "<h3 style='color:green'>Registro exitoso. ID insertado: " . $stmt->insert_id . "</h3>";
    
    // Verificación adicional
    $id = $stmt->insert_id;
    $consultaVerificacion = "SELECT * FROM usuarios WHERE id = $id";
    $resultado = $conn->query($consultaVerificacion);
    
    if ($resultado->num_rows > 0) {
        echo "<h3>Registro en la base de datos:</h3>";
        echo "<pre>";
        print_r($resultado->fetch_assoc());
        echo "</pre>";
    } else {
        echo " (pero no se pudo verificar el registro)";
    }
} else {
    echo "<h3 style='color:red'>Error al ejecutar: " . $stmt->error . "</h3>";
    
    // Mostrar información detallada del error
    echo "<h4>Información del error:</h4>";
    echo "<pre>";
    print_r($stmt->error_list);
    echo "</pre>";
}

$stmt->close();
$conn->close();
?>