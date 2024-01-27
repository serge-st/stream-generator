import { createServer } from 'http';
import url from "url";
import { getAllInOneArray } from './src/get-all-in-one-array/getAllInOneArray';
import { getAll } from './src/get-all/getAll';
import { progressAPI } from './src/progress-api/progressAPI'

const server = createServer();

server.on('request', async (req, res) => {
    if (!req.url) return;
    const reqUrl = url.parse(req.url).pathname;

    switch (reqUrl) {
        case '/progress': {
            console.log('GET /progress')
            // TODO: is there an actual way to create a new Progress instance for each stream and get it here?
            res.end(progressAPI.getProgress());
            break;
        }
        case '/all-parsed': {
            console.log('GET /all-parsed')
            getAll(res);
            console.log('GET /all-parsed finished')
            break;
        }
        case '/all-in-one-array': {
            console.log('GET /all-in-one-array')
            getAllInOneArray(res);
            console.log('GET /all-in-one-array finished')
            break;
        }
        default: {
            console.log('GET /')
            res.end(`
                <h1>Available endpoints:</h1>
                <ul>
                    <li>/progress</li>
                    <li>/all-parsed</li>
                    <li>/all-in-one-array</li>
                </ul>
            `);
        }
    }
});

server.listen(8000);
console.log('TESTING API is listening on port 8000...');