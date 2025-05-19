export const validateActualPassword = async (actualPassword = '', newPassword = '') => {
  if (!actualPassword?.trim()) {
    return { valid: false, message: 'Debes proporcionar tu contraseña actual' };
  }

  if (newPassword && newPassword.trim().length > 0 && newPassword.trim().length < 8) {
    return {
      valid: false,
      message: 'La nueva contraseña debe tener al menos 8 caracteres',
    };
  }

  return { valid: true };
};

export const validateActualPasswordMessage = 'La contraseña actual no es correcta';
