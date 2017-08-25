const totalRegexSlashLength = 2;

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

function findRoute (uriSegment, routes) {
  // Do we have a direct match?
  if (routes[uriSegment]) {
    return {
      output: routes[uriSegment],
      subRoutes: routes[uriSegment].routes
    };
  }

  // Attempt to locate a route that matches the specified uri segment using regular expressions
  let match;
  const routeKey = Object.keys(routes)
    // A route that starts and ends with a "/" is a regular expression route
    .filter(key => key.startsWith("/") && key.endsWith("/"))
    // Execute each one until we find one that matches our uriSegment
    .find(key => (match = uriSegment.match(key.substr(1, key.length - totalRegexSlashLength))));

  return {
    output: routes[routeKey],
    actionArguments: match,
    subRoutes: routes[routeKey].routes
  };
}

function isPromise (obj) {
  return !!obj && typeof obj === "object" && typeof obj.then === "function";
}

function getUriSegmentResult ([firstUriSegment, ...remainingUriSegments], routes = {}) {
  const uriSegment = firstUriSegment === "" ? "/" : firstUriSegment;
  const { output = {}, actionArguments, subRoutes } = findRoute(uriSegment, routes);
  const action = typeof output === "function" && output || typeof output.action === "function" && output.action || (() => {});

  const actionResult = action(actionArguments);
  const promise = isPromise(actionResult) ? actionResult : Promise.resolve(actionResult);

  return promise.then(actionResult => {
    const payload = {
      uriSegment,
      actionResult
    };

    if (remainingUriSegments.length) {
      return getUriSegmentResult(remainingUriSegments, subRoutes)
        .then(recursiveResult => [payload, ...recursiveResult]);
    }

    return [payload];
  });
}
