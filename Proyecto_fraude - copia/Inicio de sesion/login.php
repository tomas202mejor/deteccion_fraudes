<?php
// Iniciar sesión
session_start();

// Conexión a la base de datos
$conn = new mysqli("localhost", "root", "", "usuarios_fraude");

// Verificar conexión
if ($conn->connect_error) {
    die("Error de conexión: " . $conn->connect_error);
}

// Configurar charset para caracteres especiales
$conn->set_charset("utf8");

// Comprobar si se enviaron datos del formulario
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Obtener y sanear los datos
    $email = $conn->real_escape_string($_POST['email']);
    $password = $_POST['password'];
    
    // Consulta para encontrar el usuario
    $sql = "SELECT id, nombre, email, contrasena FROM usuarios WHERE email = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows == 1) {
        $user = $result->fetch_assoc();
        
        // Verificar la contraseña
        if (password_verify($password, $user['contrasena'])) {
            // Contraseña correcta, iniciar sesión
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['user_name'] = $user['nombre'];
            $_SESSION['user_email'] = $user['email'];
            
            // Responder con éxito
            echo json_encode(['success' => true, 'message' => 'Inicio de sesión exitoso']);
            exit;
        } else {
            // Contraseña incorrecta
            echo json_encode(['success' => false, 'message' => 'Email o contraseña incorrectos']);
            exit;
        }
    } else {
        // Usuario no encontrado
        echo json_encode(['success' => false, 'message' => 'Email o contraseña incorrectos']);
        exit;
    }
    
    $stmt->close();
}

$conn->close();
?>