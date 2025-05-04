<?php
// Conexión a la base de datos
$conn = new mysqli("localhost", "root", "", "usuarios_fraude");

// Verificar conexión
if ($conn->connect_error) {
    die("Error de conexión: " . $conn->connect_error);
}

// Configurar charset para caracteres especiales
$conn->set_charset("utf8");

// Verificar si se proporcionó un token
if (!isset($_GET['token']) || empty($_GET['token'])) {
    die('Token no proporcionado. <a href="index.html">Volver al inicio</a>');
}

$token = $conn->real_escape_string($_GET['token']);

// Verificar si el token es válido y no ha expirado
$current_time = date("Y-m-d H:i:s");
$sql = "SELECT user_id FROM password_reset WHERE token = ? AND expires > ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ss", $token, $current_time);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    die('El enlace de restablecimiento es inválido o ha expirado. <a href="forgot_password.php">Solicitar un nuevo enlace</a>');
}

$user_id = $result->fetch_assoc()['user_id'];

// Procesar el formulario de restablecimiento
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $password = $_POST['password'];
    $confirm_password = $_POST['confirm_password'];
    
    // Validar que las contraseñas coincidan
    if ($password !== $confirm_password) {
        $error = "Las contraseñas no coinciden";
    } 
    // Validar longitud mínima
    else if (strlen($password) < 8) {
        $error = "La contraseña debe tener al menos 8 caracteres";
    } 
    // Validar que tenga al menos una mayúscula
    else if (!preg_match('/[A-Z]/', $password)) {
        $error = "La contraseña debe contener al menos una letra mayúscula";
    }
    // Validar que tenga al menos un número
    else if (!preg_match('/[0-9]/', $password)) {
        $error = "La contraseña debe contener al menos un número";
    }
    // Validar que tenga al menos un carácter especial
    else if (!preg_match('/[!@#$%^&*(),.?":{}|<>]/', $password)) {
        $error = "La contraseña debe contener al menos un carácter especial";
    }
    else {
        // Actualizar la contraseña
        $hashed_password = password_hash($password, PASSWORD_DEFAULT);
        $update_sql = "UPDATE usuarios SET contrasena = ? WHERE id = ?";
        $update_stmt = $conn->prepare($update_sql);
        $update_stmt->bind_param("si", $hashed_password, $user_id);
        
        if ($update_stmt->execute()) {
            // Eliminar el token usado
            $delete_sql = "DELETE FROM password_reset WHERE token = ?";
            $delete_stmt = $conn->prepare($delete_sql);
            $delete_stmt->bind_param("s", $token);
            $delete_stmt->execute();
            
            $success = "Tu contraseña ha sido actualizada. <a href='index.html'>Iniciar sesión</a>";
        } else {
            $error = "Error al actualizar la contraseña";
        }
    }
}
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Restablecer Contraseña</title>
    <link rel="stylesheet" href="styles.css"> <!-- Usa el mismo estilo -->
    <style>
        .password-requirements {
            margin-top: 5px;
            font-size: 12px;
            color: #666;
            margin-bottom: 15px;
        }
        
        .valid-requirement {
            color: green;
        }
        
        .invalid-requirement {
            color: red;
        }
    </style>
</head>
<body>
    <div class="container">
        <form id="reset-password-form" method="POST">
            <h2>Restablecer Contraseña</h2>
            
            <?php if (isset($error)): ?>
                <p class="error"><?php echo $error; ?></p>
            <?php endif; ?>
            
            <?php if (isset($success)): ?>
                <p class="success"><?php echo $success; ?></p>
            <?php else: ?>
                <p>Ingresa tu nueva contraseña</p>
                
                <input type="password" id="password" name="password" placeholder="Nueva contraseña" required minlength="8">
                
                <div id="password-requirements" class="password-requirements">
                    <p>La contraseña debe contener:</p>
                    <ul>
                        <li id="length-requirement">Al menos 8 caracteres</li>
                        <li id="uppercase-requirement">Al menos una letra mayúscula</li>
                        <li id="number-requirement">Al menos un número</li>
                        <li id="special-requirement">Al menos un carácter especial</li>
                    </ul>
                </div>
                
                <input type="password" id="confirm_password" name="confirm_password" placeholder="Confirmar contraseña" required minlength="8">
                
                <button type="submit" id="submit-btn">Cambiar Contraseña</button>
            <?php endif; ?>
        </form>
    </div>
    
    <script src="reset_password.js"></script>
</body>
</html>