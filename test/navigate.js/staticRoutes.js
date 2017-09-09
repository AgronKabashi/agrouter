import assert from "assert";
import { navigate } from "navigate";
import {
  staticRoutes,
  rootActionResult,
  testActionResult,
  notEmptyActionResult
} from "./fixtures";

/* eslint-disable promise/always-return */

describe("Static routes", () => {
  const history = {
    pushState: () => {}
  };

  it("should navigate to root and return only one uriSegment", () => {
    return navigate("/", staticRoutes, history).then(result => {
      assert.deepEqual(result, {
        uri: "/",
        uriSegments: [
          {
            uriSegment: "/",
            actionResult: rootActionResult
          }
        ]
      });
    });
  });

  it("should be able to support hashbang urls", () => {
    return navigate("/#hashbangs", staticRoutes, history).then(result => {
      assert.deepEqual(result, {
        uri: "/#hashbangs",
        uriSegments: [
          {
            uriSegment: "/",
            actionResult: rootActionResult
          },
          {
            uriSegment: "#hashbangs",
            actionResult: "Hashbangs"
          }
        ]
      });
    });
  });

  it("should return uriSegments with data from each segment", () => {
    return navigate("/test", staticRoutes, history).then(result => {
      assert.deepEqual(result, {
        uri: "/test",
        uriSegments: [
          {
            uriSegment: "/",
            actionResult: rootActionResult
          },
          {
            uriSegment: "test",
            actionResult: testActionResult
          }
        ]
      });
    });
  });

  it("should exclude data from segments missing an action", () => {
    return navigate("/empty/notEmpty", staticRoutes, history).then(result => {
      assert.deepEqual(result, {
        uri: "/empty/notEmpty",
        uriSegments: [
          {
            uriSegment: "/",
            actionResult: rootActionResult
          },
          {
            uriSegment: "empty",
            actionResult: undefined
          },
          {
            uriSegment: "notEmpty",
            actionResult: notEmptyActionResult
          }
        ]
      });
    });
  });

  it("should not throw an exception if there are more url segments than in the route config", () => {
    return navigate("/nonexisting/route", staticRoutes, history).then(result => {
      assert.deepEqual(result, {
        uri: "/nonexisting/route",
        uriSegments: [
          {
            actionResult: "404"
          }
        ]
      });
    });
  });

  it("should stop traversing the tree and execute a '*' route if available and no route was found", () => {
    const customRoutes = {
      "/": {
        routes: {
          "*": remainingUriSegments => `Catch everything: remaining uriSegments: ${remainingUriSegments}`
        }
      }
    };

    return navigate("/search/param1/param2?param3=true", customRoutes, history).then(result => {
      assert.deepEqual(result, {
        uri: "/search/param1/param2?param3=true",
        uriSegments: [
          {
            uriSegment: "/",
            actionResult: undefined
          },
          {
            uriSegment: "search",
            actionResult: "Catch everything: remaining uriSegments: param1,param2?param3=true"
          }
        ]
      });
    });
  });
});
