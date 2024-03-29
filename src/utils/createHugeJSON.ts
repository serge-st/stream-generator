import fs from 'fs';
import { v4 as uuid } from 'uuid';
import { User } from '../common/types';

export type TestUser = Pick<User, 'id' | 'first_name' | 'comment'>;

const file = fs.createWriteStream('./medium.json');
const NUMBER_OF_USERS = 10000;

for (let i = 0; i <= NUMBER_OF_USERS; i++) {
    if (i === 0) {
        file.write('[\n');
    }

    const user: TestUser = {
        id: i + 1,
        first_name: uuid(),
        comment: '',
    };

    if (i === NUMBER_OF_USERS - 1) {
        file.write(`  ${JSON.stringify(user)}\n`);
        file.write(']');
        break;
    }
    file.write(`  ${JSON.stringify(user)},\n`);
}

file.end();