import invariant from "ts-invariant";

export function* paginateIterable<T>(
  iterable: Iterable<T>,
  { limit, offset }: { limit: number; offset: number },
): Iterable<T> {
  invariant(limit > 0);
  invariant(offset >= 0);

  let itemI = 0;
  let yieldedItemCount = 0;
  for (const item of iterable) {
    if (itemI++ >= offset) {
      yield item;
      if (++yieldedItemCount === limit) {
        return;
      }
    }
  }
}
