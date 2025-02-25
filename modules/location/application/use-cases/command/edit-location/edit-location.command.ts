export type EditLocationCommand = {
    id: string; // ID de la locación a editar
    name: string; // Nombre de la locación (opcional para edición)
    address: string; // Dirección de la locación (opcional para edición)
    city: string; // Ciudad donde se encuentra la locación (opcional para edición)
    province: string; // Provincia donde se encuentra la locación (opcional para edición)
    phone: string; // Número de teléfono de la locación (opcional para edición)
    imageUrl: string; // URL de la imagen de la locación (opcional para edición)
    openingHours: Array<{
        day: string; // Día de la semana (por ejemplo, "sunday")
        open: number; // Hora de apertura en formato timestamp
        close: number; // Hora de cierre en formato timestamp
    }>; // Horarios de apertura y cierre (opcional para edición)
};
