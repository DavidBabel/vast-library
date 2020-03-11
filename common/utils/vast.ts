import { Element, xml2js } from "xml-js";
import VastElement from "../vast-element";

import { fetchUrl } from "../utils/fetch";
import { warnOrThrow } from "./logs";

export function buildVast(current: Element, currentTag: VastElement<any>) {
  /* istanbul ignore next */
  if (current && current.elements) {
    if (
      current.elements.length === 1 &&
      (current.elements[0].text || current.elements[0].cdata)
    ) {
      const currentTmp = current.elements[0];
      const currentText = String(currentTmp.text || currentTmp.cdata);
      currentTag.content = currentText;
    } else {
      let currentChild: VastElement<any>;
      for (let i = 0; i < current.elements.length; i++) {
        const currentTmp: Element = current.elements[i];
        // TODO refacto attachCustomTag from real tag for better integration
        // and fallback on dangerous
        currentChild = currentTag.attachCustomTag(
          currentTmp.name,
          currentTmp.attributes as any
        );
        buildVast(currentTmp, currentChild);
      }
    }
  }
}

// TODO this is only exported for test, it should not be
export function createVastWithBuilder(
  vastRawCode: string,
  options: VastParserOptions = {}
) {
  options = {
    logWarn: false,
    ...options
  };
  let parsedXml: Element;
  try {
    parsedXml = xml2js(vastRawCode) as Element;
  } catch (e) {
    warnOrThrow(
      `Error during the vast parsing, it seems not valid XML`,
      options
    );
  }

  return createVastFromJson(parsedXml);
}

function createVastFromJson(
  vastJsonCode: Element,
  options: VastParserOptions = {}
) {
  options = {
    logWarn: false,
    ...options
  };

  const root = new VastElement();
  root.parseOptions(options);

  buildVast(vastJsonCode, root);

  return root;
}

type Vasts = Array<VastElement<any>>;

export function downloadVastAndWrappersSync(
  vastUrl: string,
  options: VastParserOptions
): Vasts {
  const vastAndWrappers: Vasts = [];
  let currentVast: VastElement<any>;

  do {
    const vastRawContent = fetchUrl({ url: replaceMacros(vastUrl, options.macrosToReplace), syncInBrowser: true });
    currentVast = createVastWithBuilder(vastRawContent as any);
    vastAndWrappers.push(currentVast);
    if (currentVast.isWrapper()) {
      const VASTAdTagURI = currentVast.get(["VASTAdTagURI"])[0];
      if (VASTAdTagURI) {
        vastUrl = VASTAdTagURI.getContent();
      }
    }
  } while (currentVast.isWrapper());

  return vastAndWrappers;
}

export function replaceMacros(vastUrl: string, macrosToReplace: Macro[] = []): string {
  return macrosToReplace.reduce((acc, {key, value})=>acc.replace(new RegExp( `(#{|\\[)${key}(}|\\])`), value), vastUrl);
}

export function downloadVastAndWrappersAsync(
  vastUrl: string,
  options: VastParserOptions,
  callback: (vasts: Vasts) => void,
  actualDownloadedVasts?: Vasts
): void {
  const vastAndWrappers: Vasts = actualDownloadedVasts || [];
  let currentVast: VastElement<any>;

  fetchUrl({
    loadCallback: vastRawContent => {
      currentVast = createVastWithBuilder(vastRawContent);
      vastAndWrappers.push(currentVast);
      if (currentVast.isWrapper()) {
        const VASTAdTagURI = currentVast.get(["VASTAdTagURI"])[0];
        if (VASTAdTagURI) {
          vastUrl = VASTAdTagURI.getContent();
        }
        downloadVastAndWrappersAsync(
          vastUrl,
          options,
          callback,
          vastAndWrappers
        );
      } else {
        callback(vastAndWrappers);
      }
    },
    syncInBrowser: true,
    url: replaceMacros(vastUrl, options.macrosToReplace)
  });
}
