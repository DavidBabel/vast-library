import { hasCDATA, stripCDATA } from "../../common/utils/string";

describe("string", () => {
  test("should correctly handle string without CDATA", () => {
    expect(stripCDATA("test")).toBe("test");
    expect(stripCDATA("<anything>")).toBe("<anything>");
  });
  test("should remove CDATA when present", () => {
    expect(stripCDATA("<![CDATA[test")).toBe("test");
    expect(stripCDATA("test]]>")).toBe("test");
    expect(stripCDATA("<![CDATA[test]]>")).toBe("test");
    expect(stripCDATA("<![CDATA[    test   ]]>")).toBe("test");
  });
  test("should remove CDATA when present", () => {
    expect(hasCDATA("<![CDATA[test]]>")).toBe(true);
    expect(hasCDATA("<![CDATA[    test   ]]>")).toBe(true);
    expect(hasCDATA("whatever")).toBe(false);
  });
});
