interface FetchOptions {
  url: string;
  loadCallback?: (response: string) => void;
  syncInBrowser?: boolean;
  userAgent?: string;
}

export function fetchUrl({
  url,
  loadCallback = () => {},
  syncInBrowser = false,
  userAgent,
}: FetchOptions) {
  if (!url) {
    throw new Error("'url' is undefined");
  }
  const fail = (error, response) => {
    throw new Error(`${url} fetch failed. ${error.message}. ${(response && response.statusCode)}`);
  };

  const request = require("request");

  const options: { headers?: {} } = {};

  if (userAgent) {
    options.headers = {
      'User-Agent': userAgent
    };
  }

  request(url, options, (error, response, body) => {
    if (error) {
      fail(error, response);
    }
    loadCallback(body);
  });
}
