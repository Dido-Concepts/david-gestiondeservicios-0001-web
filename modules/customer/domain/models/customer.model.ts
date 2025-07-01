export type CustomerStatus = 'active' | 'blocked';

export interface CustomerModel {
    id: number;
    name: string;
    email: string;
    phone: string;
    birthDate: Date;
    status: CustomerStatus;
    createdAt: Date;
}

export type CustomerResponseModel = {
  id: number;
  name_customer?: string;
  email_customer?: string;
  phone_customer?: string;
  birthdate_customer?: string;
  status_customer?: CustomerStatus;
  insert_date?: string;
  update_date?: string;
  user_create?: string;
  user_modify?: string;
}
