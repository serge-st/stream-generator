import { fetchData } from './usersFetcher';
import { User } from './types';

export async function* getAllUsers(): AsyncIterableIterator<User[]> {
    let page = 1;
    let totalPages: null | number = null;

    while (totalPages === null || page <= totalPages) {
        try {
            const response = await fetchData(page);
            totalPages = response.total_pages;
            page++;
            yield response.data;
        } catch (error) {
            console.error(error);
        }
    }
}
