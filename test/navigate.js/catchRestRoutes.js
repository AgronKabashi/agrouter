import assert from "assert";
import { navigate } from "navigate";
import {
  catchRestRoutes
} from "./fixtures";

/* eslint-disable promise/always-return */
describe("Catch rest routes", () => {
  const history = {
    pushState: () => {}
  };

  it("should stop traversing the tree and execute a '*' route if available and no route was found", () => {
    return navigate("/search/param1/param2/param3=true", catchRestRoutes, history).then(result => {
      assert.deepEqual(result, {
        uri: "/search/param1/param2/param3=true",
        uriSegments: [
          {
            uriSegment: "/",
            actionResult: undefined
          },
          {
            uriSegment: "search",
            actionResult: "Catch everything: remaining uriSegments: param1,param2,param3=true"
          }
        ]
      });
    });
  });
});
