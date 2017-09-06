export {
  isPromise
};

function isPromise (obj) {
  return !!obj && typeof obj === "object" && typeof obj.then === "function";
}
