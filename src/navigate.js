import { isPromise } from "./utilities";

export {
  navigate
};

function navigate (uri, routes, history, pushState = true) {
  // Separate the uri into segments
  const uriSegments = uri === "/" ? ["/"] : uri.split("/");

  // Only update the url if desired since pushState might be false for
  // when navigating back or forth
  pushState && history.pushState(null, null, uri);

  return getUriSegmentResult(uriSegments, routes)
    .then(results => ({
      uri,
      uriSegments: results
    }));
}

function getActionOrDefault (output) {
  return typeof output === "function" && output || typeof output.action === "function" && output.action || (() => {});
}

function getRouteInfo (uriSegment, routes) {
  // Do we have a direct match?
  if (routes[uriSegment]) {
    return {
      action: getActionOrDefault(routes[uriSegment]),
      subRoutes: routes[uriSegment].routes
    };
  }

  // Attempt to locate a route that matches the specified uri segment using regular expressions
  let match;
  const routeKey = Object.keys(routes)
    // A route that starts and ends with a "/" is a regular expression route
    .filter(key => key.startsWith("/"))
    // Execute each one until we find one that matches our uriSegment
    .find(key => {
      const lastSlashIndex = key.lastIndexOf("/");
      const regexFlags = key.substring(lastSlashIndex + 1);
      const regex = new RegExp(key.substring(1, lastSlashIndex), regexFlags);

      return (match = uriSegment.match(regex));
    });

  match = match || [];

  return {
    action: () => getActionOrDefault(routes[routeKey])(match),
    subRoutes: routes[routeKey].routes
  };
}

function getUriSegmentResult ([firstUriSegment, ...remainingUriSegments], routes = {}) {
  const uriSegment = firstUriSegment === "" ? "/" : firstUriSegment;
  const { action, subRoutes } = getRouteInfo(uriSegment, routes);

  const actionPayload = action();
  const promise = isPromise(actionPayload) ? actionPayload : Promise.resolve(actionPayload);

  return promise.then(actionResult => {
    const segmentResult = {
      uriSegment,
      actionResult
    };

    if (remainingUriSegments.length) {
      return getUriSegmentResult(remainingUriSegments, subRoutes)
        .then(nestedResults => [segmentResult, ...nestedResults]);
    }

    return [segmentResult];
  });
}
