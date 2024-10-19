export type MetaPaginatedItemsViewModel = {
    page: number,
    pageSize: number,
    pageCount: number,
    total: number
}

export type PaginatedItemsViewModel<T> ={
    data: T[],
    meta: MetaPaginatedItemsViewModel
}
