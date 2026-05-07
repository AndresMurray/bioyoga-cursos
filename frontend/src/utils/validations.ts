export const validateDni = (value: string): string => {
  if (value.trim() === '') return '';
  if (!/^\d+$/.test(value)) return 'El DNI debe contener solo números.';
  if (value.length < 7 || value.length > 10) return 'El DNI debe tener entre 7 y 10 dígitos.';
  return '';
};

export const validateEmail = (value: string): string => {
  if (value.trim() === '') return '';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'El email no tiene un formato válido.';
  return '';
};

export const validatePassword = (value: string): string => {
  if (value.trim() === '') return '';
  if (value.length < 6) return 'La contraseña debe tener al menos 6 caracteres.';
  return '';
};

export const validateField = (name: string, value: string): string => {
  switch (name) {
    case 'dni':
      return validateDni(value);
    case 'email':
      return validateEmail(value);
    case 'password':
      return validatePassword(value);
    default:
      return '';
  }
};
