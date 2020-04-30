interface FetchUrlOptions {
  url: string;
  loadCallback: (response: string) => void;
  syncInBrowser: boolean;
  retries: number;
}

interface FetchUrlSyncOptions {
  url: string;
  retries?: number;
}

interface FetchUrlAsyncOptions {
  url: string;
  onError: (response: string) => void;
  onSuccess: (response: string) => void;
  retries?: number;
}

function fetchUrlSync({ url, retries = 2 }: FetchUrlSyncOptions) {
  let attempts = 0;

  while (attempts++ < retries) {
    try {
      const request = new XMLHttpRequest();
      request.open("GET", url, false);
      request.send();

      if (request.status >= 200 && request.status < 400) {
        return request.responseText;
      }
    } catch (e) {}
  }

  throw new Error(`${url} fetch failed after ${attempts} attempts`);
}

function fetchUrlAsync({ url, onError, onSuccess, retries = 2 }: FetchUrlAsyncOptions) {
  if (retries === 0) {
    onError(`${url} fetch failed after 3 attempts`);
    return;
  }

  const request = new XMLHttpRequest();
  request.open("GET", url, true);
  request.onerror = () => {
    fetchUrlAsync({
      onError,
      onSuccess,
      retries: retries - 1,
      url
    });
  };
  request.onload = res => {
    onSuccess((res as any).responseText);
  };
  request.send();
}

export function fetchUrl({
  url,
  loadCallback = () => {},
  syncInBrowser = false
}: FetchUrlOptions) {
  if (!url) {
    throw new Error("'url' is undefined");
  }
  if (syncInBrowser) {
    return fetchUrlSync({ url });
  } else {
    fetchUrlAsync({
      onError: () => {
        throw new Error(`${url} fetch failed`);
      },
      onSuccess: loadCallback,
      url
    });
  }
}
