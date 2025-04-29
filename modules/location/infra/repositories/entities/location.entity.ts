import { FileApiEntity } from '@/modules/share/infra/entities/file/file.entity'

export type LocationsEntity = {
    id: number
    name_location: string
    phone_location: string
    address_location: string
    location_review: string
    insert_date: Date
    url: string
    filename: string
    content_type: string
    size: number
    status: boolean
};

export interface LocationByIdEntity {
    id: number;
    name_location: string;
    phone_location: string;
    address_location: string;
    insert_date: Date;
    file: FileApiEntity;
    location_review: string;
    schedules: ScheduleDayEntity[];
}

// En un archivo de tipos compartidos o donde definas ScheduleDayModel
export type DayOfWeekEntity = 'Lunes' | 'Martes' | 'Miercoles' | 'Jueves' | 'Viernes' | 'Sabado' | 'Domingo';

export interface ScheduleDayEntity {
    day: DayOfWeekEntity;
    ranges: {
      start: string;
      end: string;
    }[];
  }
