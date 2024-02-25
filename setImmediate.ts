// * Sync callstack
console.log('log 1');
// * Macrotask queue
setImmediate(() => console.log('log 2'));
// * Macrotask queue
setTimeout(() => {
    console.log('log 3 setTimeout 0ms')
    new Promise<void>(res => res()).then(() => console.log('log 4'))
}, 0);
// * Microtask queue
queueMicrotask(() => console.log('log 5'))
// * Macrotask queue
setTimeout(() => console.log('log 6 setTimeout 1ms'), 1);
// * Macrotask queue
setImmediate(() => console.log('log 7'));
// * Microtask queue
new Promise<void>(res => res()).then(() => console.log('log 8'))
// * Next tick queue
process.nextTick(() => console.log('log 9'));
// * Sync callstack
console.log('log 10')

// * A way to execute some piece of code asynchronously, but as soon as possible.
// * Any function passed as the setImmediate() argument is a callback that's executed in the next iteration of the event loop .