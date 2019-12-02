<template>
	<view>
		<form>
			<view class="cu-form-group margin-top" @click="changeAvatar">
				<view class="title">头像</view>
				<view class="cu-avatar radius bg-gray" :style="'backgroung-image:url('+avatar+')'">
					<image style="width: 100%;height: 100%;" :src="avatar" mode="aspectFill"></image>
				</view>
			</view>

			<view class="cu-form-group">
				<view class="title">姓名</view>
				<input placeholder="姓名" name="input" :value="name" @input="changeName"></input>
			</view>
			<view class="cu-form-group">
				<view class="title">手机号码</view>
				<input name="input" disabled="" :value="account" style="color:#ccc"></input>
				<view class="cu-capsule radius">
					<view class='cu-tag bg-blue '>
						+86
					</view>
					<view class="cu-tag line-blue">
						中国大陆
					</view>
				</view>
			</view>
			<view class="cu-form-group">
				<view class="title">学校</view>
				<input name="school" :value="school" @input="changeSchool"></input>
			</view>
			<!-- #ifndef MP-ALIPAY -->
			<view class="cu-form-group margin-top">
				<view class="title">年级</view>
				<picker @change="PickerChange" :value="index" :range="picker">
					<view class="picker">
						{{picker[index]}}
					</view>
				</picker>
			</view>
			<!-- #endif -->
			<view class="cu-form-group margin-top">
				<textarea maxlength="-1" @input="textareaAInput" :value="textareaAValue" placeholder="家庭住址"></textarea>
			</view>

			<view class="padding">
				<button class="cu-btn block bg-blue margin-tb-sm lg" type="button" @click="submit">保存</button>
			</view>
		</form>
	</view>
</template>

<script>
	import initData from '../../../common/initData.js'
	export default {
		data() {
			return {
				index: 0, //年级的索引值
				account: '',
				picker: ['小学1年级', '小学2年级', '小学3年级', '小学4年级', '小学5年级', '小学6年级', "初中1年级", "初中2年级", "初中3年级", "高中1年级", "高中2年级", "高中3年级"],
				textareaAValue: '', //家庭住址
				name: "", //姓名
				school: '', //学校
				avatar: ""
			};
		},
		onLoad() {
			this.getUserInfo()
		},
		methods: {
			PickerChange(e) {
				this.index = e.detail.value
			},
			changeAvatar() {
				var _this = this
				uni.chooseImage({
					count: 1, //默认9
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album', "camera"], //从相册选择
					success: (res) => {
						_this.avatar = res.tempFilePaths[0]
						uni.getImageInfo({ //获取图片格式
							src: _this.avatar,
							success(res) {
								var format = res.type
								uni.uploadFile({
									url: _this.$host + '/file/upload',
									filePath: _this.avatar,
									name: 'file',
									formData: {
										fileName: "avatar/" + _this.account,
										fileType: format
									},
									success: (res) => {
										var data = JSON.parse(res.data)
										if (data.success == true) { //上传图片成功
											var url = data.result
											_this.avatar = url
										}
									},
									fail: (err) => {
										// console.log('uploadImage fail', err);
										// console.log(imgList[i]);

										uni.showModal({
											content: err.errMsg,
											showCancel: false
										});
									}
								});
							}
						})



					}
				});
			},
			getUserInfo() {
				var token = uni.getStorageSync('token')
				var account = uni.getStorageSync('account')
				var _this = this
				// if(account)
				this.RWajax.get("/user/query/info", {
					'account': account
				}).then(res => {
					console.log(res);
					var data = res.data.result
					if (res.data.success==true) {
						_this.name = data.name
						_this.account = data.account
						_this.index = data.age
						_this.school = data.school
						_this.avatar = data.avatar
						_this.textareaAValue = data.address
						_this.name = data.name
					}

				}).catch(res=>{
					console.log(res)
				})

			},
			submit() {
				console.log("submit");
				var params = {
					'account': uni.getStorageSync('account'),
					'name': this.name,
					'school': this.school,
					'address': this.textareaAValue,
					'age': this.index,
					// 'gender':0,
					'avatar': this.avatar
				}
				this.RWajax.post("/user/update/info",params).then(res=>{
					if (res.data.success == true) {
							uni.showToast({
								title: "保存成功"
							})
							initData.getUserInfo()
							setTimeout(function() {
								uni.navigateBack({
									delta: 1,
								})
							}, 1000)
						}
				})

			},
			avatarDefault(url) {
				if (url) {
					return url
				} else {
					return "../../../static/user/avatar.png"
				}
			},
			changeSchool(e) {
				this.school = e.detail.value
			},
			changeName(e) {
				this.name = e.detail.value
			}, //
			MultiChange(e) {
				this.multiIndex = e.detail.value
			}, //
			MultiColumnChange(e) {
				data.multiIndex[e.detail.column] = e.detail.value;
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
