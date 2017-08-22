'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var totalRegexSlashLength = 2;

function navigate (uri, routes, history, pushState) {
  if ( pushState === void 0 ) pushState = true;

  var ref = getUriSegments(uri, routes);
  var uriSegments = ref.uriSegments;

  // Only update the url if desired since pushState might be false for
  // when navigating back or forth
  pushState && history.pushState(null, null, uri);

  return {
    uri: uri,
    uriSegments: uriSegments
  };
}

function findSegment (uriSegment, routes) {
  // Do we have a direct match?
  if (routes[uriSegment]) {
    return {
      output: routes[uriSegment]
    };
  }

  // Attempt to locate a route that match the specified uri segment using regular expressions
  var match;
  var routeKey = Object.keys(routes)
    // A route that starts and ends with a "/" is a regular expression route
    .filter(function (key) { return key.startsWith("/") && key.endsWith("/"); })
    // Execute each one until we find one that matches our uriSegment
    .find(function (key) { return (match = uriSegment.match(key.substr(1, key.length - totalRegexSlashLength))); });

  return {
    output: routes[routeKey],
    actionArguments: match
  };
}

function getUriSegments (uri, routes) {
  var initial = {
    uriSegments: [],
    routesForSegment: routes
  };

  if (uri === "/") {
    uri = ""; // eslint-disable-line no-param-reassign
  }

  // Separate the uri into segments
  return uri.split("/")
    .reduce(function (ref, segment) {
      var uriSegments = ref.uriSegments;
      var routesForSegment = ref.routesForSegment; if ( routesForSegment === void 0 ) routesForSegment = {};

      var uriSegment = segment || "/";
      var ref$1 = findSegment(uriSegment, routesForSegment);
      var output = ref$1.output; if ( output === void 0 ) output = {};
      var actionArguments = ref$1.actionArguments;

      // The output should either be a function or an object containing an "action" function. This function
      // represents the action to take when traversing this uriSegment
      var action = typeof output === "function" && output || typeof output.action === "function" && output.action || (function () {});
      uriSegments.push({
        uriSegment: uriSegment,
        actionResult: action && action(actionArguments)
      });

      // Keep iterating by going deeper into the tree
      return {
        uriSegments: uriSegments,
        routesForSegment: output.routes
      };
    }, initial);
}

var defaultOptions = {};

function createRouter (routes, options) {
  if ( routes === void 0 ) routes = [];
  if ( options === void 0 ) options = defaultOptions;

  var history = options.history;

  if (!history) {
    throw new Error("agrouter: History was not supplied");
  }

  return {
    routes: routes,
    navigate: function (uri, pushState) { return navigate(uri, routes, history, pushState); }
  };
}

exports.createRouter = createRouter;
