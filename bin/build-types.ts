/* tslint:disable: no-console object-literal-sort-keys */

import * as arrayUniq from "array-unique";
import * as fs from "fs-extra";
import * as yaml from "js-yaml";
import * as path from "path";

import { templateType } from "./templates/types";
import { extractAttrs, extractKeys } from "./utils/object";

let possibleTags = [];
let possibleAttrs = [];

const outputPath = "./@types";
const outputFileName = "vast.type.ts";
const specPath = "./specs";
fs.readdirSync(specPath)
  .map(x => path.join(specPath, x))
  .map(specFilePath => fs.readFileSync(specFilePath, "utf8"))
  .map(x => yaml.safeLoad(x))
  .forEach(spec => {
    possibleAttrs.push(...extractAttrs(spec));
    possibleTags.push(...extractKeys(spec));
  });

possibleTags = arrayUniq(
  possibleTags.filter(
    x => !["config", "uniq", "alo", "attrs", "required", "only"].includes(x)
  )
).sort();
possibleAttrs = arrayUniq(possibleAttrs).sort();

fs.ensureDirSync(outputPath);
fs.writeFileSync(
  path.join(outputPath, outputFileName),
  templateType(possibleTags, possibleAttrs)
);
