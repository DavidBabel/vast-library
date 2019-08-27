import { replaceVastMacros } from "../../common/utils/macros";

describe("macros", () => {
    test("should correctly replace [TIMESTAMP] with ISO-Date-String", () => {
        expect(replaceVastMacros("[TIMESTAMP]", {})).toMatch(new Date().toISOString().substr(0,11));
    });
    test("should correctly replace [ASSETURI] with given string (escaped)", () => {
        expect(replaceVastMacros("[ASSETURI]", {'ASSETURI':'foo:bar'})).toMatch('foo%3Abar');
    });
    test("should correctly replace [CACHEBUSTING] with a random number", () => {
        expect(replaceVastMacros("[CACHEBUSTING]", {})).toMatch(/^\d+$/);
    });
});
