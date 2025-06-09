// Definição do tipo Pagination

export interface Pagination<T> {
	items: T[];
	meta: {
		page: number;
		limit: number;
		total: number;
		pages: number;
	}
}