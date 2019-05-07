// import { createVastWithBuilder } from "../../common/utils/vast";
import VastParser from "../../parser";

import * as fs from "fs-extra";
import * as path from "path";

function getFileContent(fixturePath: string) {
  const fixtureFile = path.join(__dirname, "vasts", fixturePath);
  return fs.readFileSync(fixtureFile, "utf8");
}

function getVasts() {
  return [
    getFileContent("minimal_wrapper_3.xml"),
    getFileContent("minimal_wrapper_2.xml"),
    getFileContent("minimal_wrapper_1.xml"),
    getFileContent("minimal_vast.xml")
  ];
}

describe("VastParser", () => {
  let parser: VastParser;
  beforeEach(() => {
    parser = new VastParser();
    getVasts().forEach(vastXML => {
      parser.addVastWithoutFetching(vastXML);
    });
  });
  test("should ", () => {
    // TODO do tests :)
  });
});
