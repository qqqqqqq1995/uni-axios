module.exports = {
	utils: require('axios/lib/utils'),
	bind: require('axios/lib/helpers/bind'),
	Axios: require('axios/lib/core/Axios'),
	mergeConfig: require('axios/lib/core/mergeConfig'),
	dispatchRequest: require('axios/lib/core/dispatchRequest'),
	buildURL:  require('axios/lib/helpers/buildURL'),
	settle: require('axios/lib/core/settle'),
	InterceptorManager: require('axios/lib/core/InterceptorManager')
};