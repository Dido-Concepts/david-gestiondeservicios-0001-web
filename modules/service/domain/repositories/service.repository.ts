export abstract class ServiceRepository {
    abstract createService(param: {
        service_name: string;
        category_id: number;
        price: number;
        duration: number;
        description?: string;
    }): Promise<string>;

    abstract updateService(param: {
        service_id: number;
        service_name: string;
        category_id: number;
        price: number;
        duration: number;
        description?: string;
    }): Promise<string>;

    abstract deleteService(param: {
        service_id: number;
    }): Promise<boolean>;
}
