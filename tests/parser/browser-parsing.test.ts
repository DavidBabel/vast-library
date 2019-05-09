// tslint:disable:no-eval
import * as fs from "fs-extra";
import * as path from "path";
// import { Request as PuppeteerRequest } from "puppeteer";
import {
  compileScript,
  evalCode,
  evalCodeAsync,
  evalGetResult,
  printPageConsoleLogs
} from "../test-helpers";

function getFileContent(fixturePath: string) {
  const fixtureFile = path.join(__dirname, "vasts", fixturePath);
  return fs.readFileSync(fixtureFile, "utf8");
}

function answerVastFile(req: any /* PuppeteerRequest */) {
  const fileToLoad = req.url().split("http://vasts/")[1];
  const fileContent = getFileContent(fileToLoad);
  req.respond({
    body: fileContent,
    contentType: "text/xml",
    headers: {
      "Access-Control-Allow-Origin": "*"
    },
    status: 200
  });
}

// this prevent jest extensions to become crazy
// by loading infinite Chromium in background
if (process.env.RUN_PUPPETEER_TESTS === "true") {
  describe("VastParser fetch / browser", () => {
    let interceptedCalls: number = 0;
    let scriptToInject: string;

    beforeAll(async () => {
      jest.setTimeout(30000);
      printPageConsoleLogs();

      const scriptPath = path.join(__dirname, "../../parser/index.ts");
      scriptToInject = await compileScript(scriptPath, ["VastParser"]);
    });

    beforeEach(async () => {
      await page.evaluate(script => {
        eval(script);
      }, scriptToInject);

      interceptedCalls = 0;
      await page.setRequestInterception(true);
      page.on("request", req => {
        interceptedCalls++;
        answerVastFile(req);
      });
    });

    afterEach(async () => {
      await jestPuppeteer.resetPage();
    });

    // broken because need to find a way to force browserify to compile in browser mode
    xtest("should parse a vast synchronously", async () => {
      const result = await evalCode(`
        const parser = new VastParser();
        parser.parseSync("http://vasts/minimal_wrapper_1.xml");
        window.result = parser.getContents(['Impression']);
      `);

      expect(interceptedCalls).toBe(4);
      expect(result).toEqual([
        "impression url wrapper 1",
        "impression url wrapper 2",
        "impression url wrapper 3",
        "impression url vast inline"
      ]);
    });

    // broken because need to find a way to force browserify to compile in browser mode
    xtest("should parse a vast asynchronously", async () => {
      await evalCodeAsync(`
        window.result;
        const parser = new VastParser();
        parser.parseAsync("http://vasts/minimal_wrapper_1.xml", () => {
          window.result = parser.getContents(['Impression']);
          save();
        });
      `);

      await page.waitFor(5000);

      const result = await evalGetResult();

      expect(interceptedCalls).toBe(4);
      expect(result).toEqual([
        "impression url wrapper 1",
        "impression url wrapper 2",
        "impression url wrapper 3",
        "impression url vast inline"
      ]);
    });
  });
} else {
  describe("[IGNORED] parser fetch / browser", () => {
    test("empty tests forced to pass", () => {
      // :)
    });
  });
}
