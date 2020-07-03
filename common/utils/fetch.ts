interface FetchOptions {
  url: string;
  loadCallback?: (response: string, error?: Error) => void;
  syncInBrowser?: boolean;
  userAgent?: string;
  timeout?: number;
}

export function fetchUrl({
  url,
  loadCallback = () => {},
  syncInBrowser = false,
  userAgent,
  timeout
}: FetchOptions) {
  if (!url) {
    throw new Error("'url' is undefined");
  }

  const request = require("request");

  const options: { headers?: {}, timeout?: number } = {};

  if (userAgent) {
    options.headers = {
      'User-Agent': userAgent
    };
  }

  if (timeout) {
    options.timeout = timeout;
  }

  request(url, options, (error, response, body) => loadCallback(body, error));
}
