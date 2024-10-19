export interface UseCase<I, O> {
    execute(param: I): Promise<O>
}
