<template>
	<view style="margin-bottom: 80upx;">
		<view class="cu-card dynamic" :class="isCard?'no-card':''">
			<view class="cu-item shadow">

				<!-- 问题 -->
				<view class="cu-list menu-avatar">
					<view class="cu-item">
						<view class="cu-avatar round lg" :style="'background-image:url('+task.avatarUrl+');'"></view>
						<view class="content flex-sub">
							<view>{{task.name||task.account}}</view>
							<view class="text-gray text-sm flex justify-between">
								{{task.createTime}}
							</view>
						</view>
					</view>
				</view>
				<view class="text-content">
					{{task.descText}}
				</view>

				<view class="image">
					<image class="task-img" v-for="(item,index) in taskImg" :key="index" :src="item" mode="widthFix" @tap="ViewImage" :data-url="item"></image>
				</view>
				<view class="text-orange cuIcon-coin text-right padding RW-border-bottom">{{task.reward}}
					<!-- <text class='cuIcon-coin text-orange'></text> -->
				</view>



				<!-- 评论列表 -->
				<view :class="'cu-list menu-avatar comment '" v-for='item in msg' :key='item.commentId'>
					<view class="cu-item">
						<view class="cu-avatar round" :style="'background-image:url('+item.avatarUrl+');'"></view>
						<view class="content">
							<view class="text-grey">{{item.name||item.account}}</view>
							<view class="text-gray text-content text-df">
								{{item.commentText}}
								<!-- <view class="grid flex-sub padding-lr" :class="isCard?'col-3 grid-square':'col-1'">
									<image 
										v-for="(item,index) in item" 
										:key="index" :src="item" 
										mode="widthFix" @tap="ViewImage" 
										:data-url="item"
										class="bg-img" :class="isCard?'':'only-img'"
										></image>
								</view> -->
								<view class="grid flex-sub padding-lr" :class="isCard?'col-3 grid-square':'col-1'">
									<view class="bg-img" :class="isCard?'':'only-img'" :style="'background-image:url(https://ossweb-img.qq.com/images/lol/web201310/skin/big10006.jpg);'"
									 v-for="(item,index) in isCard?9:1" :key="index">
									</view>
								</view>
							</view>
							<view class="margin-top-sm text-gray text-sm flex justify-between">
								<view class="text-gray text-df">{{item.createTime}}</view>
								<view @click="pickBestComment(item.commentId)" v-if="isPublishMan">
									<text class="cuIcon-appreciatefill text-red">采用</text>
									<!-- <text class="cuIcon-messagefill text-gray margin-left-sm"></text> -->
								</view>
								<!-- <view class="cu-tag bg-blue" v-if="item.isBest==1">已采用</view> -->
								<view>
									<text class="cuIcon-check text-green" v-if="item.isBest==1">已采用</text>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>



		<!-- 评论输入栏 -->
		<view class="cu-bar input rw-bottom-bar">
			<!-- <view class="action">
				<text class="cuIcon-sound text-grey"></text>
			</view> -->
			<input 
				@input="changeCommentText" 
				:value="commentText" 
				:adjust-position="false" 
				class="solid-bottom" 
				@focus="toEditComment"
				maxlength="300" cursor-spacing="10"></input>
			<!-- <view class="action">
				<text class="cuIcon-emojifill text-grey"></text>
			</view> -->
			<button class="cu-btn bg-green shadow-blur" @click="toEditComment">输入评论</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				isCard: true,
				isMine: false,
				msg: [],
				taskImg: [],
				task: {},
				commentText: ""
			};
		},
		onLoad(options) {
			this.task =JSON.parse(decodeURIComponent(options.task));     // JSON.parse(options.task)
			console.log(this.task.avatarUrl);
			this.commentText=options.comment||""
			this.getMsg()
		},
		onShow() {
			this.isMine = uni.getStorageSync('account') == this.task.account ? true : false
			// console.log(this.isMine);
			this.taskImg=[]
			this.getTaskImg()
		},
		computed:{
			isPublishMan(){
				if(uni.getStorageSync('account')==this.task.account){
					return true
				}else{
					return false
				}
			}
		},
		methods: {
			changeCommentText(e) {
				this.commentText = e.detail.value
			},
			IsCard(e) {
				this.isCard = e.detail.value
			},
			toEditComment(){
				uni.redirectTo({	
					url:`./RWcomment?task=${ encodeURIComponent(JSON.stringify(this.task)) }`
				})
			},
			getTaskImg() {
				var _this = this
				this.RWajax.get("/photo/query", {
						linkId: _this.task.taskId
					}).then(res=>{
						// console.log(res);
						if(res.data.success==true){
							for (var i = 0; i < res.data.result.length; i++) {
								_this.taskImg.push(res.data.result[i].url)
							}
							// _this.taskImg=res.data.result
						}
					})
			},
			//预览图片
			ViewImage: function(e) {
				uni.previewImage({
					urls: this.taskImg,
					current: e.currentTarget.dataset.url
				});
			},
			pickBestComment(id) { //选取最佳评论
				// console.log(id);
				var _this = this
				this.RWajax.post("/comment/pick",{
						commentId: id,
						account: uni.getStorageSync('account')
					}).then(res=>{
						console.log(res);
						if (res.data.success == true) {
							uni.showToast({
								title: "采用成功",
								icon: "success",
								success() {
									_this.msg=[]
									_this.getMsg()
								}
							})
						} else {
							uni.showToast({
								title: "采用失败" + res.data.result,
								icon: 'none'
							})
						}
					})
			},
			//发表评论
			sendCommen() {
				var _this = this
				uni.showLoading({
					title: '评论中...',
					mask: true
				});
				this.RWajax.post("/comment/publish",{
						account: uni.getStorageSync('account'),
						taskId: _this.task.taskId,
						commentText: _this.commentText
					}).then(res=>{
						console.log(res);
						if (res.data.success == true) {
							uni.showToast({
								title: '发送成功'
							})
						} else {
							uni.showToast({
								title: '发送失败'
							})
						}
						_this.getMsg()
					}).finally(res=>{
						console.log(res);
						uni.hideLoading()
					})
			},
			//获取评论
			getMsg() {
				var _this = this
				this.RWajax.get("/task/query/comments",{
						taskId: this.task.taskId,
						account: uni.getStorageSync('account')
					}).then(res=>{
						if (res.data.success == true) {
							console.log(res.data.result);
							_this.msg = res.data.result
						}
					})
			}
		}
	}
</script>

<style>
	.rw-bottom-bar {
		position: fixed;
		bottom: 0px;
		width: 100%;
	}
	.task-img{
		width: 650upx;
		margin: 10upx 50upx;
	}
</style>

<style scoped>
	.RW-border-bottom{
		border-bottom: #999999 solid 12upx;
	}
</style>
