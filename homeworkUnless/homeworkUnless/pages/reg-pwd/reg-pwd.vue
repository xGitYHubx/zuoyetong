<template>
	<view class="">
		<form @submit="formSubmit" @reset="formReset" style="width: 100%;">
			<!-- 		<view class="pwd">
				<input :value="phone" name="account" type="text" placeholder="手机号" @input="phoneChange" />
			</view> -->
			<view class="cu-form-group margin-top">
				<view class="title">手机号码</view>
				<input @input="phoneChange" name="account"></input>
				<view class="cu-capsule radius">
					<view class='cu-tag bg-blue '>
						+86
					</view>
					<view class="cu-tag line-blue">
						中国大陆
					</view>
				</view>
			</view>


			<view class="cu-form-group margin-top">
				<view class="title">登录密码</view>
				<input placeholder="登录密码" type="password" name="password" :value="password" @input="passwordChange"></input>
			</view>


			<view class="cu-form-group margin-top">
				<view class="title">确认密码</view>
				<input placeholder="确认密码" type="password" name="password_again"></input>
			</view>


			<view class="cu-form-group margin-top">
				<view class="title">角色</view>
				<picker @change="PickerChange" :value="index" :range="picker">
					<view class="picker">
						{{picker[index]}}
					</view>
				</picker>
			</view>


			<view class="cu-bar bg-white margin-top" @tap="showModal" data-target="ChooseModal">
				<view class="action">
					擅长科目
				</view>
				<view class="action">
					<button class="cu-btn bg-green shadow" @tap="showModal" data-target="ChooseModal">Choose</button>
				</view>
			</view>
			<view class="cu-modal bottom-modal" :class="modalName=='ChooseModal'?'show':''" @tap="hideModal">
				<view class="cu-dialog" @tap.stop="">
					<view class="cu-bar bg-white">
						<view class="action text-blue" @tap="hideModal">取消</view>
						<view class="action text-green" @tap="hideModal">确定</view>
					</view>
					<view class="grid col-3 padding-sm">
						<view v-for="(item,index) in checkbox" class="padding-xs" :key="index">
							<button class="cu-btn blue lg block" :class="item.checked?'bg-blue':'line-blue'" @tap="ChooseCheckbox"
							 :data-value="item.value"> {{item.name}}
								<!-- <view class="cu-tag sm round" :class="item.checked?'bg-white text-orange':'bg-orange'" v-if="item.hot">HOT</view> -->
							</button>
						</view>
					</view>
				</view>
			</view>


			<view class="cu-form-group margin-top">
				<view class="title">验证码</view>
				<input placeholder="验证码" name="input" @input="codeChange"></input>
				<button class='cu-btn bg-green shadow' @click="getPhoneCode()" :disabled="codeDis">{{ codeText }}</button>
			</view>
			<text class="tip" v-if="codeDis">短信验证码已发送,请查收</text>

			<!-- <view class="code">
				<input type="text" value="" placeholder="验证码" />
				<button class="submit" type="primary" @click="getPhoneCode()" :disabled="codeDis"></button>
			</view> -->

			<!-- <view class="pwd">
				<input name="name" type="text" placeholder="账号" />
			</view> -->
			<!-- <view class="pwd">
				<input password type="password" name="password" placeholder="登录密码" />
			</view> -->
			<view style="padding: 20upx;">
				<label class="checkbox">
					<checkbox :checked="isAgreeItem" @tap="handleAgree" />
					<text class="protocol_tip">我已阅读并同意</text>
				</label>
				<text class="protocol_tip link">《注册服务协议》</text>
			</view>
			<view class="btn-area submit-button">
				<button type="primary" formType="submit">提交</button>
			</view>
		</form>
	</view>
</template>

<script>
	const graceChecker = require("../../common/graceChecker.js");

	export default {
		data() {
			return {
				isAgreeItem: false, //
				index_subject: 0, //学科的索引值
				code: '', //验证码
				codeText: '获取验证码', //验证码提示（发出一分钟内无法再次发送）
				index: 0, //角色选择
				picker: ['学生', '老师'], //角色选择
				codeDis: false,
				password: "",
				modalName: null,
				phone: "",
				checkbox: [{
					value: 0,
					name: '语文',
					checked: false,
					hot: false,
				}, {
					value: 1,
					name: '数学',
					checked: true,
					hot: false,
				}, {
					value: 2,
					name: '英语',
					checked: true,
					hot: true,
				}, {
					value: 3,
					name: '物理',
					checked: false,
					hot: true,
				}, {
					value: 4,
					name: '化学',
					checked: false,
					hot: false,
				}, {
					value: 5,
					name: '生物',
					checked: false,
					hot: false,
				}, {
					value: 6,
					name: '政治',
					checked: false,
					hot: false,
				}, {
					value: 7,
					name: '历史',
					checked: false,
					hot: false,
				}, {
					value: 8,
					name: '地理',
					checked: false,
					hot: false,
				}]
			};
		},
		methods: {
			handleAgree() {
				this.isAgreeItem = !this.isAgreeItem
			},
			phoneChange(e) {
				this.phone = e.detail.value;
			},
			ChooseCheckbox(e) {
				let items = this.checkbox;
				let values = e.currentTarget.dataset.value;
				for (let i = 0, lenI = items.length; i < lenI; ++i) {
					if (items[i].value == values) {
						items[i].checked = !items[i].checked;
						break
					}
				}
			},
			hideModal(e) {
				this.modalName = null
			},
			showModal(e) {
				this.modalName = e.currentTarget.dataset.target
			},
			codeChange(e) {
				this.code = e.detail.value;
			},
			PickerChange(e) {
				this.index = e.detail.value
			},
			passwordChange(e) {
				this.password = e.detail.value;
			},
			PickerChangeSubject(e) {
				this.index_subject = e.detail.value
			},
			formSubmit: function(e) {
				var _that=this
				if (!this.isAgreeItem) {
					uni.showToast({
						title: "请同意协议后再进行相关操作",
						icon: "none"
					});
					return false;
				}
				//将下列代码加入到对应的检查位置
				//定义表单规则
				var rule = [
					// {name:"name", checkType : "string", checkRule:"1,5",  errorMsg:"姓名由1-5位字符组成"},
					{
						name: "account",
						checkType: "phoneno",
						checkRule: "",
						errorMsg: "请输入正确的手机号"
					},
					{
						name: "password",
						checkType: "string",
						checkRule: "8,16",
						errorMsg: "密码由8-16位，数字、字母或数字字母组合"
					},
					{
						name: "password_again",
						checkType: "same",
						checkRule: this.password,
						errorMsg: "两次输入的密码不同"
					}
				];
				//进行表单检查
				var formData = e.detail.value;
				var checkRes = graceChecker.check(formData, rule);
				if (checkRes) {
					uni.showToast({
						title: "test",
						icon: "loading"
					});
					var goodAtArr = []
					for (let i = 0; i < this.checkbox.length; i++) {
						if (this.checkbox[i].checked == true) {
							goodAtArr.push(this.checkbox[i].value)
						}
					}
					var dadada = {
						account: this.phone,
						password: this.password,
						role: this.index,
						code: this.code,
						goodAt: goodAtArr.join("-")
					}
					this.RWajax.post("/user/code/check",dadada).then(res=>{
						console.log(res);
							uni.showToast({
								title: "注册成功",
								icon: "success"
							})
							uni.navigateTo({
								url:"../login/login"
							})
					}).catch(res=>{
						uni.showToast({
								title: "注册失败,请重试",
								icon: "none"
							})
					})

					// console.log(formData)
				} else {
					uni.showToast({
						title: graceChecker.error,
						icon: "none"
					});
				}
			},
			getPhoneCode: function() {
				if (this.codeDis) return;
				if (this.phone.length != 11) {
					uni.showToast({
						title: "请输入正确的电话号码!",
						icon: "none"
					});
					return;
				}
				var n = 60;
				var _that = this;
				this.codeDis = true;
				this.codeText = "请" + n + "秒后重试";
				var timer = setInterval(function() {
					// console.log(n)
					// console.log(_that.codeText)
					if (n === 0) {
						clearInterval(timer);
						_that.codeDis = false;
						_that.codeText = "获取验证码"
						return;
					}
					_that.codeDis = true;
					_that.codeText = "请" + n + "秒后重试";
					n--;
				}, 1000);
				this.RWajax.post("/user/code/get", {
						account: this.phone
					}).then(res=>{
						this.text = 'request success';
					}).catch(res=>{
						uni.showToast({
							title: res,
							icon: "none"
						})
					}).finally(res=>{
						console.log(res);
					})
			},
			formReset: function(e) {
				console.log("清空数据")
				this.chosen = ''
			},
		}
	}
</script>

<style>
	page {
		background-color: #f5f6f8;
	}
</style>
<style lang="scss" scoped>
	$text-color: #B6B6B6;
	$form-border-color: rgba(214, 214, 214, 1);

	.page_reg {
		height: 100%;
		// padding: 20px;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;

		.submit-button {
			width: 100%;
			margin-top: 32upx;
		}
	}

	.tip {
		margin-top: 30px;
		font-size: 13px;
		color: $text-color;
	}

	.code {
		width: 100%;
		min-height: 65px;
		margin-top: 30px;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		border-bottom: 1px solid $form-border-color;

		.submit {
			color: white;
			background-color: #4191ea;
			-webkit-tap-highlight-color: #4191ea;

			&:active {
				color: #B6B6B6;
				background-color: rgba(63, 145, 234, 0.8);
			}
		}
	}

	.pwd {
		width: 100%;
		margin-top: 10px;
		min-height: 65px;
		display: flex;
		flex-direction: row;
		align-items: center;
		border-bottom: 1px solid $form-border-color;
	}

	.protocol_tip {
		font-size: 16px;
		color: $text-color;
	}

	.link {
		color: #3a8de8;
	}
</style>
