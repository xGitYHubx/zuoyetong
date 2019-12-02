<template>
	<view style="margin-bottom: 80upx;">
		<view class="cu-card dynamic" :class="isCard?'no-card':''">
			<view class="cu-item shadow">

				<!-- 问题 -->
				<view class="cu-list menu-avatar">
					<view class="cu-item">
						<view class="cu-avatar round lg" :style="'background-image:url('+avatarDefault(task.avatarUrl)+');'"></view>
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
				<view :class="'cu-list menu-avatar comment '" v-for='(item,index) in msg' :key='index'>
					<view class="cu-item">
						<view class="cu-avatar round" :style="'background-image:url('+avatarDefault(item.avatarUrl)+');'"></view>
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
									<view class="bg-img" 
									:class="isCard?'':'only-img'" 
									v-for="(photo,index) in item.pictureBeans" :key="index" 
									:style="'background-image:url('+ avatarDefault(photo.url) +');'"
									@tap="ViewCommentImg(item.pictureBeans,index)"
									 >
									</view>
								</view>
							</view>
							<view class="margin-top-sm text-gray text-sm flex justify-between">
								<view class="text-gray text-df">{{item.createTime}}</view>
								<view class='rw-caiyong'  >
									<text class="cuIcon-appreciatefill text-red" 
										v-if="isPublishMan&& !task.hasBest" 
										@click="pickBestComment(item.commentId)">采用</text>     
									<text class="cuIcon-check text-green" v-if="item.isBest==1">已采用</text>
									<!-- <text class="cuIcon-messagefill text-gray margin-left-sm"></text> -->
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
				taskId:"",
				commentText: ""
			};
		},
		onLoad(options) {
			this.taskId = options.taskId
			this.getTask()
			this.getMsg()
		},
		onShow() {
			this.isMine = uni.getStorageSync('account') == this.task.account ? true : false
			// console.log(this.isMine);
			// this.taskImg=[]
			// this.getTaskImg()
		},
		computed:{
			isPublishMan(){
				if(uni.getStorageSync('account')==this.task.account){
					return true
				}else{
					false
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
					url:`./RWcomment?task=${encodeURIComponent(JSON.stringify(this.task))}`
				})
			},
			//获取任务里的图片
			getTaskImg() {
				var _this = this
				this.RWajax.get("/picture/query",{
						linkId: _this.task.taskId
					}).then(res=>{
							if(res.data.success==true){
							for (var i = 0; i < res.data.result.result.length; i++) {
								_this.taskImg.push(res.data.result.result[i].url)
							}
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
			ViewCommentImg(photos,index){
				var urlArr=[]
				for (var i = 0; i < photos.length; i++) {
					urlArr.push(photos[i].url)
				}
				uni.previewImage({
					urls: urlArr,
					current: urlArr[index]
				});
			},
			pickBestComment(id) { //选取最佳评论
				// console.log(id);
				var _this = this
				
				this.RWajax.post("/comment/pick", {
						commentId: id,
						publisherAccount: uni.getStorageSync('account')
					}).then(res=>{
						if (res.data.success == true) {
							uni.showToast({
								title: "采用成功",
								icon: "success"
							})
						} else {
							uni.showToast({
								title: "采用失败:" + res.data.message,
								icon: 'none'
							})
						}
					})

			},
			//获取任务详情
			getTask(){
				var _this = this
				this.RWajax.get("/task/query/single",{
						taskId: _this.taskId
					}).then(res=>{
						console.log(res);
						if(res.data.success==true){
							_this.task=res.data.result
							_this.getTaskImg()
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
						uni.hideLoading()
					})

			},
			avatarDefault(url){
				return this.RWcommon.avatarDefault(url)
				// if(url){
				// 	return url
				// }else{
				// 	return "../../static/user/avatar.png"
				// }
			},
			//获取评论
			getMsg() {
				var _this = this
				
				this.RWajax.get("/task/query/comments",{
						taskId: this.taskId,
						account: uni.getStorageSync('account')
					}).then(res=>{
						console.log(res);
						if (res.data.success == true) {
							_this.msg = res.data.result
						}
					})
			}
		},
		watch:{
			task(newMsg,old){
			},
			msg(newMsg,old){
			},
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
		border-bottom: #dddddd solid 16upx;
	}
	.comment{
		/* border-radius: 10px; */
		border-bottom: #dddddd solid 8upx;
	
	}
	.rw-caiyong text{
		margin: 0 10upx;
	}
</style>
