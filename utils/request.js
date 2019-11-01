var defaultConfig = {
	validateStatus: function validateStatus(status) {
		return status >= 200 && status < 300
	}
}

function mergeConfig(config1, config2) {
	const valueFromConfig2Keys = ['url', 'method', 'date']
	const mergeDeepPropertiesKeys = ['header']
	const defauleToConfig2Keys = ['baseUrl', 'url', 'validateStatus']
	var config = {}
	
	//config2传过来的配置
	valueFromConfig2Keys.forEach(function(prop) {
		if(typeof config2[prop] !== 'undefined'){
			config[prop] = config2[prop]
		}
	})
	mergeDeepPropertiesKeys.forEach(function(prop) {
		if(typeof config2[prop] !== 'undefined'){
			config[prop] = config2[prop]
		}
	})
	//默认config2
	defauleToConfig2Keys.forEach(function(prop) {
		if (typeof config2[prop] !== 'undefined') {
			config[prop] = config2[prop]
		} else if (typeof config1[prop] !== 'undefined') {
			config[prop] = config1[prop]
		}
	})

	return config
}

function InterceptorManager() {
	this.handlers = []
}

InterceptorManager.prototype.use = function use(fulfilled, rejected) {
	this.handlers.push({
		fulfilled: fulfilled,
		rejected: rejected,
	})
	return this.handlers.length -1
}

InterceptorManager.prototype.eject = function eject(id) {
	if(this.handlers[id]) {
		this.handlers[id] = null
	}
}

InterceptorManager.prototype.forEach = function (fn) {
	const fa = []
	forEach(this.handlers, function forEachHandler(handler) {
		if(handler !== null){
			fn(handler)
		}
	})
	
}

function uniRequest(config) {
	return new Promise(function(resolve, reject) {
		uni.request({
			url: config.url,
			method: config.method,
			data: config.data,
			header: config.header,
			complete(response) {
				if(config.validateStatus(response.statusCode)){
					resolve(response)
				} else {
					reject(response)
				}
			}
		})
	})
}

function UniRequest(config) {
	this.defaultConfig = config
	this.interceptors = {
		request: new InterceptorManager(),
		response: new InterceptorManager(),
		after: new InterceptorManager()
	}
}

// 匿名函数在调用的时候初始化
UniRequest.prototype.request = function request(config) {
	if(typeof config === 'string'){
		config = arguments[1] || {}
		config.url = arguments[0]
	}
	// 合并config
	config = mergeConfig(this.defaultConfig, config)
	console.log(config)
	if(config.method){
		config.method = config.method.toUpperCase()
	} else {
		config.method = 'GET'
	}
	
	const chain = [uniRequest, undefined]
	var promise = Promise.resolve(config)
	console.log(this.interceptors)
	this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor){
		chain.unshift(interceptor.fulfilled, interceptor.rejected)
	})
	this.interceptors.response.forEach(function pushResponseInterceptors(interceptor){
		chain.push(interceptor.fulfilled, interceptor.rejected)
	})
	
	while(chain.length) {
		promise = promise.then(chain.shift(), chain.shift())
	}
	
	this.interceptors.after.forEach(function afterInterceptors(interceptor){
		promise = promise.finally(interceptor.fulfilled)
	})
	
	return promise
}

const methods = ['get', 'post', 'put', 'delete', 'connect', 'head', 'options', 'trace']
methods.forEach(function(method) {
	UniRequest.prototype[method] = function(url, config) {
		return this.request(mergeConfig(config || {}, {url: url, method: method}))
	}
})

const toString = Object.prototype.toString
function isArray(val) {
	return toString.call(val) === '[object Array]'
}

function forEach(obj, fn) {
	if(obj === null || typeof obj === 'undefined'){
		return
	}
	if(typeof obj !== 'object'){
		obj = [obj]
	}
	if(isArray(obj)){
		for (var i = 0; i < obj.length; i++) {
			fn.call(null, obj[i], i, obj)
		}
	} else {
		for (var key in obj) {
			fn.call(null, obj[key], key, obj)
		}
	}
}

function createInstance (defaultConfig) {
	const context = new UniRequest(defaultConfig)
	
	const instance = function wrap() {
		return UniRequest.prototype.request.apply(context, arguments)
	}
	
	// forEach(UniRequest.prototype, function (val, key) {
	// 	console.log(key, val)
	// 	instance[key] = function() {
	// 		return val.apply(context, arguments)
	// 	}
	// })
	forEach(context, function(val, key){
		instance[key] = val
	})
	
	return instance
}

const request = createInstance(defaultConfig)
request.interceptors.request.use(function(config){
	uni.showLoading({
		title: '加载中...',
		mask: true
	})
	return config
}, function(err) {
	return Promise.reject(err)
})
request.interceptors.response.use(function(response){
	return response.data.data
}, function(err) {
	return Promise.reject(err.data)
})
request.interceptors.after.use(function(){
	uni.hideLoading()
})

export default request