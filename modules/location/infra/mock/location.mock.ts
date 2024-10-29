// Definición de los tipos para el mock de datos de las locaciones

// Tipo para los horarios de apertura y cierre
interface OpeningHour {
  day: string; // Nombre del día en minúsculas (ej. "sunday", "monday", etc.)
  open: number; // Hora de apertura en formato timestamp (segundos desde medianoche)
  close: number; // Hora de cierre en formato timestamp
}

// Tipo principal para la locación
interface Sede {
  id: string; // ID de la sede
  name: string; // Nombre de la sede
  address: string; // Dirección de la sede
  city: string; // Ciudad de la sede
  province: string; // Provincia de la sede
  phone: string; // Teléfono de contacto de la sede
  imageUrl: string; // URL de la imagen de la sede
  registrationDate: string; // Fecha de registro en formato "DD/MM/YYYY"
  openingHours: OpeningHour[]; // Array de horarios de apertura y cierre
}

// Tipo general para el objeto que contiene todas las locaciones
interface LocationData {
  locations: Sede[]; // Array de sedes
}

// Mock de datos en TypeScript utilizando los tipos definidos
export const mockLocationData: LocationData = {
  locations: [
    {
      id: '1',
      name: 'Ayacucho',
      address: 'Jr. Londres 246',
      city: 'Ayacucho',
      province: 'Ayacucho',
      phone: '931561797',
      imageUrl: 'https://images.fresha.com/locations/location-profile-images/1201584/1549899/48d80761-b27d-443b-a0fd-6cc6debbcdcf-MrJacobsSanIsidro-PE-ProvinciaDeLima-Lima-SanIsidro-Fresha.jpg?class=width-small',
      registrationDate: '12/08/2024',
      openingHours: [
        { day: 'sunday', open: 36000, close: 61200 },
        { day: 'monday', open: 32400, close: 68400 },
        { day: 'tuesday', open: 32400, close: 68400 },
        { day: 'wednesday', open: 32400, close: 68400 },
        { day: 'thursday', open: 32400, close: 68400 },
        { day: 'friday', open: 32400, close: 68400 },
        { day: 'saturday', open: 36000, close: 61200 }
      ]
    },
    {
      id: '2',
      name: 'Lima',
      address: 'Av. Brasil 246',
      city: 'Jesús María',
      province: 'Lima',
      phone: '931561797',
      imageUrl: 'https://images.fresha.com/locations/location-profile-images/1201584/1558100/b7480242-f7da-4671-922b-9a96ab78db29-MrJacobsLaMolina-PE-ProvinciaDeLima-Lima-LaMolina-Fresha.jpg?class=width-small',
      registrationDate: '12/08/2024',
      openingHours: [
        { day: 'sunday', open: 36000, close: 61200 },
        { day: 'monday', open: 32400, close: 68400 },
        { day: 'tuesday', open: 32400, close: 68400 },
        { day: 'wednesday', open: 32400, close: 68400 },
        { day: 'thursday', open: 32400, close: 68400 },
        { day: 'friday', open: 32400, close: 68400 },
        { day: 'saturday', open: 36000, close: 61200 }
      ]
    },
    {
      id: '3',
      name: 'Cuzco',
      address: 'Av. El Sol 123',
      city: 'Cuzco',
      province: 'Cuzco',
      phone: '987654321',
      imageUrl: 'https://images.fresha.com/locations/location-profile-images/1201584/2031746/2001b20e-cf48-4410-b133-191098554122-MrJacobsSanBorja-PE-ProvinciaDeLima-SanBorja-UrbCorpac-Fresha.jpg?class=width-small',
      registrationDate: '15/09/2024',
      openingHours: [
        { day: 'sunday', open: 36000, close: 61200 },
        { day: 'monday', open: 32400, close: 68400 },
        { day: 'tuesday', open: 32400, close: 68400 },
        { day: 'wednesday', open: 32400, close: 68400 },
        { day: 'thursday', open: 32400, close: 68400 },
        { day: 'friday', open: 32400, close: 68400 },
        { day: 'saturday', open: 36000, close: 61200 }
      ]
    },
    {
      id: '4',
      name: 'Arequipa',
      address: 'Calle Mercaderes 456',
      city: 'Arequipa',
      province: 'Arequipa',
      phone: '923456789',
      imageUrl: 'https://images.fresha.com/locations/location-profile-images/1201584/1549899/48d80761-b27d-443b-a0fd-6cc6debbcdcf-MrJacobsSanIsidro-PE-ProvinciaDeLima-Lima-SanIsidro-Fresha.jpg?class=width-small',
      registrationDate: '20/10/2024',
      openingHours: [
        { day: 'sunday', open: 36000, close: 61200 },
        { day: 'monday', open: 32400, close: 68400 },
        { day: 'tuesday', open: 32400, close: 68400 },
        { day: 'wednesday', open: 32400, close: 68400 },
        { day: 'thursday', open: 32400, close: 68400 },
        { day: 'friday', open: 32400, close: 68400 },
        { day: 'saturday', open: 36000, close: 61200 }
      ]
    }
  ]
}
