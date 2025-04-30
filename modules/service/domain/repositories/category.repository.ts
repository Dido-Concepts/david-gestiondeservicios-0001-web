import { CategoryModel } from '@/modules/service/domain/models/category.model'

export abstract class CategoryRepository {
    abstract getCategory(param: { location?: string}): Promise<CategoryModel[]>;
    abstract createCategory(param: { name_category: string; description_category: string; location_id: number }): Promise<string>;
}
