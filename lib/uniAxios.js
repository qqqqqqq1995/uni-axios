console.log(require('./utils'))
var {utils, bind, Axios, mergeConfig} = require('./utils');
var defaults = require('axios/lib/defaults');

/**
 * Create an instance of Axios
 *
 * @param {Object} defaultConfig The default config for the instance
 * @return {Axios} A new instance of Axios
 */
function createInstance(defaultConfig) {
  console.log(defaultConfig);
  var context = new Axios(defaultConfig);
  console.log(context);
  var instance = bind(Axios.prototype.request, context);
  console.log(instance);

  // Copy axios.prototype to instance
  utils.extend(instance, Axios.prototype, context);
  
  console.log(instance);

  // Copy context to instance
  utils.extend(instance, context);
  
  console.log(JSON.stringify(instance));

  return instance;
}

// Create the default instance to be exported
var axios = createInstance(defaults);

// Expose Axios class to allow class inheritance
axios.Axios = Axios;

// Factory for creating new instances
axios.create = function create(instanceConfig) {
  return createInstance(mergeConfig(axios.defaults, instanceConfig));
};

// Expose Cancel & CancelToken
axios.Cancel = require('axios/lib/cancel/Cancel');
axios.CancelToken = require('axios/lib/cancel/CancelToken');
axios.isCancel = require('axios/lib/cancel/isCancel');

// Expose all/spread
axios.all = function all(promises) {
  return Promise.all(promises);
};
axios.spread = require('axios/lib/helpers/spread');

module.exports = axios;

// Allow use of default import syntax in TypeScript
module.exports.default = axios;
