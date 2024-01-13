import { ServerResponse } from 'http';
import { UserTransform } from './stream';
import { getAllUsers } from './usersGenerator';

export async function getAllInOneArray(res: ServerResponse): Promise<void> {
    const usersStream = new UserTransform();
    const users = getAllUsers();
    let waitingForDrain = false;

    for await (const chunk of users) {
        const shouldContinue = usersStream.write(chunk);
        if (!shouldContinue && !waitingForDrain) {
            waitingForDrain = true;
            await new Promise<void>(resolve => usersStream.once('drain', () => {
                waitingForDrain = false;
                resolve();
            }));
        }
    }
    usersStream.end();

    usersStream.pipe(res);
}
