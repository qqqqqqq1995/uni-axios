// import uniAxios from './../dist/uni-axios.min.js';
import uniAxios from './../index.js';
// uniAxios.defaults.baseURL = '';
uniAxios.interceptors.first.use(function (config){
	console.log(config)
	var showLoading = config.showLoading;
	if(showLoading){
		uni.showLoading({
			mask: true,
			title: showLoading === true ? '加载中...' : showLoading
		})
	}
	return config;
}, function (err){
	return Promise.reject(err);
})
uniAxios.interceptors.response.use(function (response){
	console.log(response)
	return response;
}, function (err) {
	return Promise.reject(err);
})
uniAxios.interceptors.last.use(function (config){
	console.log(config);
	if(config.showLoading){
		uni.hideLoading();
	}
})

module.exports = uniAxios