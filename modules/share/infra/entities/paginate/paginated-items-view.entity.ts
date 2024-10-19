export type MetaPaginatedItemsViewEntity = {
    page: number,
    page_size: number,
    page_count: number,
    total: number
}

export type PaginatedItemsViewEntity<T> ={
    data: T[],
    meta: MetaPaginatedItemsViewEntity
}
