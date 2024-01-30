import { ServerResponse } from 'http';
import { Transform } from 'stream';
import { getAllUsers } from '../common/usersGenerator';
import { User } from '../common/types';
import { Transform as J2CTransform } from '@json2csv/node';
import { Script } from 'vm';
import { progressAPI } from '../progress-api/progressAPI'

export async function getAll(res: ServerResponse) {
    const code = `(data) => {
        data.first_name = data.first_name.toUpperCase();
        data.group_id = data.id;
        if (!!data?.pointers?.length) {
            let res = data.pointers.map(pointer => ({
                id: pointer,
                first_name: data.first_name.toUpperCase(),
                group_id: data.id
            }));
            return res;
        }
        return data;
    }`
    const script = new Script(`(${code})(data)`);

    const highWaterMark = 200;

    const wait = (ms: number) => new Promise(res => setTimeout(res, ms));

    const usersStream = new Transform({
        objectMode: true,
        highWaterMark,
        // TODO try to implement some actual async logic here
        async transform(chunk: User[], _enc, callback) {
            // You can emit custom events from the stream
            // and then listen to them in the main thread with stream.on('starting-stream', () => console.log('starting stream'))
            if (progressAPI.chunksParsed === 0) this.emit('starting-stream')
            // await wait(1000);
            try {
                const usersWithComments: any[] = []

                for (const user of chunk) {
                    const startId = 25;
                    const endId = 185;

                    if (user.id >= startId && user.id <= endId) {
                        usersWithComments.push(user)
                    }
                }

                const comments = await Promise.all(usersWithComments.map(async user => {
                    const resp = await fetch(`https://jsonplaceholder.typicode.com/comments?id=${user.id}`)
                    return resp.json()
                }));

                for (const user of chunk) {
                    comments.flat().forEach((comment: any) => {
                        if (comment.id === user.id) user.comment = comment.name;
                    });

                    const result = script.runInNewContext({ data: user });
                    if (result.constructor.name === 'Array') {
                        result.forEach((item: any) => this.push(item));
                    } else {
                        this.push(result);
                    }
                }
                progressAPI.increment();
                callback()
            } catch (error) {
                callback(error as Error);
            }
        },
    });

    // * All events are usually emitted in the following order:
    // Resume - stream started
    usersStream.on('resume', () => console.log(`stream started`));
    usersStream.on('starting-stream', () => console.log(`starting stream custom event`));
    // Data - every peace of data pushed from the transoform callback
    usersStream.on('data', (chunk) => console.log(`data: ${JSON.stringify(chunk)}`));
    // End - this event is emitted when there is no more data to be consumed from the stream.
    // For a Readable stream, it signals that the stream has been completely read.
    usersStream.on('end', () => {
        console.log(`stream ended`)
    });
    // Finish - this event is emitted after the stream.end() method has been called
    // and all data has been flushed to the underlying system.
    // This is relevant for Writable streams.
    // It signals that all the data has been supplied to the stream (using the write() method) and the stream is done writing it.
    usersStream.on('finish', () => console.log(`stream finished`));
    // Error - this event is emitted whenever an error is passed to stream callback as first argument.
    usersStream.on('error', (error: unknown) => console.log(`error: ${error}`));
    // Pause - this event is emitted when the consumer of the stream stopped reading data from the stream.
    usersStream.on('pause', () => {
        console.log(`stream paused`);
    });
    // Close - this event is emitted when the stream and any of its underlying resources (a file descriptor, for example) have been closed. 
    // The event indicates that no more events will be emitted, and no further computation will occur.
    usersStream.on('close', () => {
        console.log(`stream closed`);
        console.log(`processed chunks: ${progressAPI.chunksParsed}`);
        // .destroy() method is used to close the stream and cleanup any underlying resources.
        // TODO: process stream destruction in a different callback
        // destroying the stream here can close it prematurely
        usersStream.destroy();
        progressAPI.reset();
    });
    // Readable - event is emitted when there is data available to be read from the stream, or when the stream has ended
    // usersStream.on('readable', () => {
    //     console.log(`stream readable`);
    //     let chunk;
    //     while (null !== (chunk = usersStream.read())) {
    //         console.log(`Received ${JSON.stringify(chunk)} `);
    //     }
    // });
    usersStream.on('drain', () => console.log(`stream drained`));
    usersStream.on('pipe', () => console.log(`stream piped`));
    usersStream.on('unpipe', () => console.log(`stream unpiped`));

    const parser = new J2CTransform({ header: true }, {}, { objectMode: true });
    usersStream.pipe(parser).pipe(res);

    const users = getAllUsers();

    let waitingForDrain = false;
    let shouldContinue = true;
    for await (const chunk of users) {
        shouldContinue = usersStream.write(chunk);
        if (!shouldContinue && !waitingForDrain) {
            waitingForDrain = true;
            console.log('waiting for drain'); // prints out only when highWaterMark is 1
            await new Promise<void>(resolve => usersStream.once('drain', () => {
                waitingForDrain = false;
                console.log('drained'); // prints out only when highWaterMark is 1
                resolve();
            }));
        }
    }

    usersStream.end();
}
