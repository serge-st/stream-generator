console.log('setImmediate.ts');
setImmediate(() => console.log('setImmediate before timeouts'));
setTimeout(() => console.log('setTimeout 0ms'), 0);
setTimeout(() => console.log('setTimeout 1ms'), 1);
setImmediate(() => console.log('setImmediate after timeouts'));
console.log('setImmediate.ts end')
process.nextTick(() => console.log('nextTick'));

// * A way to execute some piece of code asynchronously, but as soon as possible.
// * Any function passed as the setImmediate() argument is a callback that's executed in the next iteration of the event loop .