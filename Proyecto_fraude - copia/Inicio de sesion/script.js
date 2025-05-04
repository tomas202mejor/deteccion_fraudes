document.addEventListener('DOMContentLoaded', function() {
    // Manejar el envío del formulario de inicio de sesión
    const loginForm = document.getElementById('transaction-form');
    const resultDiv = document.getElementById('result');

    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Obtener los datos del formulario
            const email = document.getElementById('email').value;
            const password = document.getElementById('contraseña').value;

            // Validar que los campos no estén vacíos
            if (!email || !password) {
                resultDiv.innerHTML = '<p class="error">Por favor, completa todos los campos</p>';
                return;
            }

            // Crear objeto FormData
            const formData = new FormData();
            formData.append('email', email);
            formData.append('password', password);

            // Enviar solicitud AJAX
            fetch('login.php', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // Redirigir al usuario a la página de inicio
                    resultDiv.innerHTML = '<p class="success">' + data.message + '</p>';
                    setTimeout(() => {
                        window.location.href = 'dashboard.php'; // Página a la que redirige tras iniciar sesión
                    }, 1500);
                } else {
                    // Mostrar mensaje de error
                    resultDiv.innerHTML = '<p class="error">' + data.message + '</p>';
                }
            })
            .catch(error => {
                resultDiv.innerHTML = '<p class="error">Error en la solicitud: ' + error.message + '</p>';
            });
        });
    }
});