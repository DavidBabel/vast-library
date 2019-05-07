import * as fs from "fs-extra";
import * as nock from "nock";
import * as path from "path";

import VastParser from "../../parser";

function getFileContent(fixturePath: string) {
  const fixtureFile = path.join(__dirname, "vasts", fixturePath);
  return fs.readFileSync(fixtureFile, "utf8");
}

describe("VastParser fetch / NODE.js", () => {
  beforeAll(() => {
    nock("http://vasts")
      .get("/minimal_vast.xml")
      .reply(200, getFileContent("minimal_vast.xml"))
      .get("/minimal_wrapper_1.xml")
      .reply(200, getFileContent("minimal_wrapper_1.xml"))
      .get("/minimal_wrapper_2.xml")
      .reply(200, getFileContent("minimal_wrapper_2.xml"))
      .get("/minimal_wrapper_3.xml")
      .reply(200, getFileContent("minimal_wrapper_3.xml"));
  });
  afterAll(() => {
    nock.restore();
    nock.cleanAll();
  });
  test("should parse a vast and it's wrappers", done => {
    const parser = new VastParser();
    parser.parseAsync("http://vasts/minimal_wrapper_1.xml", p => {
      expect(p.getContents(["Impression"])).toEqual([
        "impression url wrapper 1",
        "impression url wrapper 2",
        "impression url wrapper 3",
        "impression url vast inline"
      ]);
      done();
    });
  });
  test("should parse a vast and it's wrappers", () => {
    const parser = new VastParser();
    expect(() => {
      parser.parseSync("http://vasts/minimal_wrapper_1.xml");
    }).toThrow();
  });
});
