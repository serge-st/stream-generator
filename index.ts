import { createServer } from 'http';
import url from "url";
import { getAllInOneArray } from './getAllInOneArray';
import { getAll } from './getAll';

const server = createServer();

server.on('request', async (req, res) => {
    // @ts-ignore
    const reqUrl = url.parse(req.url).pathname;

    switch (reqUrl) {
        case '/t': {
            getAll(res);
            break;
        }
        default: {
            getAllInOneArray(res);
        }
    }
});

server.listen(8000);
console.log('Listening on port 8000...');