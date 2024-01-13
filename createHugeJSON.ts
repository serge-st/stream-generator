import fs from 'fs';
import { v4 as uuid } from 'uuid';
import { User } from './types';

type TestUser = Pick<User, 'id' | 'first_name'>;

const file = fs.createWriteStream('./huge.json');
const NUMBER_OF_USERS = 1e6;

for (let i = 0; i <= NUMBER_OF_USERS; i++) {
    if (i === 0) {
        file.write('[\n');
    }

    const user: TestUser = {
        id: i + 1,
        first_name: uuid()
    };

    if (i === NUMBER_OF_USERS - 1) {
        file.write(`  ${JSON.stringify(user)}\n`);
        file.write(']');
        break;
    }
    file.write(`  ${JSON.stringify(user)},\n`);
}

file.end();