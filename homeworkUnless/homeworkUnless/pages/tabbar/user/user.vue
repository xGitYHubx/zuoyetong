<!-- 个人中心页面 -->

<template>
	<view>
		<view class="header">
			<view class="bg">
				<view class="status_bar">
				          <!-- 这里是状态栏 -->
				</view>
				<view class="box">
					<view class="box-hd">
						<view class="avator"  @click="toDetail(0)" >
							<img :src="avatar">
						</view>
						<view class="phone-number" v-if="!isLogin" @click="goLogin">登录/注册</view>
						<!-- <view class="phone-number" v-if="isLogin">注销</view> -->
						<view class="coin-balance">
							<image style="height: 16px;width: 16px;" src="../../../static/coin.png"></image>
							<text>学币余额：{{balance}}</text>
						</view>
					</view>
					<view class="box-bd">
						<view class="item" @click="toDetail(3)">
							<view class="icon"><img src="../../../static/user/message.png"></view>
							<view class="text">我发布的</view>
						</view>
						<view class="item" @click="toDetail(4)">
							<view class="icon"><img src="../../../static/user/favorite.png"></view>
							<view class="text">我评论的</view>
						</view>
						<view class="item" @tap="contactService">
							<view class="icon"><img src="../../../static/user/service.png"></view>
							<view class="text">联系客户</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="list-content">
			<view class="list">
				<view class="li noborder" @click="toDetail(0)" >
					<view class="icon"><image src="../../../static/user/card.png"></image></view>
					<view class="text">我的信息</view>
					<image class="to" src="../../../static/user/to.png"></image>
				</view>
			</view>
			<view class="list">
				<!-- <view class="li " >
					<view class="icon"><image src="../../../static/user/help.png"></image></view>
					<view class="text">充值</view>
					<image class="to" src="../../../static/user/to.png"></image>
				</view> -->
				<view class="li " @click="toDetail(1)">
					<view class="icon"><image src="../../../static/user/about.png"></image></view>
					<view class="text">关于我们</view>
					<image class="to" src="../../../static/user/to.png"></image>
				</view>
				<view class="li " @click="toDetail(2)">
					<view class="icon"><image src="../../../static/user/recharge.png"></image></view>
					<view class="text">充值</view>
					<image class="to" src="../../../static/user/to.png"></image>
				</view>
				<view class="li " @click="Logout()">
					<view class="icon"><image src="../../../static/user/logout.png"></image></view>
					<view class="text">退出登录</view>
					<image class="to" src="../../../static/user/to.png"></image>
				</view>
			</view>
		</view>
	</view>
</template>
<script>
	import initData from "../../../common/initData.js"
	export default {
		data() {
			return {
				balance:uni.getStorageSync('balance')||0,
				isLogin:uni.getStorageSync('isLogin'),
				avatar:"../../../static/user/avatar.png"
			};
		},
		onLoad() {
			// this.fresh()
		},
		onShow() {
			this.leftPos = Math.ceil((plus.screen.resolutionWidth - 128) / 2)
			initData.getBalance()
			this.balance=uni.getStorageSync('balance')||0,
			this.getAvatar()
			initData.getUserInfo()//初始化用户信息
			const icon = plus.nativeObj.View.getViewById("icon");
			if (icon) {
				setTimeout(function() {
					icon.show();
				}, 100);
			}
		},
		methods: {
			contactService() {
				uni.makePhoneCall({
					phoneNumber: '15100287869'
				})
			},
			Logout(){
				uni.clearStorageSync();
				this.balance=0
				uni.switchTab({
					url:"../index/index"
				})
			},
			toDetail(type){
				if(type==0){
					uni.navigateTo({
						url: "./myMsg"
					})
				}
				if(type==1){
					uni.navigateTo({
						url: "./aboutUs"
					})
				}
				if(type==2){
					uni.navigateTo({
						url: "../../recharge/RWrechart/RWrechart"
					})
				}
				if(type==3){
					uni.navigateTo({
						url: "./myPublish"
					})
				}
				if(type==4){
					uni.navigateTo({
						url: "./myComment"
					})
				}
			},
			goLogin() {
				uni.navigateTo({
					url: "../../login/login"
				})
			},
			getAvatar() {
				var userInfo=uni.getStorageSync('userInfo')
				// console.log(userInfo);
				
				if(userInfo){
					if(userInfo.avatar){
						this.avatar=userInfo.avatar
					}else{
						this.avatar= '../../../static/user/avatar.png'
					}
				}else{
					this.avatar= '../../../static/user/avatar.png'
				}
			}
		},
		computed: {
			isLogin2(){
				return uni.getStorageSync('isLogin')
			}
		},
	}
</script>

<style lang="scss">
.status_bar {
   height: var(--status-bar-height);
   width: 100%;
}
page{
	background-color:#f1f1f1;
	font-size: 30upx;
}
.header{
	background: #fff;
	height: 500upx !important;
	padding-bottom: 140upx;
	.bg{
		width: 100%;
		height:200upx;
		padding-top:100upx;
		background-color:#4191ea;
	}
}
.box{
	width: 650upx;
	height: 320upx;
	border-radius: 20upx;
	margin: 0 auto;
	background: #fff;
	box-shadow: 0 5upx 20upx 0upx rgba(0, 0, 150, .2); 
	.box-hd{
		display: flex;
		flex-wrap: wrap;
		flex-direction: row;
		justify-content: center;
		.coin-balance {
			width: 100%;
			display: flex;
			align-items: center;
			justify-content: center;
		}
		.avator{
			width: 160upx;
			height: 160upx;
			background: #fff;
			border: 5upx solid #fff;
			border-radius: 50%;
			margin-top: -80upx;
			overflow: hidden;
			img{
				width: 100%;
				height: 100%;
			}
		}
		.phone-number{
			width: 100%;
			text-align: center;
		}
	}
	.box-bd{
		display: flex;
		flex-wrap: nowrap;
		flex-direction: row;
		justify-content: center;
		.item{
			flex: 1 1 auto;
			display: flex;
			flex-wrap: wrap;
			flex-direction: row;
			justify-content: center;
			border-right: 1px solid #f1f1f1;
			margin: 15upx 0;
			&:last-child{
				border: none;
			}
			.icon{
				width: 60upx;
				height: 60upx;
				img{
					width: 100%;
					height: 100%;
				}
			}
			.text{
				width: 100%;
				text-align: center;
				margin-top: 10upx;
			}
		}
	}
}
.list-content{
	background: #fff;
	margin-top: var(--status-bar-height);
}
.list{
	width:100%;
	border-bottom:15upx solid  #f1f1f1;
	background: #fff;
	&:last-child{
		border: none;
	}
	.li{
		width:92%;
		height:100upx;
		padding:0 4%;
		border-bottom:1px solid rgb(243,243,243);
		display:flex;
		align-items:center;
	&.noborder{
		border-bottom:0
		}
		.icon{
			flex-shrink:0;
			width:50upx;
			height:50upx;
			image{
				width:50upx;
				height:50upx;
			}
		}
		.text{
			padding-left:20upx;
			width:100%;
			color:#666;
		}
		.to{
			flex-shrink:0;
			width:40upx;
			height:40upx;
		}
	}
}
</style>
