// rateLimit.ts
const rateLimiter = (limit: number, interval: number) => {
  let requests = 0;
  let startTime = Date.now();

  return async (fn: () => Promise<any>) => {
    const now = Date.now();
    if (now - startTime > interval) {
      requests = 0;
      startTime = now;
    }

    if (requests >= limit) {
      throw new Error('Rate limit exceeded');
    }

    requests++;
    return fn();
  };
};

// // Usage example
// const limitedFetch = rateLimiter(5, 1000); // 5 requests per second

// const fetchWithRateLimit = async (url: string, options?: RequestInit) => {
//   try {
//     const response = await limitedFetch(() => fetch(url, options));
//     const data = await response.json();
//     console.log(data);
//   } catch (error) {
//     console.error(error);
//   }
// };
