export interface ServiceModel {
    id: number;
    name: string;
    description?: string;
    category_id: number;
    price: number;
    duration?: number;
    createdAt: Date;
}
