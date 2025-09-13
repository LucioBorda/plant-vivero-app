// Usar siempre el dominio de Azure en producción
export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://lasplantadelorenzo.brazilsouth.cloudapp.azure.com:5000';

console.log('🌐 API configurada para:', API_BASE_URL);