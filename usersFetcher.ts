import axios from 'axios';
import { UsersResponse } from './types';

export async function fetchData(pageNumber: number): Promise<UsersResponse> {
    const response = await axios.get<UsersResponse>(`https://reqres.in/api/users?per_page=2&page=${pageNumber}`);
    const data = response.data;
    return data;
}