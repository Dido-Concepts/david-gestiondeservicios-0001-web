import { CustomerStatus } from '@/modules/customer/domain/models/customer.model'

export interface CustomerEntity {
    id: number;
    name_customer: string;
    email_customer: string;
    phone_customer: string;
    birthdate_customer: Date;
    status_customer: CustomerStatus
    annulled: boolean;
    insert_date: Date; // ISO date string
    update_date: Date | null; // ISO date string or null
    user_create: string;
    user_modify: string | null;
}
