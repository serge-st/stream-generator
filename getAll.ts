import { ServerResponse } from 'http';
import { Transform } from 'stream';
import { getAllUsers } from './usersGenerator';
import { User } from './types';

export async function getAll(res: ServerResponse) {
    const usersStream = new Transform({
        objectMode: true,
        writableObjectMode: true,
        readableObjectMode: true,
        transform(chunk: User[], _enc, callback) {
            for (const user of chunk) {
                user.first_name = user.first_name.toUpperCase();
            }
            callback(null, JSON.stringify(chunk, null, 2));
        },
    });
    const users = getAllUsers();
    for await (const chunk of users) {
        usersStream.write(chunk);
    }
    usersStream.end();

    usersStream.pipe(res);
}
