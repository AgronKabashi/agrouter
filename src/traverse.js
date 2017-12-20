import { getRoute } from "./getRoute";

export function traverse (routeTable, [uriSegment, ...remainingSegments]) {
  if (!uriSegment || !routeTable) {
    return Promise.reject();
  }

  const { action, route, stopTraversing } = getRoute(routeTable, uriSegment);
  const actionPromise = Promise.resolve(action(remainingSegments));

  return actionPromise.then(actionResult => {
    const result = {
      uriSegment,
      actionResult
    };

    if (!stopTraversing && remainingSegments.length) {
      return traverse(route, remainingSegments)
        .then(nestedResults => [result, ...nestedResults]);
    }

    return [result];
  });
}
