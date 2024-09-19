type Interceptor = (config: RequestInit) => RequestInit;

const requestInterceptors: Interceptor[] = [];
const responseInterceptors: Interceptor[] = [];

export const addRequestInterceptor = (interceptor: Interceptor) => {
  requestInterceptors.push(interceptor);
};

export const addResponseInterceptor = (interceptor: Interceptor) => {
  responseInterceptors.push(interceptor);
};

export const interceptedFetch = async (url: string, options: RequestInit = {}) => {
  let config = { ...options };

  for (const interceptor of requestInterceptors) {
    config = interceptor(config);
  }

  let response = await fetch(url, config);

  for (const interceptor of responseInterceptors) {
    response = new Response(response.body, interceptor(response));
  }

  return response;
};