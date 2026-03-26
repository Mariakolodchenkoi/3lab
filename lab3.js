function memoize(fn,{maxSize = Infinity, strategy = 'LRU', expireTime = null} = {}) {
    const cache = new Map();
    const usage = new Map();

    return (...args) => {
        const key = JSON.stringify(args);
        const now = Date.now();

        if (cache.has(key)) {
            const entry = cache.get(key);
            if (expireTime && (now - entry.time > expireTime)) {
                cache.delete(key);
            } else {
                usage.set(key, (usage.get(key) || 0) +1);
                if (strategy === 'LRU') { cache.delete(key); cache.set(key,entry);}
                return entry.value;
            }
        }
        
        const result = fn(...args);
        if (cache.size >= maxSize) {
            let victim = cache.keys().next().value;
            if (strategy === 'LFU') {
                victim = [...usage].reduce((a,b) => (a[1] < b[1]? a:b))[0];
            }
            
            cache.delete(victim);
            usage.delete(victim);
        }

        cache.set(key, { value: result, time: now });
        usage.set(key, 1);
        return result;
    };
}

const fib = memoize((n) => {
    if (n <= 1) return n;
    return fib(n - 1) + fib(n - 2);
}, 
{ maxSize: 100, strategy: 'LRU'});

console.time("Calculation");
console.log(`Fib(30) = ${fib(30)}`);
console.timeEnd("Calculation");

console.time("From cache");
console.log(`Fib(30) = ${fib(30)}`);
console.timeEnd("From cache");

