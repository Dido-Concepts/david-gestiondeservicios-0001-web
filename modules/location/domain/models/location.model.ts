/* eslint-disable no-unused-vars */
export enum LocationStatus {
  ACTIVE = 'Active',
  INACTIVE = 'Inactive',
}

export type OpeningHour = {
  day: string; // Día de la semana (por ejemplo, 'sunday')
  open: number; // Hora de apertura en formato timestamp
  close: number; // Hora de cierre en formato timestamp
}

export type LocationModel = {
  id: string; // ID de la locación
  name: string; // Nombre de la sede
  address: string; // Dirección de la sede
  city: string; // Ciudad donde se encuentra la sede
  province: string; // Provincia donde se encuentra la sede
  phone: string; // Número de teléfono de contacto
  imageUrl: string; // URL de la imagen de la sede
  registrationDate: string; // Fecha de registro en formato 'DD/MM/YYYY'
  status: LocationStatus; // Estado de la locación (abierta o cerrada)
  openingHours: OpeningHour[]; // Horarios de apertura y cierre para cada día de la semana
};
