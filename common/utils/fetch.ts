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

  const axios = require("axios").default;

  const config: { headers?: {}, timeout?: number } = {};

  if (userAgent) {
    config.headers = {
      'User-Agent': userAgent
    };
  }

  if (timeout) {
    config.timeout = timeout;
  }

  axios.get(url, config).then((response) => {
    let error;

    if (response.status !== 200) {
      error = new Error(`Status code error, statusCode: ${response.status}, url: ${url}`);
    }

    return loadCallback(response.data, error);
  }).catch((error) => {
    let message = error.message ? error.message : '';

    if (error.response && error.response.status) {
      message += `, statusCode: ${error.response.status}`;
    }

    message += `, url: ${url}`;

    error.message = message;

    return loadCallback(error.response && error.response.data || '', error);
  });
}
