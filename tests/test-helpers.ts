/* tslint:disable: no-console */
import * as browserify from "browserify";
import * as fs from "fs-extra";
import * as diff from "jest-diff";
import { NO_DIFF_MESSAGE } from "jest-diff/build/constants";
import * as path from "path";
import "tsify";
import "../@types/globals.type"; // do not compile without, don't ask me why
import { v2 } from "../builder";

function assertEqual(base, expected) {
  const out = diff(base.trim(), expected.trim());
  if (out !== NO_DIFF_MESSAGE) {
    throw new Error("\n" + out);
  }
}

type AvailableVersion = "v2" | "v3" | "v4" | "v4.1";

export function runFixture(
  toCompare: string,
  version: AvailableVersion,
  fixtureName: string
) {
  // return;

  const fixtureFile = path.join(
    __dirname,
    version,
    "fixtures",
    fixtureName + ".xml"
  );

  let expectedResponse: string;
  try {
    expectedResponse = fs.readFileSync(path.join(fixtureFile), "utf8");
  } catch (e) {
    console.log(
      "Didnt find expected resources, create it from received resources"
    );
    expectedResponse = toCompare;
    fs.writeFileSync(path.join(fixtureFile), expectedResponse);
  }

  assertEqual(toCompare, expectedResponse);
}

export function getFixtureContent(
  version: AvailableVersion,
  fixtureName: string
) {
  const fixtureFile = path.join(
    __dirname,
    version,
    "fixtures",
    fixtureName + ".xml"
  );
  return fs.readFileSync(path.join(fixtureFile), "utf8");
}

export function compileScript(
  entrypoint: string,
  classesToExpose: string[]
): Promise<string> {
  if (!fs.existsSync(entrypoint)) {
    throw new Error(`${entrypoint} does not exists`);
  }

  const stream = browserify()
    .add(entrypoint)
    .plugin("tsify")
    .bundle();
  const chunks = [];
  return new Promise((resolve, reject) => {
    stream.on("data", chunk => chunks.push(chunk));
    stream.on("error", reject);
    stream.on("end", () => {
      let output = Buffer.concat(chunks).toString("utf8");
      classesToExpose.forEach(classToExpose => {
        output = output.replace(
          `var ${classToExpose} = /** @class */`,
          `window.${classToExpose} = /** @class */`
        );
      });
      resolve(output);
    });
  });
}

export async function evalGetResult() {
  return evalCode("", true, false);
}
export async function evalCodeAsync(codeToExec: string) {
  return evalCode(codeToExec, false);
}
export async function evalCode(
  codeToExec: string,
  sync: boolean = true,
  throwIfNoWindowResult: boolean = true
) {
  if (throwIfNoWindowResult && !codeToExec.includes("window.result")) {
    throw new Error(
      'You code have to contain a "window.result" which contain a JSON object expected result'
    );
  }

  await page.evaluate(
    (code, isSync) => {
      // tslint:disable-next-line:no-eval
      eval(`
      ${code}

      function save() {
        const div = document.createElement('div');
        div.id = 'testValue';
        div.innerHTML = JSON.stringify(window.result);
        document.body.append(div);
      }
      if(${String(isSync)} === true) {
        save();
      }
    `);
    },
    codeToExec,
    sync
  );

  const result = await page.$eval("#testValue", el =>
    JSON.parse(el.textContent)
  );
  return result;
}

export function printPageConsoleLogs() {
  page.on("console", msg => console.log("PAGE LOG:", msg.text()));
}

export function generateMinimalVast() {
  const vast = v2()
    .attachAd({ id: "identifier" })
    .attachInLine()
    .addImpression("imp_link")
    .addAdSystem("Society")
    .addAdTitle("Title")
    .attachCreatives()
    .attachCreative()
    .attachLinear()
    .addDuration("00:30:00")
    .attachMediaFiles()
    .attachMediaFile("my_video", {
      delivery: "streaming",
      height: "400",
      type: "video/mp4",
      width: "600"
    });
  return vast.getRoot();
}
