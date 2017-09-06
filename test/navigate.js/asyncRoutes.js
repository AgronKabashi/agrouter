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

  it("should wait for each promise in the chain to resolve", () => {
    return navigate("/delayed/20ms/50ms", asyncRoutes, history).then(result => {
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
            uriSegment: "20ms",
            actionResult: "Resolved after 20ms"
          },
          {
            uriSegment: "50ms",
            actionResult: "Resolved after another 50ms"
          }
        ],
        uri: "/delayed/20ms/50ms"
      });
    });
  });
});
