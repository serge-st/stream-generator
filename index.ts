import { createServer } from 'http';
import { usersStream } from './stream';
import { getAllUsers } from './usersGenerator';

const server = createServer();

server.on('request', async (_req, res) => {
    const users = getAllUsers();
    for await (const chunk of users) {
        usersStream.write(chunk);
    }
    usersStream.end();

    usersStream.pipe(res);
    // TODO: fix reset
    res.on('finish', () => {
        usersStream.reset();
    });
});

server.listen(8000);
console.log('Listening on port 8000...');