<template>
	<view class="page_login">
		<!-- 头部logo -->
		<view class="head">
			<view class="head_bg">
				<view class="head_inner_bg">
					<image style="width: 55px;height: 65px;" :src="imgInfo.head" class="head_logo" />
				</view>
			</view>
		</view>
		<!-- 登录form -->
		<view class="login_form">
			<view class="input">
				<view class="img">
					<image style="width:27px;height: 27px;" :src="imgInfo.icon_user" />
				</view>
				<input type="text" v-model="username" placeholder="请输入用户账号">
				<view class="img">
					<image @tap="delUser" class="img_del" :src="imgInfo.icon_del" />
				</view>
			</view>
			<view class="line" />
			<view class="input">
				<view class="img">
					<image style="width:20px;height: 25px;" :src="imgInfo.icon_pwd" />
				</view>
				<input :type="pwdType" :value="userpwd" @input="inputPwd" placeholder="请输入密码">
				<view class="img" @tap="switchPwd">
					<image class="img_pwd_switch" :src="imgInfo.icon_pwd_switch" />
				</view>
			</view>
		</view>
		<!-- 登录提交 -->
		<button class="submit" type="primary" @tap="login">登录</button>
		<button class="submit2" type="default" @tap="loginByCustom">游客浏览</button>
		<view class="opts">
			<text @tap="goReg" class="text">立即注册</text>
			<text @tap="findPwd" class="text">忘记密码？</text>
		</view>
		<view class="quick_login_line">
			<view class="line" />
			<text class="text">END</text>
			<view class="line" />
		</view>
		<!-- <view class="quick_login_list">
			<image @tap="thirdLogin('qq')" class="item" :src="imgInfo.qq" />
			<image @tap="thirdLogin('wechat')" class="item" :src="imgInfo.wechat" />
			<image @tap="thirdLogin('weibo')" class="item" :src="imgInfo.weibo" />
		</view> -->
	</view>
</template>
<script>
	import initData from '../../common/initData.js'
	export default {
		onShow() {
			var icon = plus.nativeObj.View.getViewById("icon");
			setTimeout(function() {
				// icon.hide();
			}, 200);
		},
		data() {
			const isUni = typeof(uni) !== 'undefined'
			return {
				username: '',
				userpwd: '',
				pwdType: 'password',
				imgInfo: {
					head: isUni ? '/static/login-reg/head.png' : require('./images/head.png'),
					icon_user: isUni ? '/static/login-reg/icon_user.png' : require('./images/icon_user.png'),
					icon_del: isUni ? '/static/login-reg/icon_del.png' : require('./images/icon_del.png'),
					icon_pwd: isUni ? '/static/login-reg/icon_pwd.png' : require('./images/icon_pwd.png'),
					icon_pwd_switch: isUni ? '/static/login-reg/icon_pwd_switch.png' : require('./images/icon_pwd_switch.png'),
					qq: isUni ? '/static/login-reg/qq.png' : require('./images/qq.png'),
					wechat: isUni ? '/static/login-reg/wechat.png' : require('./images/wechat.png'),
					weibo: isUni ? '/static/login-reg/weibo.png' : require('./images/weibo.png')
				}
			}
		},
		onBackPress() {
			uni.showToast({
				title:'请登录/注册，或使用游客登录',
				icon:'none',
				success() {
				}
			})
			return true
		},
		methods: {
			inputUsername(e) {
				this.username = e.target.value//
			},
			inputPwd(e) {
				this.userpwd = e.target.value
			},
			delUser() {
				this.username = ''
			},
			switchPwd() {
				this.pwdType = this.pwdType === 'text' ? 'password' : 'text'
			},
			loginByCustom(){
				uni.showToast({
					title: '游客浏览...',
					icon: "loading"
				})
				uni.setStorageSync('account',"custom")
				uni.switchTab({
					url:'/pages/tabbar/index/index',
					complete:(res)=>{
						uni.hideToast()
					}
				})
			},
			login() {
				if (this.username === "") {
					uni.showToast({
						icon: "none",
						title: "请输入用户名"
					})
					return;
				}
				if (this.userpwd === "") {
					uni.showToast({
						icon: "none",
						title: "密码不能为空"
					})
					return;
				}
				var _that=this
				this.RWajax.post("/user/login", {
						account: this.username,
						password:this.userpwd,
					}).then(res=>{
						console.log(res)
						if(res.data.success==true){
							uni.showToast({
								title: '登陆成功',
								icon: "success"
							})
							uni.setStorageSync('token',res.data.result)
							uni.setStorageSync('account',this.username)
							uni.setStorageSync('isLogin','true')
							initData.getUserInfo()
							initData.getBalance()
							uni.switchTab({
								url:'/pages/tabbar/index/index',
								complete:(res)=>{
									uni.hideToast()
								}
							})
						}else{
							uni.showToast({
								title: res.data.message,
								icon: "none",
							})	
						}
					})
			},
			findPwd() {
				uni.navigateTo({
					url:'/pages/find-pwd/find-pwd'
				})
			},
			goReg() {
				uni.navigateTo({
					url:'/pages/reg-pwd/reg-pwd'
				})
			},
			thirdLogin(type) {
				console.log(type)
			}
		}
	}
</script>
<style>
	page {
		height: auto;
		min-height: 100%;
		background-color: #f5f6f8;
	}
</style>
<style lang="scss" scoped>
	$logo-padding: 60px;
	$form-border-color: rgba(214, 214, 214, 1);
	$text-color: #B6B6B6;

	.page_login {
		padding: 10px;
	}

	.head {
		display: flex;
		align-items: center;
		justify-content: center;
		padding-top: 10px;
		padding-bottom: 30px;

		.head_bg {
			border: 1px solid #fbecf1;
			border-radius: 50px;
			width: 100px;
			height: 100px;
			display: flex;
			align-items: center;
			justify-content: center;

			.head_inner_bg {
				border-radius: 40px;
				width: 80px;
				height: 80px;
				display: flex;
				background-color: #4191ea;
				align-items: flex-end;
				justify-content: center;
				overflow: hidden;
			}
		}
	}

	.login_form {
		display: flex;
		margin: 20px;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		border: 1px solid $form-border-color;
		border-radius: 10px;

		.line {
			width: 100%;
			height: 1px;
			background-color: $form-border-color;
		}

		.input {
			width: 100%;
			max-height: 45px;
			display: flex;
			padding: 3px;
			flex-direction: row;
			align-items: center;
			justify-content: center;

			.img {
				min-width: 40px;
				min-height: 40px;
				margin: 5px;
				display: flex;
				align-items: center;
				justify-content: center;
			}

			.img_del {
				width: 21px;
				height: 21px;
			}

			.img_pwd_switch {
				width: 28px;
				height: 12px;
			}

			input {
				outline: none;
				height: 30px;
				width: 100%;

				&:focus {
					outline: none;
				}
			}
		}
	}

	.submit {
		margin-top: 30px;
		margin-left: 20px;
		margin-right: 20px;
		color: white;
		background-color: #4191ea;
		-webkit-tap-highlight-color: #4191ea;

		&:active {
			color: #B6B6B6;
			background-color: rgba(63, 145, 234, 0.8);
		}
	}
	.submit2 {
		margin-top: 30px;
		margin-left: 20px;
		margin-right: 20px;
		color: gray;
		// background-color: #4191ea;
		-webkit-tap-highlight-color: #4191ea;

		&:active {
			color: #B6B6B6;
			background-color: rgba(63, 145, 234, 0.8);
		}
	}
	.opts {
		margin-top: 5px;
		margin-left: 25px;
		margin-right: 25px;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;

		.text {
			font-size: 13px;
			color: $text-color;
		}
	}

	.quick_login_line {
		margin-top: 40px;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;

		.line {
			height: 1px;
			width: 38%;
			background-color: rgba(211, 211, 213, 1);
		}

		.text {
			font-size: 13px;
			color: rgba(200, 200, 200, 1);
			margin: 2px;
		}
	}

	.quick_login_list {
		margin-top: 30px;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;

		.item {
			width: 50px;
			height: 50px;
			margin: 20px;
		}
	}
</style>
