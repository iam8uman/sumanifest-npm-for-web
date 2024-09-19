const inFlightRequests = new Map<string, Promise<Response>>();

export const deduplicateFetch = (url: string, options: RequestInit = {}) => {
  const key = `${url}-${JSON.stringify(options)}`;

  if (!inFlightRequests.has(key)) {
    const request = fetch(url, options).finally(() => {
      inFlightRequests.delete(key);
    });
    inFlightRequests.set(key, request);
  }

  return inFlightRequests.get(key)!;
};