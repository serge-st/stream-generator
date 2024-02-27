import chalk from 'chalk';

// * Event Loop sequence:

// * 1. Call stack
// * 2. Microtask queue (ALL)
// * 3. Macrotask queue (Just one)
// * ^^^ Repeat

// * Sync callstack
console.log(chalk.blue('sync'), chalk.dim('log 1'));
// * Macrotask queue
setImmediate(() => console.log(chalk.dim.cyan('setImmediate'), chalk.yellow('macrotask'), chalk.dim('log 2')));
// * Macrotask queue
setTimeout(() => {
    console.log(chalk.blue('sync'), 'inside', chalk.yellow('macrotask'), chalk.dim('log 3 setTimeout 0ms'))
    // * Microtask queue -> Immediately after log 3
    new Promise<void>(res => res()).then(() => console.log(chalk.dim.cyan('Promise'), chalk.cyan('microtask'), 'inside', chalk.yellow('macrotask'), chalk.dim('log 4')))
    // * Microtask queue -> Immediately after log 4)
    new Promise<void>(res => res()).then(() => console.log(chalk.dim.cyan('Promise'), chalk.cyan('microtask'), 'inside', chalk.yellow('macrotask'), chalk.dim('log 5')))
    // * Macrotask queue
    setTimeout(() => console.log(chalk.dim.cyan('setTimeout'), chalk.yellow('macrotask'), 'inside', chalk.yellow('macrotask'), chalk.dim('log 6 setTimeout 1ms')), 1);
}, 0);
// * Microtask queue
queueMicrotask(() => console.log(chalk.dim.cyan('queueMicrotask'), chalk.cyan('microtask'), chalk.dim('log 7')))
// * Macrotask queue
setTimeout(() => console.log(chalk.dim.cyan('setTimeout'), chalk.yellow('macrotask'), chalk.dim('log 8 setTimeout 1ms')), 1);
// * Macrotask queue
setImmediate(() => console.log(chalk.dim.cyan('setImmediate'), chalk.yellow('macrotask'), chalk.dim('log 9')));
// * Microtask queue
new Promise<void>(res => res()).then(() => console.log(chalk.dim.cyan('Promise'), chalk.cyan('microtask'), chalk.dim('log 10')))
// * Next tick queue -> Immediately after Loop 1 call stack is empty
process.nextTick(() => console.log(chalk.magenta('process.nextTick'), chalk.dim('log 11')));
// * Sync callstack
console.log(chalk.blue('sync'), chalk.dim('log 12'))

// * A way to execute some piece of code asynchronously, but as soon as possible.
// * Any function passed as the setImmediate() argument is a callback that's executed in the next iteration of the event loop .