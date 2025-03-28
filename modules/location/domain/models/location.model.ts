export type ScheduleDayModel = {
  day: string;
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
