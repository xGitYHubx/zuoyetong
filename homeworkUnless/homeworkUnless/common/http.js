//封装请求

const baseUrl ="http://47.93.22.56:8082";  
const RWajax = (opts, data) => {
    let httpDefaultOpts = {
        url: baseUrl+opts.url,
        data: data,
		success:(res)=>{
			console.log(res.data)
			console.log('进入拦截器')
		}
        method: opts.method || "post",
        header: opts.method == 'get' ? {
        'X-Requested-With': 'XMLHttpRequest',
        "Accept": "application/json",
        "Content-Type": "application/json; charset=UTF-8"
    } : {
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    },
        dataType: 'json',
    }
    let promise = new Promise(function(resolve, reject) {
        uni.request(httpDefaultOpts).then(
            (res) => {
                resolve(res[1])
            }
        ).catch(
            (response) => {
                reject(response)
            }
        )
    })
    return promise
};
//带Token请求
const RWtokenAjax = (opts, data) => {
	let token = "";
	uni.getStorage({
		key: 'token',
		success: function(ress) {
			token = ress.data
		}
	});
    //此token是登录成功后后台返回保存在storage中的
    let httpDefaultOpts = {
        url: baseUrl+opts.url,
        data: data,
        method: opts.method,
        header: opts.method == 'get' ? {
		'Authorization': token,
        'X-Requested-With': 'XMLHttpRequest',
        "Accept": "application/json",
        "Content-Type": "application/json; charset=UTF-8"
    } : {
		'Authorization': token,
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    },
        dataType: 'json',
    }
    let promise = new Promise(function(resolve, reject) {
        uni.request(httpDefaultOpts).then(
            (res) => {
                resolve(res[1])
            }
        ).catch(
            (response) => {
                reject(response)
            }
        )
    })
    return promise
};
 
export default {
	    baseUrl,
		RWajax,
		RWtokenAjax					
}