export interface ServiceEntity {
    service_id: number;
    service_name: string;
    duration_minutes?: number;
    price: number;
    description?: string;
    insert_date: Date;
    category_id: number;
}
