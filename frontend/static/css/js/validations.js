// frontend/static/js/validations.js

/**
 * Sistema de validaciones mejorado para formularios
 */
class FormValidator {
    constructor(formElement) {
        this.form = formElement;
        this.fields = {};
        this.isValid = false;
        this.init();
    }
    
    init() {
        // Configurar validaciones para diferentes tipos de campos
        this.setupEmailValidation();
        this.setupPasswordValidation();
        this.setupNumericValidation();
        this.setupPhoneValidation();
        this.setupIdNumberValidation();
        this.setupRequiredFields();
        this.setupFormSubmission();
    }
    
    // Validación de email
    setupEmailValidation() {
        const emailFields = this.form.querySelectorAll('input[type="email"]');
        emailFields.forEach(field => {
            this.fields[field.name] = {
                element: field,
                isValid: false,
                validators: ['required', 'email']
            };
            
            const debouncedValidation = this.debounce(() => {
                this.validateEmail(field);
            }, 300);
            
            field.addEventListener('input', debouncedValidation);
            field.addEventListener('blur', () => this.validateEmail(field));
        });
    }
    
    // Validación de contraseña
    setupPasswordValidation() {
        const passwordFields = this.form.querySelectorAll('input[type="password"]');
        passwordFields.forEach(field => {
            if (field.name === 'password') {
                this.fields[field.name] = {
                    element: field,
                    isValid: false,
                    validators: ['required', 'password']
                };
                
                field.addEventListener('input', () => {
                    this.validatePassword(field);
                    // Validar confirmación si existe
                    const confirmField = this.form.querySelector('input[name="password_confirm"]');
                    if (confirmField && confirmField.value) {
                        this.validatePasswordConfirmation(confirmField);
                    }
                });
            }
            
            if (field.name === 'password_confirm') {
                this.fields[field.name] = {
                    element: field,
                    isValid: false,
                    validators: ['required', 'password_match']
                };
                
                field.addEventListener('input', () => {
                    this.validatePasswordConfirmation(field);
                });
            }
        });
    }
    
    // Validación de campos numéricos
    setupNumericValidation() {
        const numericFields = this.form.querySelectorAll('input[data-numeric="true"]');
        numericFields.forEach(field => {
            // Permitir solo números
            field.addEventListener('input', (e) => {
                e.target.value = e.target.value.replace(/[^0-9]/g, '');
            });
            
            // Validar en blur
            field.addEventListener('blur', () => {
                this.validateNumeric(field);
            });
        });
    }
    
    // Validación específica para teléfono
    setupPhoneValidation() {
        const phoneField = this.form.querySelector('input[name="phone_number"]');
        if (phoneField) {
            this.fields[phoneField.name] = {
                element: phoneField,
                isValid: false,
                validators: ['required', 'phone']
            };
            
            // Permitir solo números y limitar a 10 dígitos
            phoneField.addEventListener('input', (e) => {
                e.target.value = e.target.value.replace(/[^0-9]/g, '').slice(0, 10);
                this.validatePhone(phoneField);
            });
            
            phoneField.addEventListener('blur', () => this.validatePhone(phoneField));
        }
    }
    
    // Validación específica para número de cédula
    setupIdNumberValidation() {
        const idField = this.form.querySelector('input[name="id_number"]');
        if (idField) {
            this.fields[idField.name] = {
                element: idField,
                isValid: false,
                validators: ['required', 'id_number']
            };
            
            // Permitir solo números y limitar a 12 dígitos
            idField.addEventListener('input', (e) => {
                e.target.value = e.target.value.replace(/[^0-9]/g, '').slice(0, 12);
                this.validateIdNumber(idField);
            });
            
            idField.addEventListener('blur', () => this.validateIdNumber(idField));
        }
    }
    
    // Configurar campos requeridos
    setupRequiredFields() {
        const requiredFields = this.form.querySelectorAll('input[required]');
        requiredFields.forEach(field => {
            if (!this.fields[field.name]) {
                this.fields[field.name] = {
                    element: field,
                    isValid: false,
                    validators: ['required']
                };
            }
            
            field.addEventListener('blur', () => {
                this.validateRequired(field);
            });
        });
    }
    
    // Configurar envío del formulario
    setupFormSubmission() {
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            if (this.validateAllFields()) {
                this.submitForm();
            } else {
                this.focusFirstInvalidField();
            }
        });
    }
    
    // Validadores específicos
    validateEmail(field) {
        const value = field.value.trim();
        
        if (!value) {
            this.setFieldInvalid(field, 'El correo electrónico es obligatorio');
            return false;
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            this.setFieldInvalid(field, 'Por favor ingresa un correo electrónico válido');
            return false;
        }
        
        this.setFieldValid(field);
        return true;
    }
    
    validatePassword(field) {
        const value = field.value;
        
        if (!value) {
            this.setFieldInvalid(field, 'La contraseña es obligatoria');
            this.updatePasswordRequirements(field, {});
            return false;
        }
        
        const requirements = {
            length: value.length >= 8,
            uppercase: /[A-Z]/.test(value),
            number: /[0-9]/.test(value),
            special: /[!@#$%^&*(),.?":{}|<>]/.test(value)
        };
        
        this.updatePasswordRequirements(field, requirements);
        
        const isValid = Object.values(requirements).every(req => req);
        
        if (!isValid) {
            this.setFieldInvalid(field, 'La contraseña no cumple con todos los requisitos de seguridad');
            return false;
        }
        
        this.setFieldValid(field);
        return true;
    }
    
    validatePasswordConfirmation(field) {
        const value = field.value;
        const passwordField = this.form.querySelector('input[name="password"]');
        const passwordValue = passwordField ? passwordField.value : '';
        
        if (!value) {
            this.setFieldInvalid(field, 'Debes confirmar tu contraseña');
            return false;
        }
        
        if (value !== passwordValue) {
            this.setFieldInvalid(field, 'Las contraseñas no coinciden');
            return false;
        }
        
        this.setFieldValid(field);
        return true;
    }
    
    validatePhone(field) {
        const value = field.value;
        
        if (!value) {
            this.setFieldInvalid(field, 'El número telefónico es obligatorio');
            return false;
        }
        
        if (!/^[0-9]{10}$/.test(value)) {
            this.setFieldInvalid(field, 'El número telefónico debe tener exactamente 10 dígitos');
            return false;
        }
        
        this.setFieldValid(field);
        return true;
    }
    
    validateIdNumber(field) {
        const value = field.value;
        
        if (!value) {
            this.setFieldInvalid(field, 'El número de cédula es obligatorio');
            return false;
        }
        
        if (!/^[0-9]{8,12}$/.test(value)) {
            this.setFieldInvalid(field, 'El número de cédula debe tener entre 8 y 12 dígitos numéricos');
            return false;
        }
        
        this.setFieldValid(field);
        return true;
    }
    
    validateRequired(field) {
        const value = field.value.trim();
        
        if (!value) {
            const label = this.getFieldLabel(field);
            this.setFieldInvalid(field, `${label} es obligatorio`);
            return false;
        }
        
        this.setFieldValid(field);
        return true;
    }
    
    validateNumeric(field) {
        const value = field.value;
        
        if (value && !/^[0-9]+$/.test(value)) {
            this.setFieldInvalid(field, 'Este campo solo acepta números');
            return false;
        }
        
        this.setFieldValid(field);
        return true;
    }
    
    // Métodos auxiliares
    updatePasswordRequirements(field, requirements) {
        const requirementIds = ['req-length', 'req-uppercase', 'req-number', 'req-special'];
        const requirementKeys = ['length', 'uppercase', 'number', 'special'];
        
        requirementIds.forEach((id, index) => {
            const element = document.getElementById(id);
            if (element) {
                const key = requirementKeys[index];
                const met = requirements[key] || false;
                const icon = element.querySelector('i');
                
                if (met) {
                    element.classList.remove('requirement-unmet');
                    element.classList.add('requirement-met');
                    if (icon) {
                        icon.classList.remove('fa-times');
                        icon.classList.add('fa-check');
                    }
                } else {
                    element.classList.remove('requirement-met');
                    element.classList.add('requirement-unmet');
                    if (icon) {
                        icon.classList.remove('fa-check');
                        icon.classList.add('fa-times');
                    }
                }
            }
        });
    }
    
    setFieldValid(field) {
        field.classList.remove('is-invalid');
        field.classList.add('is-valid');
        
        const feedback = this.getFeedbackElement(field);
        if (feedback) {
            feedback.textContent = '';
        }
        
        if (this.fields[field.name]) {
            this.fields[field.name].isValid = true;
        }
    }
    
    setFieldInvalid(field, message) {
        field.classList.remove('is-valid');
        field.classList.add('is-invalid');
        
        const feedback = this.getFeedbackElement(field);
        if (feedback) {
            feedback.textContent = message;
        }
        
        if (this.fields[field.name]) {
            this.fields[field.name].isValid = false;
        }
    }
    
    getFeedbackElement(field) {
        return field.parentNode.querySelector('.invalid-feedback') || 
               field.parentNode.parentNode.querySelector('.invalid-feedback');
    }
    
    getFieldLabel(field) {
        const label = this.form.querySelector(`label[for="${field.id}"]`);
        if (label) {
            return label.textContent.replace('*', '').trim();
        }
        
        // Fallback a nombres comunes
        const labelMap = {
            'first_name': 'El nombre',
            'last_name': 'El apellido',
            'email': 'El correo electrónico',
            'password': 'La contraseña',
            'password_confirm': 'La confirmación de contraseña',
            'phone_number': 'El número telefónico',
            'id_number': 'El número de cédula'
        };
        
        return labelMap[field.name] || 'Este campo';
    }
    
    validateAllFields() {
        let allValid = true;
        
        Object.values(this.fields).forEach(fieldData => {
            const field = fieldData.element;
            let fieldValid = true;
            
            if (fieldData.validators.includes('required')) {
                fieldValid = this.validateRequired(field) && fieldValid;
            }
            
            if (fieldData.validators.includes('email')) {
                fieldValid = this.validateEmail(field) && fieldValid;
            }
            
            if (fieldData.validators.includes('password')) {
                fieldValid = this.validatePassword(field) && fieldValid;
            }
            
            if (fieldData.validators.includes('password_match')) {
                fieldValid = this.validatePasswordConfirmation(field) && fieldValid;
            }
            
            if (fieldData.validators.includes('phone')) {
                fieldValid = this.validatePhone(field) && fieldValid;
            }
            
            if (fieldData.validators.includes('id_number')) {
                fieldValid = this.validateIdNumber(field) && fieldValid;
            }
            
            allValid = allValid && fieldValid;
        });
        
        this.isValid = allValid;
        return allValid;
    }
    
    focusFirstInvalidField() {
        const firstInvalid = this.form.querySelector('.is-invalid');
        if (firstInvalid) {
            firstInvalid.focus();
            firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }
    
    submitForm() {
        const submitBtn = this.form.querySelector('button[type="submit"]');
        
        if (submitBtn) {
            submitBtn.disabled = true;
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Procesando...';
            
            // Restaurar botón después de 30 segundos (timeout)
            setTimeout(() => {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
            }, 30000);
        }
        
        // Mostrar loading global
        if (window.AppNotifications) {
            window.AppNotifications.showLoading('Procesando formulario...');
        }
        
        // Enviar formulario
        this.form.submit();
    }
    
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
}

// Auto-inicializar validaciones cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    // Buscar formularios que necesiten validación
    const formsToValidate = document.querySelectorAll('form[data-validate="true"], #registerForm, #loginForm, #resetForm, #confirmForm');
    
    formsToValidate.forEach(form => {
        new FormValidator(form);
    });
    
    // Configuraciones adicionales
    
    // Mejorar visibilidad de contraseñas
    document.querySelectorAll('.password-toggle, #togglePassword, #togglePasswordConfirm').forEach(button => {
        button.addEventListener('click', function() {
            const input = this.parentNode.querySelector('input[type="password"], input[type="text"]');
            const icon = this.querySelector('i');
            
            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                input.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    });
    
    // Añadir atributos a campos que los necesiten
    const idNumberField = document.querySelector('input[name="id_number"]');
    if (idNumberField) {
        idNumberField.setAttribute('data-numeric', 'true');
    }
    
    const phoneField = document.querySelector('input[name="phone_number"]');
    if (phoneField) {
        phoneField.setAttribute('data-numeric', 'true');
    }
});

// Exportar para uso global
window.FormValidator = FormValidator;