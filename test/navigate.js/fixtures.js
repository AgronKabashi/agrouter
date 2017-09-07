import { ROUTE_PRESETS } from "routePresets";

export const rootActionResult = "Root";
export const testActionResult = "Test";
export const notEmptyActionResult = "NotEmpty";
export const catchAllActionResult = "Catch all";

export const staticRoutes = {
  "/": {
    action: () => rootActionResult,
    routes: {
      "#hashbangs": {
        action: () => "Hashbangs",
        routes: {
          "nested": () => "Nested"
        }
      },
      "test": () => testActionResult,
      "empty": {
        routes: {
          "notEmpty": () => notEmptyActionResult
        }
      }
    }
  }
};

export const regexRoutes = {
  "/": {
    action: () => rootActionResult,
    routes: {
      [ROUTE_PRESETS.KEY_VALUE_PAIRS]: variables => `Regex: Extracting variables - ${variables}`,
      [ROUTE_PRESETS.CATCH_ALL]: () => catchAllActionResult
    }
  }
};

/* eslint-disable promise/avoid-new */
export const asyncRoutes = {
  "/": {
    action: () => rootActionResult,
    routes: {
      "resolvedPromise": () => Promise.resolve("Resolved promise"),
      "delayed": {
        routes: {
          [/(\d+)ms/]: {
            action: ([, delay]) => new Promise(resolve => {
              setTimeout(() => resolve(`Resolved after ${delay}ms`), delay);
            }),
            routes: {
              [/(\d+)ms/]: ([, delay]) => new Promise(resolve => {
                setTimeout(() => resolve(`Resolved after another ${delay}ms`), delay);
              })
            }
          }
        }
      }
    }
  }
};