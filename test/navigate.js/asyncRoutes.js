import assert from "assert";
import { navigate } from "navigate";
import {
  asyncRoutes,
  rootActionResult
} from "./fixtures";

/* eslint-disable promise/always-return */

describe("Async routes", () => {
  const history = {
    pushState: () => {}
  };

  it("should resolve promise based routes", () => {
    return navigate("/resolvedPromise", asyncRoutes, history).then(result => {
      assert.deepEqual(result, {
        uriSegments: [
          {
            uriSegment: "/",
            actionResult: rootActionResult
          },
          {
            uriSegment: "resolvedPromise",
            actionResult: "Resolved promise"
          }
        ],
        uri: "/resolvedPromise"
      });
    });
  });

  it("should resolve wait for each promise in the chain to resolve", () => {
    return navigate("/delayed/100ms/100ms", asyncRoutes, history).then(result => {
      assert.deepEqual(result, {
        uriSegments: [
          {
            uriSegment: "/",
            actionResult: rootActionResult
          },
          {
            uriSegment: "delayed",
            actionResult: undefined
          },
          {
            uriSegment: "100ms",
            actionResult: "Resolved after 100ms"
          },
          {
            uriSegment: "100ms",
            actionResult: "Resolved after another 100ms"
          }
        ],
        uri: "/delayed/100ms/100ms"
      });
    });
  });
});
