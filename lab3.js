function memoize(fn, options = {}) {
    const {maxSize = Infinity} = options;
    const cache = new Map();

    return function(...args) {
        const key = JSON.stringify(args);
        if (cache.has(key)) {
            return cache.get(key);
        }
        const result = fn(...args);
        if (cache.size >= maxSize) {
            const firstKey = cache.keys().next().value;
            cache.delete(firstKey);
        }
        cache.set(key, result);
        return result;
    };
}

const fib = memoize(function(n) {
    if (n <= 1) return n;
    return fib(n - 1) + fib(n - 2);
}, 
{ maxSize: 100 });