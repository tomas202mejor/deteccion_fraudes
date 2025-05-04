<?php
// Evitar que se muestre cualquier error/advertencia que pueda dañar el JSON
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Cargar PHPMailer antes de cualquier lógica condicional
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require __DIR__ . '/PHPMailer-master/src/Exception.php';
require __DIR__ . '/PHPMailer-master/src/PHPMailer.php';
require __DIR__ . '/PHPMailer-master/src/SMTP.php';


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
    // Aquí importamos PHPMailer solo cuando lo necesitamos

    
    header('Content-Type: application/json');
    
    // Obtener y sanear el email
    $email = $conn->real_escape_string($_POST['email']);
    
    // Verificar si el email existe en la base de datos
    $sql = "SELECT id, nombre FROM usuarios WHERE email = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows == 1) {
        $user = $result->fetch_assoc();
        
        // Generar token único
        $token = bin2hex(random_bytes(32));
        $expires = date("Y-m-d H:i:s", time() + 3600); // Expira en 1 hora
        
        // Guardar token en la base de datos
        $sql = "INSERT INTO password_reset (user_id, token, expires) VALUES (?, ?, ?)";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("iss", $user['id'], $token, $expires);
        
        if ($stmt->execute()) {
            // Construir URL de restablecimiento
            $reset_url = "http://localhost/Proyecto_fraude/Inicio%20de%20sesion/reset_password.php?token=" . $token;
            
            // Crear una instancia de PHPMailer
            $mail = new PHPMailer(true);
            
            try {
                // Configuración del servidor
                $mail->SMTPDebug = 0;
                $mail->isSMTP();
                $mail->Host       = 'smtp.gmail.com';
                $mail->SMTPAuth   = true;
                $mail->Username   = 'digitalsolutionssa.ia@gmail.com'; // TU CORREO GMAIL AQUÍ
                $mail->Password   = 'mttz fxee hgxi zend'; // LA CONTRASEÑA DE APLICACIÓN AQUÍ
                $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
                $mail->Port       = 587;
                
                // Destinatarios
                $mail->setFrom('digitalsolutionssa.ia@gmail.com', 'Sistema de Recuperación');
                $mail->addAddress($email, $user['nombre']);
                
                // Contenido
                $mail->isHTML(true);
                $mail->Subject = 'Recuperación de contraseña';
                $mail->Body    = "
                <html>
                <head>
                    <title>Recuperación de contraseña</title>
                </head>
                <body>
                    <h2>Hola {$user['nombre']},</h2>
                    <p>Has solicitado restablecer tu contraseña.</p>
                    <p>Por favor, haz clic en el siguiente enlace para crear una nueva contraseña:</p>
                    <p><a href='{$reset_url}'>Restablecer mi contraseña</a></p>
                    <p>O copia y pega esta URL en tu navegador: {$reset_url}</p>
                    <p>Este enlace estará disponible solo por 1 hora.</p>
                    <p>Si no solicitaste este cambio, ignora este correo.</p>
                </body>
                </html>";
                
                $mail->send();
                echo json_encode(['success' => true, 'message' => 'Se ha enviado un enlace de recuperación a tu correo electrónico']);
            } catch (Exception $e) {
                echo json_encode(['success' => false, 'message' => 'No se pudo enviar el correo: ' . $mail->ErrorInfo]);
            }
        } else {
            echo json_encode(['success' => false, 'message' => 'Error al procesar la solicitud']);
        }
    } else {
        // No mostrar si el email existe o no por seguridad
        echo json_encode(['success' => true, 'message' => 'Si tu email está registrado, recibirás un enlace para recuperar tu contraseña']);
    }
    
    $stmt->close();
    $conn->close();
    exit;
}
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Recuperar Contraseña</title>
    <link rel="stylesheet" href="styles.css"> <!-- Usa el mismo estilo -->
</head>
<body>
    <div class="container">
        <form id="forgot-password-form">
            <h2>Recuperar Contraseña</h2>
            <p>Ingresa tu dirección de correo electrónico para recibir instrucciones sobre cómo restablecer tu contraseña.</p>
            
            <input type="email" id="email" name="email" placeholder="Correo electrónico" required>
            
            <button type="submit">Enviar Enlace de Recuperación</button>
            
            <div class="register-link">
                <p><a href="index.html">Volver al inicio de sesión</a></p>
            </div>
        </form>
        <div id="result"></div>
    </div>
    
    <script>
    document.addEventListener('DOMContentLoaded', function() {
        const form = document.getElementById('forgot-password-form');
        const resultDiv = document.getElementById('result');
        
        if (form) {
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const email = document.getElementById('email').value;
                
                if (!email) {
                    resultDiv.innerHTML = '<p class="error">Por favor, ingresa tu correo electrónico</p>';
                    return;
                }
                
                const formData = new FormData();
                formData.append('email', email);
                
                fetch('forgot_password.php', {
                    method: 'POST',
                    body: formData
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        resultDiv.innerHTML = '<p class="success">' + data.message + '</p>';
                        form.reset();
                    } else {
                        resultDiv.innerHTML = '<p class="error">' + data.message + '</p>';
                    }
                })
                .catch(error => {
                    resultDiv.innerHTML = '<p class="error">Error en la solicitud: ' + error.message + '</p>';
                });
            });
        }
    });
    </script>
</body>
</html>