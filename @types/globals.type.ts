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

interface VastBuilderOptions extends ErrorOptions, CommonOptions {}
interface VastParserOptions extends ErrorOptions {
    vastUrlMacroVars?: any
}
interface VastValidatorOptions extends ErrorOptions {}
