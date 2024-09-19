const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const retryFetch = async (
  url: string,
  options: RequestInit = {},
  retries = 3,
  backoff = 300
): Promise<Response> => {
  try {
    return await fetch(url, options);
  } catch (error) {
    if (retries === 0) {
      throw error;
    }
    await wait(backoff);
    return retryFetch(url, options, retries - 1, backoff * 2);
  }
};