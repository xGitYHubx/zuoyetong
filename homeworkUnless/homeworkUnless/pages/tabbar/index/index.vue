<!-- 主页 -->


<template>
	<view>
		<view class="img-view">
			<image class="img" src="../../../static/img/index_bg.jpg" />
			</image>
			<view class="user-info">
				<!-- <view v-if="isLogin" class="user-avatar">
					<image style="width: 100%;height: 100%;" src="../../../static/avatar_boy.png"></image>
				</view>
				<view v-else @click="goLogin" class="user-text">
					注册/登录
				</view> -->
			</view>
			<view class="img-button" :style="{left: leftPos + 'px'}" @click="handlePublish">
				<image class="img-button-img" src="../../../static/img/index_photo.png" />
				<text class="img-button-text">拍照发题</text>
			</view>
		</view>
		<view class="my-scroll">
			<view class="Shead">
				<view class="Shead_text">首页</view>
			</view>
			<view class="Scontainer">
				<view class="Scontent" @click="GetDetails(item.recmdId)" v-for="(item,index) in news" :key='index'>
					<view class="left_text">
						<view class="title" v-html="item.title">
							<!-- {{item.title}} -->
						</view>
				<!-- 		<view class="content" v-html='item.content'>

						</view> -->
					</view>
					<view class="right_image">
						<image class="right_img" :src="item.sketch" mode="RGB"></image>
					</view>
				</view>
			</view>
		</view>
		<view class="rw-page-loading" v-if='isLoading'>
			{{loadingMsg}}
		</view>
	</view>
</template>

<script>
	var bitmap = null;
	export default {
		data() {
			return {
				page:0,
				leftPos: 0,
				isLogin: false,
				// news: [{
				// 		title: '<p>余秋雨课堂开课啦，30万人已经报名</p>',
				// 		content: '热门活动 · 100000+浏览',
				// 		sketch: "../../../static/img/index_bg.jpg"
				// 	},
				// 	{
				// 		title: '<p>余秋雨课堂开课啦，30万人已经报名</p>',
				// 		content: '热门活动 · 100000+浏览',
				// 		sketch: "../../../static/img/index_bg.jpg"
				// 	},
				// 	{
				// 		title: '<p>余秋雨课堂开课啦，30万人已经报名</p>',
				// 		content: '热门活动 · 100000+浏览',
				// 		sketch: "../../../static/img/index_bg.jpg"
				// 	},
				// 	{
				// 		title: '<p>余秋雨课堂开课啦，30万人已经报名</p>',
				// 		content: '热门活动 · 100000+浏览',
				// 		sketch: "../../../static/img/index_bg.jpg"
				// 	},
				// 	{
				// 		title: '<p>余秋雨课堂开课啦，30万人已经报名</p>',
				// 		content: '热门活动 · 100000+浏览',
				// 		sketch: "../../../static/img/index_bg.jpg"
				// 	},
				// 	{
				// 		title: '<p>余秋雨课堂开课啦，30万人已经报名</p>',
				// 		content: '热门活动 · 100000+浏览',
				// 		sketch: "../../../static/img/index_bg.jpg"
				// 	},
				// 	{
				// 		title: '<p>余秋雨课堂开课啦，30万人已经报名</p>',
				// 		content: '热门活动 · 100000+浏览',
				// 		sketch: "../../../static/img/index_bg.jpg"
				// 	},
				// 	{
				// 		title: '<p>余秋雨课堂开课啦，30万人已经报名<p>',
				// 		content: '热门活动 · 100000+浏览',
				// 		sketch: "../../../static/img/index_bg.jpg"
				// 	},
				// 	{
				// 		title: '<p>余秋雨课堂开课啦，30万人已经报名</p>',
				// 		content: '热门活动 · 100000+浏览',
				// 		sketch: "../../../static/img/index_bg.jpg"
				// 	},


				// ],
				isLoading: false,
				loadingMsg: "加载中...",
				news:[],
			};
		},
		onNavigationBarButtonTap() {
			this.handlePublish();
		},
		onShow() {
			this.checkLogin()
			this.leftPos = Math.ceil((plus.screen.resolutionWidth - 128) / 2)
			const icon = plus.nativeObj.View.getViewById("icon");
			if (icon) {
				setTimeout(function() {
					icon.show();
				}, 100);
			}
			
		},
		onLoad() {
			this.getrecmd(0)
			this.isLogin = uni.getStorageSync('isLogin')
			// console.log(this.isLogin)
			bitmap = new plus.nativeObj.Bitmap('bmp1');
			bitmap.loadBase64Data(
				'data:image/png;base64,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',
				function() {},
				function(e) {});
			// this.createtab();
			

		},
		onReachBottom(){
			
			this.isLoading=true
			this.getrecmd(this.page+1);
		},
		methods: {
			createtab: function() {
				// 设置水平居中位置
				var leftPos = Math.ceil((plus.screen.resolutionWidth - 60) / 2);
				var view = new plus.nativeObj.View('icon', {
					bottom: '19px',
					left: leftPos + 'px',
					width: '60px',
					height: '60px'
				});
				view.drawBitmap(bitmap, {
					tag: 'font',
					id: 'icon',
					src: 'static/img/tabbar/photo_press.png',
					position: {
						top: '0px',
						left: '5px',
						width: '50px',
						height: '100%'
					}
				});
				view.addEventListener("click", function(e) {
					uni.navigateTo({
						url: "../../publish/RWpublish"
					})
				}, false);
				view.show();
			},
			handlePublish: function() {
				uni.navigateTo({
					url: "../../publish/RWpublish"
				})
			},
			getrecmd(page) {
				this.RWajax.get('/recmd/query',{
					page:page
				}).then(res=>{
					console.log(res)
					if(res.data.success){	
						if(res.data.result.length>0){
							
						console.log(res.data.result)
						this.news=this.news.concat(res.data.result);
						this.page++;
						}
						else{
							
						}
					}else{
						
					}
					this.isLoading=false;
				})

			},
			GetDetails(id){
				uni.navigateTo({
					url: "./Recommend?"+"id="+id,
				})
			},
			goLogin() {
				uni.navigateTo({
					url: "../../login/login"
				})
			},
			checkLogin() {
				if (!uni.getStorageSync('account')) {
					uni.navigateTo({
						url: "../../login/login"
					})
				}
			}
		}
	};
</script>

<style lang="scss">
	/* .content {
	text-align: center;
	height: 400upx;
	margin-top: 200upx;
} */
	// .status_bar {
	//    height: var(--status-bar-height);
	//    width: 100%;
	// }
	.img-view {
		width: 100%;
		height: 332px;
		position: fixed;
		top: 0;
		z-index: 1;
	}

	.img-view .img {
		width: 100%;
		height: 100%;
	}

	.img-view .img-button {
		position: fixed;
		top: 120px;
		width: 128px;
		height: 128px;
		margin: 0 auto;
		color: #FFFFFF;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		border-radius: 100%;
		background-color: rgba(229, 229, 229, .18);
		animation: breathe 3s infinite;
	}

	@keyframes breathe {
		0% {
			transform: scale(.99);
		}

		50% {
			transform: scale(1.1);
		}

		100% {
			transform: scale(.99);
		}
	}

	.img-view .img-button-img {
		width: 50%;
		height: 50%;
	}

	.img-view .img-button-text {
		font-size: 32upx;
		font-weight: normal;
	}

	.my-scroll {
		margin-top: 300px;
		padding: 20upx;
		position: absolute;
		z-index: 999;
		width: 100%;
		background-color: #FFFFFF;
		border-radius: 32px;
		box-shadow: -2px 1px 20px 0px grey;
	}

	.user-info {
		width: 72upx;
		height: 72upx;
		position: fixed;
		top: 72px;
		left: 12upx;
		z-index: 998;

		.user-avatar {
			width: 100%;
			height: 100%;
		}

		.user-text {
			width: 100%;
			height: 100%;
			font-size: 8px;
			display: flex;
			align-items: center;
			text-align: center;
			background-color: #555555;
			color: #B2B2B2;
			border-radius: 50%;
		}
	}

	.Shead {
		width: 100%;
		height: 80upx;
	}

	.Shead_text {
		font-size: 50upx;
		width: 100upx;
		margin: 0 auto;
	}

	.Scontent {
		width: 100%;
		height: 200upx;
		border-top: 1px solid rgb(233, 233, 233);
	}

	.left_text {
		width: 520upx;
		height: 100%;
		padding: 20upx;
		float: left;
	}

	.right_image {
		float: left;
		width: 180upx;
		height: 180upx;
		border-radius: 40upx;
		overflow: hidden;
		padding: 20upx;
	}

	.right_image .right_img {
		width: 100%;
		height: 100%;
		border-radius: 40upx;
	}

	.title {
		height: 130upx;
		font-size: 34upx;
	}

	.content {
		font-size: 26upx;
		height: 50px;
		color: rgb(205, 205, 205);
	}
	.rw-page-loading{
		width: 100%;
		color: black;
		z-index: 1000;
		position: fixed;
		height: 20px;
		bottom: 0;
	}
</style>
