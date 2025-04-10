export interface PaginationOptions {
  totalRows: number;
  perPage?: number;
  nextText?: string;
  prevText?: string;
}

export interface PaginationEmits {
  (event: 'change-page', page: number): void;
}
