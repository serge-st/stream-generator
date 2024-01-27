import { createServer } from 'http';
import url from "url";
import { paginateData } from './paginationAPI';
// import users from '../../small.json';
import users from '../../medium.json';
// import users from '../../huge.json';
import { TestUser } from '../utils/createHugeJSON';

const server = createServer();

server.on('request', async (req, res) => {
    if (!req.url) return;
    const parsedUrl = url.parse(req.url, true);
    const reqUrl = parsedUrl.pathname;
    const query = parsedUrl.query;

    switch (reqUrl) {
        case '/test-data': {
            const page = query.page ? parseInt(query.page as string, 10) : 1;

            const response = paginateData(users as TestUser[], page);
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(response, null, 2));
            break;
        }
        default: {
            res.end('Hello World');
        }
    }
});

server.listen(4000);
console.log('FAKE DATA SERVER us listening on port 4000...');