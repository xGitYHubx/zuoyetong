<template>
	<view>
		<form>
			<view class="cu-form-group margin-top">
				<view class="title">邮箱</view>
				<input placeholder="输入邮箱" name="input"></input>
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
			<!-- !!!!! placeholder 在ios表现有偏移 建议使用 第一种样式 -->
			<view class="cu-form-group margin-top">
				<textarea maxlength="-1" :disabled="modalName!=null" @input="textareaAInput" placeholder="多行文本输入框"></textarea>
			</view>
			
			<view class="padding">
				<button class="cu-btn block bg-blue margin-tb-sm lg" type="button">提交</button>
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
				textareaBValue: ''
			};
		},
		methods: {
			ChooseImage() {
				uni.chooseImage({
					count: 4-this.imgList, //默认9
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album'], //从相册选择
					success: (res) => {
						if (this.imgList.length != 0) {
							this.imgList = this.imgList.concat(res.tempFilePaths)
						} else {
							this.imgList = res.tempFilePaths
						}
					}
				});
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
