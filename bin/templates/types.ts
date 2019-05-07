import * as prettier from "prettier";

export function templateType(possibleTags: string[], possibleAttrs: string[]) {
  return prettier.format(
    `
    ///////////////////////////////////////////////////////
    //  IMPORTANT: this file is generated, dont edit it
    /////////

    type PossibleTags = "${possibleTags.join('" | "')}"

    type PossibleAttrs = "${possibleAttrs.join('" | "')}"

    `,
    {
      parser: "typescript"
    }
  );
}
