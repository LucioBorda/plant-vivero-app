import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

// Configuración para alertas de éxito
export const successAlert = (title, text = '') => {
  return Swal.fire({
    icon: 'success',
    title: title,
    text: text,
    confirmButtonColor: '#22c55e',
    timer: 3000,
    timerProgressBar: true
  });
};

// Configuración para alertas de error
export const errorAlert = (title, text = '') => {
  return Swal.fire({
    icon: 'error',
    title: title,
    text: text,
    confirmButtonColor: '#ef4444'
  });
};

// Configuración para alertas de warning
export const warningAlert = (title, text = '') => {
  return Swal.fire({
    icon: 'warning',
    title: title,
    text: text,
    confirmButtonColor: '#f59e0b'
  });
};

// Configuración para confirmaciones
export const confirmAlert = (title, text = '') => {
  return Swal.fire({
    title: title,
    text: text,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#9CA1D7',
    cancelButtonColor: '#6b7280',
    confirmButtonText: 'Sí, confirmar',
    cancelButtonText: 'Cancelar'
  });
};

// Alerta de loading
export const loadingAlert = (title = 'Cargando...', text = 'Por favor espera un momento') => {
  return Swal.fire({
    title: title,
    text: text,
    icon: 'info',
    allowOutsideClick: false,
    didOpen: () => {
      Swal.showLoading();
    }
  });
};

// Para cerrar cualquier alerta
export const closeAlert = () => {
  Swal.close();
};

export default Swal;