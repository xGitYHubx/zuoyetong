<template>
	<view>
		<view class="cu-card dynamic">
			<view class="cu-item shadow" v-for="(item,index) in list" :key="index" @click="toDetail(item)">
				<view class="cu-list menu-avatar">
					<view class="cu-item">
						<view class="cu-avatar round lg" :style="'background-image:url('+item.avatarUrl+');'"></view>
						<view class="content flex-sub">
							<view>{{item.name||item.account}}</view>
							<view class="text-gray text-sm flex justify-between">
								{{item.createTime}}
							</view>
						</view>
					</view>
				</view>
				<view class="text-content">
					{{item.descText}}
				</view>
				<view class="grid flex-sub padding-lr" :class="isCard?'col-3 grid-square':'col-1'" v-if="item.firstUrl">
					<image :src="item.firstUrl||'#'" mode="widthFix"></image>
				</view>
				<view class="text-orange cuIcon-coin text-right padding">{{item.reward}}
					<!-- <text class='cuIcon-coin text-orange'></text> -->
				</view>
			</view>
			<view class="rw-page-loading" v-if='isLoading'>
				{{loadingMsg}}
			</view>
		</view>
	</view>
</template>

<script>
	import initData from "../../../common/initData.js"
	export default {
		data() {
			return {
				isCard: false,
				list: [],
				page: 0,
				isLoading: false,
				loadingMsg: "加载中..."
			};
		},

		onLoad() {
			// this.getTask()
			initData.checkLogin()
		},
		onShow() {
			this.getTask()
			initData.checkLogin()
		},
		onReachBottom() {
			this.getTask()
		},
		onPullDownRefresh() {
			this.list = []
			this.page = 0
			this.getTask()
		},
		methods: {
			IsCard(e) {
				this.isCard = e.detail.value
			},
			toDetail(task) {
				var temp = JSON.parse(JSON.stringify(task))
				temp.firstUrl = "" //firstUrl中的字符会使task对象被转义为字符串
				console.log(temp.avatarUrl);
				uni.navigateTo({
					// url: `../../square-detail/RWsquareDetail?task=${encodeURIComponent(JSON.stringify(temp))}`
					url: `../../square-detail/RWDetailById?taskId=${temp.taskId}`
				});
			},
			getTask() {
				var _this = this
				this.isLoading = true
				// console.log(this.page);
				this.RWajax.get('/mine/query', {
					account: uni.getStorageSync('account'),
					type: 0
				}).then(res => {
					if (res.data.success == true) {
						// _this.page=_this.page+1;
						_this.list = _this.list.concat(res.data.result);
						if (res.data.result.length == 0) {
							_this.loadingMsg = "无更多数据"
							uni.showToast({
								title: '无数据',
								icon: 'none'
							})
						}
					} else {
						uni.showToast({
							title: '无数据',
							icon: 'none'
						})
					}
				}).catch(res=>{
					console.log(res)
				})

			}
		}
	}
</script>

<style>

</style>
