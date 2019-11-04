var {buildURL, settle} = require('./utils');
module.exports = function uniAdapter(config) {
	return new Promise(function adapterUniRequest(resolve, reject){
		uni.request({
			method: config.method.toUpperCase(),
			url: buildURL(config.url, config.params, config.paramsSerializer),
			header: config.headers,
			data: config.data,
			dataType: config.dataType,
			responseType: config.responseType,
			sslVerify: config.sslVerify,
			complete:function complete(response){
				response = {
				  data: response.data,
				  status: response.statusCode,
				  errMsg: response.errMsg,
				  header: response.header,
				  config: config
				};
				settle(resolve, reject, response);
			}
		})
	})
}