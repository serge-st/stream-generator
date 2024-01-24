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
            chunk.forEach(user => {
                const result = script.runInNewContext({ data: user });
                if (result.constructor.name === 'Array') {
                    result.forEach((item: any) => this.push(item));
                    // result.forEach((item: any) => this.push(JSON.stringify(item)));
                } else {
                    this.push(user);
                    // this.push(JSON.stringify(user));
                }
            });
            callback()
        },
    });
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
