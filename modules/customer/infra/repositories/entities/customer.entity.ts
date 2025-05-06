import { CustomerStatus } from '@/modules/customer/domain/models/customer.model'

export interface CustomerEntity {
    id: number;
    name_customer: string;
    email_customer: string;
    phone_customer: string;
    birthdate_customer: string;
    status_customer: CustomerStatus
    insert_date: Date;
}
