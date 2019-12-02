<template>
	<view class='RW-order'>
		<view :scroll-y="modalName==null" class="page" :class="modalName!=null?'show':''">
			<view v-for="item in list" :key="item.orderId">
				<view class="cu-bar bg-white solid-bottom margin-top">
					<view class="action">
						<text :class="'cuIcon-title text-'+mapOrderColor(item.status)[0]"></text> {{mapOrderColor(item.status)[1]}}
					</view>
				</view>
				<view class="cu-list menu-avatar RW-order-list">
					<view class="cu-item cur">
						<!-- <view class="cu-avatar radius lg" style="background-image:url(https://ossweb-img.qq.com/images/lol/web201310/skin/big81020.jpg);">
						<view class="cu-tag badge"></view>
					</view> -->
						<view class="content RW-content">
							<view>
								<view class="text-cut">{{item.location}}</view>
								<view :class="'cu-tag round bg-'+mapOrderColor2(item.status)+' sm'">{{formatOrderState(item.status)}}</view>
							</view>
							<view class="text-gray text-sm flex">
								<view class="text-cut"> {{item.receiverName}} 辅导 {{item.initiatorName}}<text class="cuIcon-locationfill text-orange margin-right-xs"></text>
								</view> {{formatSubject(item.subject)}} {{item.duration}}小时
							</view>
						</view>
						<view class="action">
							<view class="text-grey text-xs">2019-10-10 22:20</view>
							<view class="cuIcon-coin text-orange">{{item.cost}}</view>
						</view>

					</view>
					<view class="RW-button-group">
						<button class='RW-button-item' v-if='item.status==0&&role==1' @click="changeOrderState(4,item.orderId)">取消</button>
						<button class='RW-button-item' v-if='item.status==0&&role==1'  @click="changeOrderState(1,item.orderId)">接受</button>
						<button class='RW-button-item' v-if='item.status==1&&role==0' @click="changeOrderState(2,item.orderId,item.cost)">去支付</button>
						<button class='RW-button-item' v-if='item.status==2&&role==0' @click="changeOrderState(3,item.orderId)">完成</button>
					</view>
				</view>
			</view>

		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				modalName: null,
				skin: false,
				list: [],
				orderState: ['老师未同意', '同意未支付', '支付未完成', '完成', '老师已拒绝'],
				subject: ['语文', '数学', '英语', '物理', '化学', '生物', '政治', '历史', '地理'],
				role:uni.getStorageSync('userInfo').role
			};
		},
		onLoad() {
			this.getList()
			console.log(this.role);
		},
		onPullDownRefresh() {
			this.list = []
			this.getList()
		},
		methods: {
			getList() {
				var _this = this
				this.list = []
				this.RWajax.get('/mine/query',{
						account: uni.getStorageSync('account'),
						type:2
					}).then(res=>{
							console.log(res);
						_this.list = res.data.result

					}).catch(res=>{
						console.log(res);
					}).finally(res=>{
						uni.stopPullDownRefresh()
					})
			},
			formatOrderState(index) {
				return this.orderState[index]
			},
			formatSubject(index) {
				return this.subject[index]
			},
			changeOrderState(state, orderId,cost) {
				var _this = this
				var tag=0//标志位
				console.log(state);
				if(state==2){
					var balance=uni.getStorageSync('balance')
					var cost=cost
					console.log(balance);
					console.log(cost);
					if(cost>balance){
						tag=1
						uni.showModal({
						    title: '余额不足！',
						    content: '点击确认前往充值',
						    success: function (res) {
						        if (res.confirm) {
									uni.navigateTo({
										url:'../../recharge/RWrechart/RWrechart'
									})
						        } else if (res.cancel) {
						        }
						    }
						});
					}
				}
				if(tag==0){
					this.RWajax.post("/order/status/update",{
						status: state,
						orderId: orderId
					}).then(res=>{
						console.log(res);
						uni.showToast({
							title: '操作成功'
						})
						_this.getList()
						
					}).catch(res=>{
						console.log(res);
					})
				}
				
			},
			mapOrderColor(status) {
				if (status == 0 || status == 1 || status == 2) {
					return ['orange', '进行中']
				} else if (status == 3) {
					return ['gray', '已关闭']
				} else {
					return ['green', '已完成']
				}
			},
			mapOrderColor2(status) {
				if (status == 0 || status == 1 || status == 2) {
					return 'orange'
				} else if (status == 3) {
					return 'green'
				} else {
					return 'gray'
				}
			},
			
		}
	}
</script>

<style>
	.page {
		height: 100Vh;
		width: 100vw;
	}

	.page.show {
		overflow: hidden;
	}

	.switch-sex::after {
		content: "\e716";
	}

	.switch-sex::before {
		content: "\e7a9";
	}

	.switch-music::after {
		content: "\e66a";
	}

	.switch-music::before {
		content: "\e6db";
	}

	.RW-order .RW-content {
		position: absolute;
		left: 20px !important;
		width: calc(100% - 48px - 30px - 60px - 10px);
		line-height: 1.6em;
	}

	.RW-button-group {
		display: flex;
		padding: 10upx 0;
		background-color: #ffffff;
		align-items: center;
		justify-content: center;
	}

	.RW-button-item {
		padding: 10px;
		font-size: 14px;
		line-height: 20px;
		background-color: rgb(65, 145, 234);
		color: white;
	}

	.RW-order-list {
		margin-top: 2px;
	}
</style>
