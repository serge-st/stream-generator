export type User = {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    avatar: string;
    comment?: string;
}

export type UsersResponse = {
    page: number;
    per_page: number;
    total: number;
    total_pages: number;
    data: User[];
}
