document.addEventListener('DOMContentLoaded', function() {
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirm_password');
    const submitBtn = document.getElementById('submit-btn');
    const form = document.getElementById('reset-password-form');
    
    if (passwordInput) {
        // Validación en tiempo real
        passwordInput.addEventListener('input', function() {
            validatePassword(this.value);
        });
        
        // Verificar que las contraseñas coincidan
        if (confirmPasswordInput) {
            confirmPasswordInput.addEventListener('input', function() {
                if (this.value === passwordInput.value) {
                    this.style.borderColor = 'green';
                } else {
                    this.style.borderColor = 'red';
                }
            });
        }
        
        // Validación al enviar el formulario
        if (form) {
            form.addEventListener('submit', function(e) {
                const password = passwordInput.value;
                const confirmPassword = confirmPasswordInput.value;
                
                // Verificar contraseña
                if (!isPasswordValid(password)) {
                    e.preventDefault();
                    alert('La contraseña debe cumplir con todos los requisitos');
                    return;
                }
                
                // Verificar que las contraseñas coincidan
                if (password !== confirmPassword) {
                    e.preventDefault();
                    alert('Las contraseñas no coinciden');
                    return;
                }
            });
        }
    }
});

function validatePassword(password) {
    // Requisitos
    const hasMinLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    // Actualizar indicadores visuales
    updateRequirement('length-requirement', hasMinLength);
    updateRequirement('uppercase-requirement', hasUpperCase);
    updateRequirement('number-requirement', hasNumber);
    updateRequirement('special-requirement', hasSpecial);
    
    // Actualizar estilo del campo
    document.getElementById('password').style.borderColor = 
        (hasMinLength && hasUpperCase && hasNumber && hasSpecial) ? 'green' : 'red';
    
    return hasMinLength && hasUpperCase && hasNumber && hasSpecial;
}

function updateRequirement(id, isValid) {
    const element = document.getElementById(id);
    if (isValid) {
        element.classList.add('valid-requirement');
        element.classList.remove('invalid-requirement');
    } else {
        element.classList.add('invalid-requirement');
        element.classList.remove('valid-requirement');
    }
}

function isPasswordValid(password) {
    return password.length >= 8 && 
           /[A-Z]/.test(password) && 
           /[0-9]/.test(password) && 
           /[!@#$%^&*(),.?":{}|<>]/.test(password);
}