const yellow = "\x1b[33m";
const red = "\x1b[31m";
const reset = "\x1b[0m";

const introError = `${yellow}VAST-LIBRARY ${red}ERROR${yellow}:${reset}`;
const introWarning = `${yellow}VAST-LIBRARY WARNING:${reset}`;

export function warnOrThrow(
  msg: string,
  options: ErrorOptions,
  isError: boolean = false
) {
  if (options.logWarn) {
    if (isError) {
      logError(msg);
    } else {
      logWarn(msg);
    }
  }
  if (isError && options.throwOnError) {
    throw new Error(msg);
  }
}

// tslint:disable:no-console variable-name
export function logError(error: string) {
  try {
    console.error(`${introError} ${error}`);
  } catch (O_o) {
    console.log(`${introError} ${error}`);
  }
}
export function logWarn(warning: string) {
  try {
    console.warn(`${introWarning} ${warning}`);
  } catch (O_o) {
    console.log(`${introWarning} ${warning}`);
  }
}
