import { FileApiEntity } from '@/modules/share/infra/entities/file/file.entity'

export type LocationsEntity = {
    id: number
    name_location: string
    phone_location: string
    address_location: string
    location_review: string
    insert_date: Date
    annulled: boolean
    url: string
    filename: string
    content_type: string
    size: number
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

export interface ScheduleDayEntity {
    day: string;
    ranges: {
      start: string;
      end: string;
    }[];
  }
