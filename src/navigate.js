import { traverse } from "./traverse";

export {
  navigate
};

function navigate (uri, routeTable, history, pushState = true) {
  // Separate the uri into segments
  const uriSegments = uri === "/" ? [uri] : uri.split("/").map(uriSegment => uriSegment || "/");
  pushState && history.pushState(null, null, uri);

  return traverse(routeTable, uriSegments)
    .then(uriSegments => ({
      uri,
      uriSegments
    }))
    .catch(error => {
      if (error.message !== "404") {
        throw error;
      }

      const notFoundRoute = routeTable["404"];
      return {
        uri,
        uriSegments: [{
          actionResult: notFoundRoute && notFoundRoute()
        }]
      };
    });
}
