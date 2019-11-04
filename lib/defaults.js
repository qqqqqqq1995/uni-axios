var defaults = {
	adapter: require('./adapters'),
	validateStatus: function validateStatus(status) {
	  return status >= 200 && status < 300;
	},
	dataType: 'json',
	responseType: 'text',
	sslVerify: true
}

module.exports = defaults;