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
  const fail = () => {
    throw new Error(`${url} fetch failed`);
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
      fail();
    }
    loadCallback(body);
  });
}
