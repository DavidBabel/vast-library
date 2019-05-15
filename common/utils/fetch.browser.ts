interface FetchOptions {
  url: string;
  loadCallback?: (response: string) => void;
  syncInBrowser?: boolean;
}

export function fetchUrl({
  url,
  loadCallback = () => { },
  syncInBrowser = false
}: FetchOptions) {
  if (!url) {
    throw new Error("'url' is undefined");
  }
  const fail = () => {
    throw new Error(`${url} fetch failed`);
  };

  const fetchReq = new XMLHttpRequest();
  if (syncInBrowser) {
    fetchReq.open("GET", url, false);
    fetchReq.send();
    if (fetchReq.status >= 200 && fetchReq.status < 400) {
      loadCallback(fetchReq.responseText);
      return fetchReq.responseText;
    } else {
      fail();
    }
  } else {
    fetchReq.open("GET", url, true);
    fetchReq.onerror = fail;
    fetchReq.onload = res => {
      loadCallback((res as any).responseText);
    };
    fetchReq.send();
  }
}
