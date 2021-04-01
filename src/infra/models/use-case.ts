export interface UseCase<T, R> {
  handle(dto: T): Promise<R>;
}
