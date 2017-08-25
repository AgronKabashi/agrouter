export const rootActionResult = "Root";
export const testActionResult = "Test";
export const notEmptyActionResult = "NotEmpty";
export const catchAllActionResult = "Catch all";

export const staticRoutes = {
  "/": {
    action: () => rootActionResult,
    routes: {
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
      "/\\?(\\w+)=(\\d+)/": ([, key, value]) => `Regex: Extracting variables - Query: ${key}, Value: ${value}`,
      "/[\\s\\S]+/": () => catchAllActionResult
    }
  }
};

export const asyncRoutes = {
  "/": {
    action: () => rootActionResult,
    routes: {
      "resolvedPromise": () => Promise.resolve("Resolved promise"),
      "delayed": {
        routes: {
          "/(\\d+)ms/": {
            action: ([, delay]) => new Promise(resolve => {
              setTimeout(() => resolve(`Resolved after ${delay}ms`), delay);
            }),
            routes: {
              "/(\\d+)ms/": ([, delay]) => new Promise(resolve => {
                setTimeout(() => resolve(`Resolved after another ${delay}ms`), delay);
              })
            }
          }
        }
      }
    }
  }
};
