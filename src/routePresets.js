const ROUTE_PRESETS = {
  NUMBER: /(\d+)/,
  STRICT_NUMBER: /^\d+$/,
  KEY_VALUE_PAIRS: /([\w-]+)=([^&]*)/g,
  CATCH_ALL: /[\\s\\S]+/
};

export {
  ROUTE_PRESETS
};
