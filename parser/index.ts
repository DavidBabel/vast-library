import * as flatten from "array-flatten";
import { isNode } from "browser-or-node";
import { isNull } from "../common/utils/checks";
import { warnOrThrow } from "../common/utils/logs";
import {
  createVastWithBuilder,
  downloadVastAndWrappersAsync,
  downloadVastAndWrappersSync
} from "../common/utils/vast";
import VastElement from "../common/vast-element";

type VastElements = Array<VastElement<any>>;

export default class VastParser {
  private options: VastParserOptions;
  private vasts: VastElements;

  constructor(options: VastParserOptions = {}) {
    this.options = options;
    this.vasts = [];
  }

  /**
   * Usefull for tests, this method does not fetch anything. You can add wrappers and inlines manually.
   */
  public addVastWithoutFetching(vastXML: string) {
    this.vasts.push(createVastWithBuilder(vastXML));
  }

  public cleanVasts() {
    this.vasts = [];
  }

  public parseAsync(vastUrl: string, callback: (self: this) => void) {
    this.cleanVasts();
    downloadVastAndWrappersAsync(
      vastUrl,
      this.options,
      (vasts: VastElements) => {
        this.vasts = vasts;
        callback(this);
      }
    );
  }

  public parseSync(vastUrl: string): this {
    this.cleanVasts();
    if (isNode) {
      throw new Error("parseSync is only available in a browser context");
    }
    this.vasts = downloadVastAndWrappersSync(vastUrl, this.options);
    return this;
  }

  public getVasts(): VastElements {
    return this.vasts || [];
  }

  public getVastElements(
    arrayOfTagNames: /* PossibleTag[] */ string[]
  ): VastElements {
    const vastElements = (flatten(
      this.vasts.map(v => v.get(arrayOfTagNames, true))
    ) as unknown) as VastElements;

    return vastElements;
  }

  public getContents(arrayOfTagNames: /* PossibleTag[] */ string[]): string[] {
    return this.getVastElements(arrayOfTagNames).map(vastElement => {
      if (isNull(vastElement.content)) {
        warnOrThrow(`${vastElement.name} does not have content`, this.options);
      }
      return vastElement.content;
    });
  }

  public getAttributes(
    arrayOfTagNames: /* PossibleTag[] */ string[],
    attribute: string
  ): string[] {
    return this.getVastElements(arrayOfTagNames).map(vastElement => {
      const attributeLowerCased = {};
      Object.keys(vastElement.attrs).forEach(attr => {
        attributeLowerCased[attr.toLowerCase()] = vastElement.attrs[attr];
      });
      if (isNull(attributeLowerCased[attribute.toLowerCase()])) {
        warnOrThrow(`${vastElement.name} does not have content`, this.options);
      }
      return attributeLowerCased[attribute.toLowerCase()];
    });
  }
}
