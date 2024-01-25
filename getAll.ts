import { ServerResponse } from 'http';
import { Transform } from 'stream';
import { getAllUsers } from './usersGenerator';
import { User } from './types';
import { Transform as J2CTransform } from '@json2csv/node';
import { Script } from 'vm';

export async function getAll(res: ServerResponse) {
    const code = `(data) => {
        data.first_name = data.first_name.toUpperCase();
        data.group_id = data.id;
        if (!!data?.iid?.length) {
            let res = data.iid.map(iid => ({
                id: iid,
                first_name: data.first_name.toUpperCase(),
                group_id: data.id
            }));
            return res;
        }
        return data;
    }`
    const script = new Script(`(${code})(data)`);

    const highWaterMark = 200;

    const usersStream = new Transform({
        objectMode: true,
        highWaterMark,
        transform(chunk: User[], _enc, callback) {
            try {
                chunk.forEach(user => {
                    const result = script.runInNewContext({ data: user });
                    if (result.constructor.name === 'Array') {
                        result.forEach((item: any) => this.push(item));
                    } else {
                        this.push(result);
                    }
                });
                callback()
            } catch (error) {
                callback(error as Error);
            }
        },
    });

    // * All events are usually emitted in the following order:
    // Resume - stream started
    usersStream.on('resume', () => console.log(`stream started`));
    // Data - every peace of data pushed from the transoform callback
    usersStream.on('data', (chunk) => console.log(`data: ${JSON.stringify(chunk)}`));
    // End - this event is emitted when there is no more data to be consumed from the stream.
    // For a Readable stream, it signals that the stream has been completely read.
    usersStream.on('end', () => console.log(`stream ended`));
    // Finish - this event is emitted after the stream.end() method has been called
    // and all data has been flushed to the underlying system.
    // This is relevant for Writable streams.
    // It signals that all the data has been supplied to the stream (using the write() method) and the stream is done writing it.
    usersStream.on('finish', () => console.log(`stream finished`));
    // Close - this event is emitted when the stream and any of its underlying resources (a file descriptor, for example) have been closed. 
    // The event indicates that no more events will be emitted, and no further computation will occur.
    usersStream.on('close', () => console.log(`stream closed`));
    // Error - this event is emitted whenever an error is passed to stream callback as first argument.
    usersStream.on('error', (error: unknown) => console.log(`error: ${error}`));

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
