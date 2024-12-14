// servicio.mock.ts

// Definir la interfaz de los servicios
export interface Servicio {
    categoria: string; // Propiedad que identifica la categoría del servicio
    servicio: string;
    duracion: string;
    precio: string;
    fechaRegistro: string;
  }

// Datos de ejemplo para los servicios
export const data: Servicio[] = [
  {
    categoria: 'Cabello',
    servicio: 'Corte de cabello - Adulto/Niño',
    duracion: '45 min',
    precio: 'S/ 60',
    fechaRegistro: '12/08/2024'
  },
  {
    categoria: 'Cabello',
    servicio: 'Ondulación Permanente',
    duracion: '3 h',
    precio: 'S/ 180',
    fechaRegistro: '12/08/2024'
  },
  {
    categoria: 'Barba',
    servicio: 'Ritual de Barba',
    duracion: '30 min',
    precio: 'S/ 40',
    fechaRegistro: '12/08/2024'
  },
  {
    categoria: 'Barba',
    servicio: 'Tinturación de Barba',
    duracion: '30 min',
    precio: 'S/ 40',
    fechaRegistro: '12/08/2024'
  }
]
