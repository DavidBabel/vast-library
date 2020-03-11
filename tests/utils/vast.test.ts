import {replaceMacros} from "../../common/utils/vast";

describe("Vast Util", () => {
    describe("replaceMacros", () => {
        it("should replace one macros",() => {
            const res = replaceMacros("http://vast?test=[SOME_MACRO_KEY]", [{key: "SOME_MACRO_KEY", value: "SOME_MACRO_VALUE"}]);
            expect(res).toEqual("http://vast?test=SOME_MACRO_VALUE")
        });

        it("should replace more than one macros",() => {
            const res = replaceMacros("http://vast?test=[SOME_MACRO_KEY]&test2=[SOME_MACRO_KEY_2]", [{key: "SOME_MACRO_KEY", value: "SOME_MACRO_VALUE"}, {key: "SOME_MACRO_KEY_2", value: "SOME_MACRO_VALUE_2"}]);
            expect(res).toEqual("http://vast?test=SOME_MACRO_VALUE&test2=SOME_MACRO_VALUE_2")
        });

        it("should not replace if there are no macros list",() => {
            const res = replaceMacros("http://vast?test=[SOME_MACRO_KEY]");
            expect(res).toEqual("http://vast?test=[SOME_MACRO_KEY]")
        });

        it("should not replace if there are no macros in the url",() => {
            const res = replaceMacros("http://vast?test=value", [{key: "HELLO", value: "WORLD"}]);
            expect(res).toEqual("http://vast?test=value")
        });

        it("should replace one macros that use #{}", () => {
            const res = replaceMacros("http://vast?test=#{SOME_MACRO_KEY}", [{key: "SOME_MACRO_KEY", value: "SOME_MACRO_VALUE"}]);
            expect(res).toEqual("http://vast?test=SOME_MACRO_VALUE")
        });

        it("should replace more than one macros that uses ${}",() => {
            const res = replaceMacros("http://vast?test=#{SOME_MACRO_KEY}&test2=#{SOME_MACRO_KEY_2}", [{key: "SOME_MACRO_KEY", value: "SOME_MACRO_VALUE"}, {key: "SOME_MACRO_KEY_2", value: "SOME_MACRO_VALUE_2"}]);
            expect(res).toEqual("http://vast?test=SOME_MACRO_VALUE&test2=SOME_MACRO_VALUE_2")
        });
    });
});
