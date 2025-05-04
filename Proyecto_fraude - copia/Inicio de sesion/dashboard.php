<?php
// Iniciar sesión
session_start();

// Verificar si el usuario ha iniciado sesión
if (!isset($_SESSION['user_id'])) {
    // Redirigir a la página de inicio de sesión si no hay sesión
    header("Location: index.html");
    exit;
}

// Información del usuario
$nombre = $_SESSION['user_name'];
$email = $_SESSION['user_email'];
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Panel de Usuario</title>
    <link rel="stylesheet" href="styles.css">
    <style>
        .dashboard-container {
            max-width: 800px;
            margin: 20px auto;
            padding: 20px;
            background-color: #fff;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }
        .welcome-message {
            text-align: center;
            margin-bottom: 30px;
        }
        .user-info {
            background-color: #f9f9f9;
            padding: 15px;
            border-radius: 5px;
            margin-bottom: 20px;
        }
        .logout-btn {
            background-color: #c41d1d;
            color: white;
            border: none;
            padding: 10px 15px;
            border-radius: 5px;
            cursor: pointer;
            display: block;
            margin: 20px auto;
            width: 200px;
            text-align: center;
            text-decoration: none;
        }
        .logout-btn:hover {
            background-color: #a61818;
        }
    </style>
</head>
<body>
    <div class="dashboard-container">
        <div class="welcome-message">
            <h1>Bienvenido a tu Panel de Usuario</h1>
            <p>Has iniciado sesión correctamente</p>
        </div>
        
        <div class="user-info">
            <h2>Información del Usuario</h2>
            <p><strong>Nombre:</strong> <?php echo htmlspecialchars($nombre); ?></p>
            <p><strong>Email:</strong> <?php echo htmlspecialchars($email); ?></p>
        </div>
        
        <a href="logout.php" class="logout-btn">Cerrar Sesión</a>
    </div>
</body>
</html>