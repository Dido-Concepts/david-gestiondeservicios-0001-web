export type OpeningHour = {
  id_OpeningHour: number;
  day: string;
  open: string;
  close: string;
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
  openingHours: OpeningHour[];
};
