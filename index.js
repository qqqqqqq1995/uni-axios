module.exports = require('./lib/uniAxios');
// const uniAxios = axios.create({
// 	adapter: function (config) {
// 		return new Promise(function(resolve, reject) {
// 			console.log(config)
// 			uni.request({
// 				url: config.url,
// 				method: config.method,
// 				data: config.data,
// 				header: config.header,
// 				complete(response) {
// 					response.config = config
// 					if(config.validateStatus(response.statusCode)){
// 						resolve(response)
// 					} else {
// 						reject(response)
// 					}
// 				}
// 			})
// 		})
// 	}
// })

// export default uniAxios