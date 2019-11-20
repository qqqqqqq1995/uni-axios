var axiosUtils = require('./../utils');
var Axios = axiosUtils.Axios;
var utils = axiosUtils.utils;
var InterceptorManager = axiosUtils.InterceptorManager;
function UniAxios(defaultConfig) {
	Axios.call(this, defaultConfig);
	this.interceptors.first = new InterceptorManager();
	this.interceptors.last = new InterceptorManager();
}

UniAxios.prototype.request = function request(config) {
	if (typeof config === 'string') {
	  config = arguments[1] || {};
	  config.url = arguments[0];
	} else {
	  config = config || {};
	}
	var promise = Promise.resolve(config);
	this.interceptors.first.forEach(function firstInterceptors(interceptor) {
		promise = promise.then(interceptor.fulfilled, interceptor.rejected);
	})
	var that = this;
	var promise = promise.then(function axiosRequest(config) {
		return Axios.prototype.request.call(that, config);
	})
	this.interceptors.last.forEach(function lastInterceptors(interceptor) {
		promise = promise.then(function lastResolve(response) {
			interceptor.fulfilled(config);
			return response;
		}, function lastReject(err) {
			interceptor.fulfilled(config);
			return Promise.reject(err);
		})
	})
	return promise;
}

utils.forEach(['get', 'post', 'put', 'delete', 'connect', 'head', 'options', 'trace'], function forEachMethod(method) {
  UniAxios.prototype[method] = function(url, config) {
    return this.request(utils.merge(config || {}, {
      method: method,
      url: url
    }));
  };
});

module.exports = UniAxios;