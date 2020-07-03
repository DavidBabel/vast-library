interface FetchOptions {
  url: string;
  loadCallback?: (response: string) => void;
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
  const fail = (error, response) => {
    throw new Error(`${url} fetch failed. ${error.message}. ${(response && response.statusCode)}`);
  };

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

  request(url, options, (error, response, body) => {
    if (error) {
      fail(error, response);
    }
    loadCallback(body);
  });
}
