import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export interface Pagination<T> {
	items: T[];
	meta: {
		page: number;
		limit: number;
		total: number;
		pages: number;
	}
}