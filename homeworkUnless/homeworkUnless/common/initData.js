//初始化余额
const $host = "http://47.93.22.56:8082"

function getBalance() {
	var 
	 balance= -1
	uni.request({
		url: $host + '/user/query/coin',
		header: {
			"Authorization": uni.getStorageSync('token')
		},
		method: 'GET',
		data: {
			account: uni.getStorageSync('account')
		},
		success: res => {
			console.log(res);
			if (res.data.success == true) {
				uni.setStorageSync('balance', res.data.result)
				balance=res.data.result
			}else{
				uni.clearStorageSync();
				uni.setStorageSync('account','custom')
				// uni.showModal({
				// 	content:res.data,
				// 	showCancel:false,
				// 	success(confirm,cancel) {
				// 		if(confirm){
				// 			uni.switchTab({
				// 				url:"../index/index"
				// 			})
				// 		}
				// 	}
				// })
			}
		},
		fail: () => {},
		complete: (res) => {
			return balance
		}
	});
}

//获取用户信息存到storage
function getUserInfo() {
	var _this = this
	var token = uni.getStorageSync('token')
	var account = uni.getStorageSync('account')
	if (!account||account=='custom') {
		return '未登录'
	} else {
		uni.request({
			url: $host + "/user/query/info",
			method: "get",
			data: {
				'account': account
			},
			header: {
				'Authorization': token
			},
			success(res) {
				var data = res.data.result
				uni.setStorageSync('userInfo',data)
			},
			complete(res) {
			}
		})
	}
	
}

function checkLogin() {
	var account=uni.getStorageSync('account')
	if (!account|| account == 'custom') {
		uni.showToast({
			title:'尚未登录',
			icon:'none'
		})
		
		return false
		// uni.showModal({
		// 	title: '尚未登录',
		// 	content: '点击确认按钮前往登陆/注册',
		// 	showCancel: true,
		// 	cancelText: '取消',
		// 	confirmText: '确认',
		// 	success: res => {
		// 		if (res.confirm) {
		// 			uni.redirectTo({
		// 				url: "../../login/login"
		// 			})
		// 		}
		// 	},
		// 	fail: () => {},
		// 	complete: () => {}
		// });
	}
}




const initData = {
	getBalance: getBalance,
	getUserInfo: getUserInfo,
	checkLogin:checkLogin
}
module.exports = initData
