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
        uriSegments: [
          {
            uriSegment: "/",
            actionResult: rootActionResult
          }
        ],
        uri: "/"
      });
    });
  });

  it("should be able to support hashbang urls", () => {
    return navigate("/#hashbangs", staticRoutes, history).then(result => {
      assert.deepEqual(result, {
        uriSegments: [
          {
            uriSegment: "/",
            actionResult: rootActionResult
          },
          {
            uriSegment: "#hashbangs",
            actionResult: "Hashbangs"
          }
        ],
        uri: "/#hashbangs"
      });
    });
  });

  it("should return uriSegments with data from each segment", () => {
    return navigate("/test", staticRoutes, history).then(result => {
      assert.deepEqual(result, {
        uriSegments: [
          {
            uriSegment: "/",
            actionResult: rootActionResult
          },
          {
            uriSegment: "test",
            actionResult: testActionResult
          }
        ],
        uri: "/test"
      });
    });
  });

  it("should exclude data from segments missing an action", () => {
    return navigate("/empty/notEmpty", staticRoutes, history).then(result => {
      assert.deepEqual(result, {
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
        ],
        uri: "/empty/notEmpty"
      });
    });
  });
});