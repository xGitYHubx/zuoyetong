import Vue from 'vue'
import App from './App'
Vue.config.productionTip = false
Vue.prototype.$host = "http://47.93.22.56:8082"


//全局函数 工具函数
import RWcommon from './common/utils.js'
Vue.prototype.RWcommon = RWcommon


import uni_request from './common/uni_request.js'

const request = uni_request({ // 有效配置项只有三个
	baseURL: "http://47.93.22.56:8082", //baseURL
	timeout: 11111, // 超时时间
	// heaers: {
	//     // 'x-custom-header': 'x-custom-header'
	// }
});

// console.log(request)
//  function relogin(){
// 	console.log("111111111111111")
// 	uni.navigateTo({
// 		url: "./pages/login/login"
// 	})
// }
request.interceptors.request.use(config => { // 请求拦截器（可以设置多个）
    config.headers.Authorization = uni.getStorageSync('token')||""
	console.log(config);
    return config
})
//添加拦截器


request.interceptors.response.use((response, next) => {
// 　console.log(response)//此处this为请求所在页面的Vue实例
   // console.log('进去拦截器')
   if(response.data.success){
	   
   }
	return response
});


Vue.prototype.RWajax = request









App.mpType = 'app'

const app = new Vue({
	...App
})
app.$mount()
