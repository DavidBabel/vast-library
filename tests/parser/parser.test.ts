// import { createVastWithBuilder } from "../../common/utils/vast";
import VastElement from "../../common/vast-element";
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
  test("should get Vast Elements without filter", () => {
    const elements = parser.getVastElements(["Impression"]);
    expect(elements).toHaveLength(4);
    expect(elements[0]).toBeInstanceOf(VastElement);
    expect(elements[0].getName()).toBe("Impression");
    expect(elements[1]).toBeInstanceOf(VastElement);
    expect(elements[1].getName()).toBe("Impression");
    expect(elements[2]).toBeInstanceOf(VastElement);
    expect(elements[2].getName()).toBe("Impression");
    expect(elements[3]).toBeInstanceOf(VastElement);
    expect(elements[3].getName()).toBe("Impression");
  });
  test("should get Vast Elements with filter", () => {
    let elements = parser.getVastElements(["InLine", "Impression"]);
    expect(elements).toHaveLength(1);
    expect(elements[0]).toBeInstanceOf(VastElement);
    expect(elements[0].getName()).toBe("Impression");
    expect(elements[0].getContent()).toBe("impression url vast inline");
    elements = parser.getVastElements(["Wrapper", "Impression"]);
    expect(elements).toHaveLength(3);
    expect(elements[0]).toBeInstanceOf(VastElement);
    expect(elements[0].getName()).toBe("Impression");
    expect(elements[1]).toBeInstanceOf(VastElement);
    expect(elements[1].getName()).toBe("Impression");
    expect(elements[2]).toBeInstanceOf(VastElement);
    expect(elements[2].getName()).toBe("Impression");
  });
  test("should get a Vast Content", () => {
    let contents = parser.getContents(["InLine", "Impression"]);
    expect(contents).toHaveLength(1);
    expect(contents[0]).toBe("impression url vast inline");
    contents = parser.getContents(["Wrapper", "Impression"]);
    expect(contents).toHaveLength(3);
    expect(contents[0]).toBe("impression url wrapper 3");
    expect(contents[1]).toBe("impression url wrapper 2");
    expect(contents[2]).toBe("impression url wrapper 1");
  });
  test("should get a Vast Attribute", () => {
    let attributes = parser.getAttributes(["MediaFile"], "type");
    expect(attributes).toHaveLength(1);
    expect(attributes[0]).toBe("video/mp4");
    attributes = parser.getAttributes(["MediaFile"], "width");
    expect(attributes).toHaveLength(1);
    expect(attributes[0]).toBe("800");
  });
});
