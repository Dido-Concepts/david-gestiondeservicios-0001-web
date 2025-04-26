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
