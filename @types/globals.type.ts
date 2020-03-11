// tslint:disable:no-empty-interface

interface ErrorOptions {
  logWarn?: boolean;
  throwOnError?: boolean;
}

interface CommonOptions extends ErrorOptions {
  cdata?: boolean;
  validateOnBuild?: boolean; // TODO check if it's a problem
  spaces?: number; // TODO replace by indentSpaceNumber
}

interface Macro {
  key: string;
  value: string;
}

interface VastBuilderOptions extends ErrorOptions, CommonOptions {}
interface VastParserOptions extends ErrorOptions {
  macrosToReplace?: Macro[];
}
interface VastValidatorOptions extends ErrorOptions {}
