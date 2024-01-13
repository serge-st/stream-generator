import { ServerResponse } from 'http';
import { UserTransform } from './stream';
import { getAllUsers } from './usersGenerator';

export async function getAllInOneArray(res: ServerResponse): Promise<void> {
    const usersStream = new UserTransform();
    const users = getAllUsers();
    for await (const chunk of users) {
        usersStream.write(chunk);
    }
    usersStream.end();

    usersStream.pipe(res);
}
