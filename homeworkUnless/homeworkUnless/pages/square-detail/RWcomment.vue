<template>
	<view>
		<form>
			<view class="cu-form-group margin-top">
				<textarea maxlength="-1" :disabled="modalName!=null" @input="textareaAInput" placeholder="再此处输入文字描述" focus></textarea>
			</view>
			<view class="cu-bar bg-white margin-top">
				<view class="action">
					图片上传
				</view>
				<view class="action">
					{{imgList.length}}/4
				</view>
			</view>
			<view class="cu-form-group">
				<view class="grid col-4 grid-square flex-sub">
					<view class="bg-img" v-for="(item,index) in imgList" :key="index" @tap="ViewImage" :data-url="imgList[index]">
						<image :src="imgList[index]" mode="aspectFill"></image>
						<view class="cu-tag bg-red" @tap.stop="DelImg" :data-index="index">
							<text class='cuIcon-close'></text>
						</view>
					</view>
					<view class="solids" @tap="ChooseImage" v-if="imgList.length<4">
						<text class='cuIcon-cameraadd'></text>
					</view>
				</view>
			</view>
			<view class="padding">
				<button class="cu-btn block bg-blue margin-tb-sm lg" type="button" @click="sendCommen">输入评论</button>
			</view>
		</form>
	</view>
</template>

<script>
	
	export default {
		data() {
			return {
				index: -1,
				imgList: [],
				modalName: null,
				textareaAValue: '',
				task: {},
				commentId: "",
				isCommented: 0, //评论是否已经发表
			};
		},
		onLoad(options) {
			this.task = JSON.parse(  decodeURIComponent(options.task)  )
		},
		onShow() {
			this.checkLogin()
		},
		onBackPress(event) {
			var _this = this
			if (this.isCommented == 0) {
				uni.showModal({
					title: '提示',
					content: '评论尚未发布，确定退出吗？',
					success: function(res) {
						if (res.confirm) {
							console.log(_this.task);
							uni.redirectTo({
								// url: `./RWsquareDetail?task=${ encodeURIComponent(JSON.stringify(_this.task))  }`
								url: `./RWDetailById?taskId=${_this.task.taskId}`
							});
						} 
					}
				});
			} else {
				uni.redirectTo({
					// url: `./RWsquareDetail?task=${ encodeURIComponent(JSON.stringify(_this.task))}`,
					url: `./RWDetailById?taskId=${_this.task.taskId}`,
				});
			}

			return true
		},
		methods: {
			ChooseImage() {
				uni.chooseImage({
					count: 4 - this.imgList,
					sizeType: ['original', 'compressed'],
					sourceType: ['album', "camera"],
					success: (res) => {
						if (this.imgList.length != 0) {
							this.imgList = this.imgList.concat(res.tempFilePaths)
						} else {
							this.imgList = res.tempFilePaths
						}
					}
				});
			},
			checkLogin(){
				var account=uni.getStorageSync('account')
				if(account&&account=="custom"){
					uni.showModal({
					    title: '未登录',
					    content: '发布评论需要登陆，点击确定前往登陆或注册',
					    success: function (res) {
					        if (res.confirm) {
								uni.navigateTo({
									url:"../login/login"
								})
					        } else if (res.cancel) {
								uni.navigateBack({
									delta:1
								})
					        }
					    }
					});
				}
			},
			sendCommen() {
				var _this = this
				uni.showLoading({
					title: '评论中...',
					mask: true
				});
				this.RWajax.post("/comment/publish", {
						account: uni.getStorageSync('account'),
						taskId: _this.task.taskId,
						commentText: _this.textareaAValue
					}).then(res=>{
						if (res.data.success == true) {
							_this.commentId = res.data.result
							
							if(_this.imgList.length>0){
								_this.uploadImg()
							}else{
								uni.hideLoading()
								uni.showToast({
									title: '评论发表成功',
									icon: 'success',
									duration: 500
								})
								_this.isCommented = 1
								setTimeout(function() {
									uni.navigateBack({
										delta: 1
									})
								}, 1000)
							}				
						} else {
							uni.hideLoading()
							console.log(res);
							uni.showToast({
								title: '发送失败',
								icon:'none'
							})
						}
						// _this.getMsg()
					}).catch(res=>{
						console.log(res);
						uni.hideLoading()
						uni.showToast({
							title: '发送失败',
							icon:'none'
						})
					})
			},
			uploadImg() {
				var _this = this
				var imgList = this.imgList
				uni.showLoading({
					title: '评论发表中...',
				})
				var count=0//计数用 上传完成一张图片就+1
				for (let i = 0; i < this.imgList.length; i++) {
					var format //图片格式
					uni.getImageInfo({ //获取图片格式
						src: _this.imgList[i],
						success(res) {
							format = res.type
							uni.uploadFile({
								url: _this.$host + '/file/upload',
								filePath: imgList[i],
								name: 'file',
								formData: {
									fileName: "comment/" + _this.commentId + "/" + i,
									fileType: format
								},
								success: (res) => {
									console.log(res);
									var data = JSON.parse(res.data)
									if (data.success == true) { //上传图片成功
										var url = data.result
										uni.request({ //url录入数据库
											url: _this.$host + "/picture/upload",
											method: "post",
											data: JSON.stringify([{
												linkerId: _this.commentId,
												position: i,
												url: url
											}]) ,
											success(res) {
												count++;
												console.log(res);
												if (count == _this.imgList.length) {												
													uni.hideLoading()
													uni.showToast({
														title: '评论发表成功',
														icon: 'success',
														duration: 500
													})
													_this.isCommented = 1
													setTimeout(function() { 
														uni.navigateBack({
															delta: 1
														})

													}, 1000)
												}
											},
											fail(res) {
												count++;
												console.log(res);
											}
										})
									}

								},
								fail: (err) => {
									console.log(err);
									uni.showModal({
										content: err.errMsg,
										showCancel: false
									});
								}
							});
						}
					})

				}
			},
			ViewImage(e) {
				uni.previewImage({
					urls: this.imgList,
					current: e.currentTarget.dataset.url
				});
			},
			DelImg(e) {
				uni.showModal({
					title: '召唤师',
					content: '确定要删除这段回忆吗？',
					cancelText: '再看看',
					confirmText: '再见',
					success: res => {
						if (res.confirm) {
							this.imgList.splice(e.currentTarget.dataset.index, 1)
						}
					}
				})
			},
			textareaAInput(e) {
				this.textareaAValue = e.detail.value
			},
		}
	}
</script>

<style>
	.cu-form-group .title {
		min-width: calc(4em + 15px);
	}
</style>
