var {buildURL} = require('./utils');
module.exports = function uniAdapter(config) {
	return new Promise(function adapterUniRequest(resolve, reject){
		uni.request({
			method: config.method.toUpperCase(),
			url: buildURL(config.url, config.params, config.paramsSerializer),
			header: config.headers,
			complete:function complete(response){
				
			}
		})
	})
}