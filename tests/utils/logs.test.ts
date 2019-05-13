// tslint:disable:no-console
import { logError, logWarn, warnOrThrow } from "../../common/utils/logs";

describe("logs", () => {
  let logMock: jest.SpyInstance;
  let logWarnMock: jest.SpyInstance;
  let logErrorMock: jest.SpyInstance;

  beforeEach(() => {
    logMock = jest.spyOn(console, "log");
    logWarnMock = jest.spyOn(console, "warn");
    logErrorMock = jest.spyOn(console, "error");
  });

  afterEach(() => {
    logMock.mockRestore();
    logWarnMock.mockRestore();
    logErrorMock.mockRestore();
  });

  describe("logWarn / logError", () => {
    test("should log warn correctly", () => {
      logWarn("anything");

      expect(logWarnMock).toBeCalledWith(expect.stringMatching(/anything/));
    });
    test("should log error correctly", () => {
      logError("anything");

      expect(logErrorMock).toBeCalledWith(expect.stringMatching(/anything/));
    });
    test("should log error correctly when console.error does not exists", () => {
      console.error = () => {
        throw new Error("lol");
      };
      logError("anything");

      expect(logMock).toBeCalledWith(expect.stringMatching(/anything/));
      console.error = logErrorMock as any;
      logErrorMock.mockClear();
    });
    test("should log warn correctly when console.warn does not exists", () => {
      console.warn = () => {
        throw new Error("lol");
      };
      logWarn("anything");

      expect(logMock).toBeCalledWith(expect.stringMatching(/anything/));
      console.warn = logWarnMock as any;
    });
  });

  describe("warnOrThrow", () => {
    test("should log messages in correct channels", () => {
      warnOrThrow("anything", { logWarn: true });

      expect(logWarnMock).toBeCalledWith(expect.stringMatching(/anything/));
    });
    test("should log messages in correct channels", () => {
      warnOrThrow("anything", { logWarn: true }, true);

      expect(logErrorMock).toBeCalledWith(expect.stringMatching(/anything/));
    });
    test("should log messages in correct channels", () => {
      expect(() => {
        warnOrThrow("anything", { throwOnError: true });
      }).not.toThrow();
    });
    test("should log messages in correct channels", () => {
      expect(() => {
        warnOrThrow("anything", { throwOnError: true }, true);
      }).toThrow(/anything/);
    });
  });
});
