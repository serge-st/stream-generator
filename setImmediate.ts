// * Event Loop sequence:

// * 1. Call stack
// * 2. Microtask queue (ALL)
// * 3. Macrotask queue (Just one)
// * ^^^ Repeat

// * Sync callstack
console.log('log 1');
// * Macrotask queue
setImmediate(() => console.log('log 2'));
// * Macrotask queue
setTimeout(() => {
    console.log('log 3 setTimeout 0ms')
    // * Microtask queue -> Immediately after log 3
    new Promise<void>(res => res()).then(() => console.log('log 4'))
    // * Microtask queue -> Immediately after log 4
    new Promise<void>(res => res()).then(() => console.log('log 5'))
    // * Macrotask queue
    setTimeout(() => console.log('log 6 setTimeout 1ms'), 1);
}, 0);
// * Microtask queue
queueMicrotask(() => console.log('log 7'))
// * Macrotask queue
setTimeout(() => console.log('log 8 setTimeout 1ms'), 1);
// * Macrotask queue
setImmediate(() => console.log('log 9'));
// * Microtask queue
new Promise<void>(res => res()).then(() => console.log('log 10'))
// * Next tick queue -> Immediately after Loop 1 call stack is empty
process.nextTick(() => console.log('log 11'));
// * Sync callstack
console.log('log 12')

// * A way to execute some piece of code asynchronously, but as soon as possible.
// * Any function passed as the setImmediate() argument is a callback that's executed in the next iteration of the event loop .