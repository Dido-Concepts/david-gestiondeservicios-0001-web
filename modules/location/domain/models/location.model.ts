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

export type LocationBodyModel = {
  id: number;
  name: string;
  phone?: string;
  address?: string;
  registrationDate: string;
  fileId?: number;
  review: string;
  status: boolean;
};

export type LocationResponseModel = {
  id: number;
  nombre_sede?: string;
  telefono_sede?: string;
  direccion_sede?: string;
  insert_date?: string;
  update_date?: string;
  user_create?: string;
  user_modify?: string;
  review_location?: string;
  status?: boolean;
  file?: {
    id: number;
    url: string;
    filename: string;
    content_type: string;
    size: number;
    insert_date: string;
    update_date?: string;
  };
}
