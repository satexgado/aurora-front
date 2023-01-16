export interface InfiniteScrollable {
  page: number;
  per_page: number;

  onScroll(event: any): void;
}
