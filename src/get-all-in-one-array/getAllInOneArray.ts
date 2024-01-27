import { ServerResponse } from 'http';
import { UserTransform } from './stream';
import { getAllUsers } from '../common/usersGenerator';

export async function getAllInOneArray(res: ServerResponse): Promise<void> {
    const usersStream = new UserTransform();
    const users = getAllUsers();
    let waitingForDrain = false;
    let shouldContinue = true;

    for await (const chunk of users) {
        shouldContinue = usersStream.write(chunk);
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
