var app = getApp();
var com = app.com || {};
com.lightningdog = com.lightningdog || {};
com.lightningdog.rrq = com.lightningdog.rrq || {};
var _global = com.lightningdog.rrq.global;

function request(_method, _url, _data, callback) {
	console.log("request url=" + _url);
	return new Promise((resolve, reject) => {
		wx.request({
			url: _url,
			method: _method,
			data: _data,
			header: {
				'Content-Type': 'application/json'
			},
			success(request) {
				var data = request.data;
				if (typeof data.errcode == 'undefined' || data.errcode > 0) {
					reject({ data, callback });
				} else {
					resolve({ data, callback });
				}
			},
			fail(error) {
				console.log(error)
				reject({
					errcode: -1,
					message: "亲，访问异常，稍后重试！！！"
				});
			}
		})
	})
}
function creatUploadPromise(item, _data, _url) {
	return new Promise((resolve, reject) => {
		wx.uploadFile({
			url: _url,
			filePath: item,
			name: 'file',
			formData: _data,
			success(res) {
				if (res.data) {
					let data = JSON.parse(res.data)
					if (data.errcode == 0) {
						resolve()
					} else {
						reject(data.message)
					}
				}
			},
			fail(err) {
				reject(err.message)
			}
		})
	})
}
function RequestHelper(baseURL, services) {
	this._baseURL = baseURL;
	this._services = services;

	this.resolve = (data) => {
		console.log("resolve, data=" + data);
		if (data.callback) {
			data.callback(data.data.errcode, data.data.result);
			// this._done(data.errcode, data.result);
		}
	}
	this.reject = (data) => {
		console.log("reject data=" + data);
		wx.hideLoading({});
		if (data.data.callback && data.data.errcode) {
			data.callback(data.data.errcode, data.data.message);
			return;
		}
		wx.showToast({
			title: '亲， 网络异常， 请稍后重试！',
			icon: 'none',
			duration: 2000
		})
	}
	this.setPromise = (arr) => {
		this._promiseArr = arr;
		return this;
	}
	this.done = (callback, isGetPromise) => {
		if (isGetPromise) return request(this._method, this._url, this._data, callback);

		request(this._method, this._url, this._data, callback).then(this.resolve, this.reject);
		return this;
	}
	this.post = (module, funcName, data) => {
		this._method = "post";
		this._data = data;
		this._url = this._baseURL + ':' + this._services[module]['name'] + "/" + this._services[module]['funcs'][funcName];
		return this;
	}
	this.goon = (callback) => {
		Promise.all(this._promiseArr).then((res) => {
			wx.hideLoading({});
			callback(res);
		}).catch((err) => {
			wx.hideLoading({});
			wx.showToast({
				title: err.data ? err.data.message : err.message,
				icon: 'none'
			})
		});
	}
	this.uploadImg = (module, funcName, imgArray, id, token, idName) => {
		let subUrlFun = this._services[module]['funcs'][funcName];
		this._url = this._baseURL + ':' + this._services[module]['name'] + "/" + subUrlFun(id);
		this._promiseArr = [];

		imgArray.forEach((item, index) => {
			let params = {
				token: token,
				module: module, //默认值，不需要修改
				count: index, //图片的下标,从0开始
				total: imgArray.length //上传图片的总数
			}
			params[idName] = id;
			this._promiseArr.push(creatUploadPromise(item, params, this._url));
		})
		return this;
	}
	this.gget = (module, funcName, data, method = "get") => {
		this._method = method;
		this._data = data;
		let func = this._services[module]['funcs'][funcName];
		this._url = this._baseURL + ':' + this._services[module]['name'] + "/" + func(data);
		return this;
	}
}

var _baseURL = com.lightningdog.rrq.config.baseURL;
var _services = com.lightningdog.rrq.services.collections;

(function (NS, request) {
	NS.request = request;
	module.exports = NS.config;
})(com.lightningdog.rrq, new RequestHelper(_baseURL, _services))
