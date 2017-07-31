# agrouter
The goal with agrouter is to provide an agnostic router with a minimal footprint.

### Installation
```
npm install agrouter --save-dev
```

### Usage

#### Configuration
To define your routes you need to create an object where the property names represent a uri segment. The value can be a pure function (leaf node) or an object (group node) with an `action` function that is called when that segment is traversed. The idea is to perform some operation and/or return some data that is relevant for that specific uri segment.

```js
// Most basic configuration with a single route
export default {
  "/": () => "Root"
};
```

```js
// All actions to a specific route will be triggered.
// If you for instance navigate to /about then
// both the root action and the about action will be executed
export default {
  "/": {
    action: () => "Root",
    routes: {
      "about": () => "About"
    }
  }
};
```

```js
// Use pure functions for leaf nodes and objects
// for group nodes
export default {
  "/": {
    // Note: action method is optional for group nodes
    routes: {
      "leaf": () => "Leaf node"
      "group": {
        action: () => "Group node",
        routes: {...}
      }
    }
  }
};
```

```js
// It's also possible to cover dynamic routes using regular expressions as keys.
// These expressions must start and end with a "/"
export default {
  "/": {
    routes: {
      // This will capture routes of the form /{number}
      "/\\d+/": ([id]) => `Got id ${id}`
    }
  }
}
```

#### Create the router
```js
import createRouter from "agrouter";
import routes from "./routes";

const router = createRouter(routes);
```

Navigate to uri
```js
router.navigate("/articles/5");
```

### Versioning
This project uses semantic versioning.

### Licence
MIT