import { TestUser } from './createHugeJSON';
import { UsersResponse } from './types';

type TestUsersResponse = Omit<UsersResponse, 'data'> & {
    data: TestUser[];
};

export const paginateData = (data: TestUser[], page: number = 1, perPage: number = 10): TestUsersResponse => {
    const total = data.length;
    const totalPages = Math.ceil(total / perPage);
    const start = (page - 1) * perPage;
    const end = start + perPage;

    return {
        page,
        per_page: perPage,
        total,
        total_pages: totalPages,
        data: data.slice(start, end),
    };
};
