import { PassThrough, pipeline } from 'stream';

function* generatorFunction() {
    yield 1;
    yield 2;
    yield 3;
    return 4;
}

const iter = generatorFunction();

console.log(iter.next()); // { value: 1, done: false }
console.log(iter.next()); // { value: 2, done: false }
console.log(iter.next()); // { value: 3, done: false }
console.log(iter.next()); // { value: 4, done: true }

const iter2 = generatorFunction();

for (const val of iter2) {
    console.log(val); // Prints 1, 2, 3
}

const readable = new PassThrough({ objectMode: true });

readable.on('data', (chunk) => {
    console.log('Received:', chunk); // Prints 1, 2, 3
});

pipeline(generatorFunction(), readable, (err) => {
    if (err) {
        console.error('Pipeline failed:', err);
    }
})
