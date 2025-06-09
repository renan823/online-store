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

export function filenameSplit(img: string) {
	const parts = img.split("/");

	return parts[parts.length - 1];
}

export function currentMonth(): string {
	const month = new Date().getMonth() + 1;

	return month < 10 ? `0${month}` : `${month}`
}

export function currentYear(): string {
	return `${new Date().getFullYear()}`;
}