export {
  navigate
};

const totalRegexSlashLength = 2;

function findSegment (uriSegment, routes) {
  // Do we have a direct match?
  if (routes[uriSegment]) {
    return {
      output: routes[uriSegment]
    };
  }

  // Attempt to locate a route that match the specified uri segment using regular expressions
  let match;
  const routeKey = Object.keys(routes)
    // A route that starts and ends with a "/" is a regular expression route
    .filter(key => key.startsWith("/") && key.endsWith("/"))
    // Execute each one until we find one that matches our uriSegment
    .find(key => (match = uriSegment.match(key.substr(1, key.length - totalRegexSlashLength))));

  return {
    output: routes[routeKey],
    actionArguments: match
  };
}

function getUriSegments (uri, routes) {
  const initial = {
    uriSegments: [],
    routesForSegment: routes
  };

  if (uri === "/") {
    uri = ""; // eslint-disable-line no-param-reassign
  }

  // Separate the uri into segments
  return uri.split("/")
    .reduce(({ uriSegments, routesForSegment = {} }, segment) => {
      const uriSegment = segment || "/";
      const { output = {}, actionArguments } = findSegment(uriSegment, routesForSegment);

      // The output should either be a function or an object containing an "action" function. This function
      // represents the action to take when traversing this uriSegment
      const action = typeof output === "function" && output || typeof output.action === "function" && output.action || (() => {});
      uriSegments.push({
        uriSegment,
        actionResult: action && action(actionArguments)
      });

      // Keep iterating by going deeper into the tree
      return {
        uriSegments,
        routesForSegment: output.routes
      };
    }, initial);
}

function navigate (uri, routes, history, pushState = true) {
  const { uriSegments } = getUriSegments(uri, routes);

  // Only update the url if desired since pushState might be false for
  // when navigating back or forth
  pushState && history.pushState(null, null, uri);

  return {
    uri,
    uriSegments
  };
}
