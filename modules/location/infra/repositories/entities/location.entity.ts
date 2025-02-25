import { LocationStatus, OpeningHour } from '@/modules/location/domain/models/location.model'

export type LocationEntity = {
    id: number; // ID de la locación
    name: string; // Nombre de la locación
    address: string; // Dirección de la locación
    city: string; // Ciudad donde se encuentra la locación
    province: string; // Provincia donde se encuentra la locación
    phone: string; // Número de teléfono de la locación
    image_url: string; // URL de la imagen de la locación
    registration_date: string; // Fecha de registro en formato "DD/MM/YYYY"
    status: LocationStatus; // Estado de la locación (Open, Closed)
    opening_hours: OpeningHour[]; // Horarios de apertura y cierre
};

// Tipo para definir las propiedades necesarias para crear una nueva locación
export type LocationCreateEntity = {
    name: string;
    address: string;
    city: string;
    province: string;
    phone: string;
    image_url: string;
    registration_date: string;
    opening_hours: OpeningHour[];
};

// Tipo para definir las propiedades necesarias para editar una locación existente
export type LocationEditEntity = {
    id: string;
    name?: string;
    address?: string;
    city?: string;
    province?: string;
    phone?: string;
    image_url?: string;
    opening_hours?: OpeningHour[];
};
