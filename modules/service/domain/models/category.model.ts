import { ServiceModel } from '@/modules/service/domain/models/service.model'

export type CategoryModel = {
    id: string;
    name: string;
    description?: string;
    createdAt: Date;
    services: ServiceModel[];
}

export type CategoryCatalogModel = {
    category_id: number;
    sede_id: number;
    category_name: string;
    description?: string;
    created_at: Date;
}
