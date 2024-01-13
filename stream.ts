import { Transform } from 'stream';
import { User } from './types';

type TransformCallback = (error?: Error | null, data?: any) => void;

export class UserTransform extends Transform {
    accumulatedData: User[];
    constructor() {
        super({
            objectMode: true,
            writableObjectMode: true,
            readableObjectMode: true,
        });
        this.accumulatedData = [];
    }

    _transform(chunk: User[], _enc: string, callback: TransformCallback) {
        for (const user of chunk) {
            user.first_name = user.first_name.toUpperCase();
            this.accumulatedData.push(user);
        }
        callback();
    }

    _flush(callback: TransformCallback) {
        const finalData = JSON.stringify(this.accumulatedData, null, 2);
        this.push(finalData);
        callback();
    }
}
