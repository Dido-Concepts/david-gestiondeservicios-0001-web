import { ServiceModel } from '@/modules/service/domain/models/service.model'

export type CategoryModel = {
    id: string;
    name: string;
    description?: string;
    createdAt: Date;
    services: ServiceModel[];
}
