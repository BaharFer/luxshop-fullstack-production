const RENDER_ORIGIN =
  'https://luxshop-fullstack-production.onrender.com';

const PROXY_PREFIXES = ['/api/', '/uploads/'];

export interface Env {
  ASSETS: {
    fetch(request: Request): Promise<Response>;
  };
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    const shouldProxy = PROXY_PREFIXES.some((prefix) =>
      url.pathname.startsWith(prefix)
    );

    if (!shouldProxy) {
      return env.ASSETS.fetch(request);
    }

    const targetUrl = new URL(
      url.pathname + url.search,
      RENDER_ORIGIN
    );

    const headers = new Headers(request.headers);

    headers.delete('host');

    const proxiedRequest = new Request(targetUrl.toString(), {
      method: request.method,
      headers,
      body:
        request.method === 'GET' || request.method === 'HEAD'
          ? undefined
          : request.body,
      redirect: 'manual',
    });

    return fetch(proxiedRequest);
  },
};