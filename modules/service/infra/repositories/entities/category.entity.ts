import { ServiceEntity } from '@/modules/service/infra/repositories/entities/service.entity'

export interface CategoryEntity {
    category_id: number;
    category_name: string;
    description?: string ;
    insert_date: Date;
    services: ServiceEntity[];
}
