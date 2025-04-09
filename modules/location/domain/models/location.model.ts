// En un archivo de tipos compartidos o donde definas ScheduleDayModel
export type DayOfWeek = 'Lunes' | 'Martes' | 'Miercoles' | 'Jueves' | 'Viernes' | 'Sabado' | 'Domingo';

export type ScheduleDayModel = {
  day: DayOfWeek;
  ranges: {
    start: string;
    end: string;
  }[];
}

export type LocationModel = {
  id: number;
  name: string;
  address: string;
  phone: string;
  imageUrl: string;
  review: string;
  registrationDate: Date;
  status: boolean;
  openingHours: ScheduleDayModel[];
};
