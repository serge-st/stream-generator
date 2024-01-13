import axios from 'axios';
import { UsersResponse } from './types';

const apiURL = 'https://reqres.in/api/users?per_page=2&page=';
const localApiURL = 'http://localhost:4000/test-data?page=';

export async function fetchData(pageNumber: number): Promise<UsersResponse> {
    const response = await axios.get<UsersResponse>(`${localApiURL}${pageNumber}`);
    const data = response.data;
    return data;
}