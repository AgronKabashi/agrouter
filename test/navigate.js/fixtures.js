import { ROUTE_ACTION, ROUTE_PRESETS } from "../../src/constants";

export const rootActionResult = "Root";
export const testActionResult = "Test";
export const notEmptyActionResult = "NotEmpty";
export const catchAllActionResult = "Catch all";

export const staticRoutes = {
  "/": {
    [ROUTE_ACTION]: () => rootActionResult,
    "#hashbangs": {
      [ROUTE_ACTION]: () => "Hashbangs",
      "nested": () => "Nested"
    },
    "test": () => testActionResult,
    "empty": {
      "notEmpty": () => notEmptyActionResult
    }
  },
  "404": () => "404"
};

export const regexRoutes = {
  "/": {
    [ROUTE_ACTION]: () => rootActionResult,
    [ROUTE_PRESETS.KEY_VALUE_PAIRS]: variables => `Regex: Extracting variables - ${variables}`,
    [ROUTE_PRESETS.CATCH_ALL]: () => catchAllActionResult
  }
};

/* eslint-disable promise/avoid-new */
export const asyncRoutes = {
  "/": {
    [ROUTE_ACTION]: () => rootActionResult,
    "resolvedPromise": () => Promise.resolve("Resolved promise"),
    "delayed": {
      [/(\d+)ms/]: {
        [ROUTE_ACTION]: ([, delay]) => new Promise(resolve => {
          setTimeout(() => resolve(`Resolved after ${delay}ms`), delay);
        }),
        [/(\d+)ms/]: ([, delay]) => new Promise(resolve => {
          setTimeout(() => resolve(`Resolved after another ${delay}ms`), delay);
        })
      }
    }
  }
};

export const catchRestRoutes = {
  "/": {
    "*": remainingUriSegments => `Catch everything: remaining uriSegments: ${remainingUriSegments}`
  }
};
