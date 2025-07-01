export interface ServiceModel {
    id: number;
    name: string;
    description?: string;
    category_id: number;
    price: number;
    duration?: number;
    createdAt: Date;
}

export type ServiceResponseModel = {
  service_id: number;
  service_name?: string;
  duration_minutes?: number;
  price?: number;
  description?: string;
  category_id?: number;
  category_name?: string;
  category_description?: string;
  sede_id?: number;
  sede_name?: string;
  sede_telefono?: string;
  sede_direccion?: string;
  insert_date?: string;
  update_date?: string;
  user_create?: string;
  user_modify?: string;
}
