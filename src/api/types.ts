export type GetPaginatedDataPayload = {
  pageNumber: number,
  pageSize: number,
  sorting: string,
};

export type Paginated<T> = {
  items: T[]
  pageNumber: number
  pageSize: number
  totalCount: number
  totalPageCount: number
}

export type AgreementContentPayload = {
  id: number,
  file: File
}

export type AgreementsPayload = { view: 'accepted' | 'missing', clientId: string };
