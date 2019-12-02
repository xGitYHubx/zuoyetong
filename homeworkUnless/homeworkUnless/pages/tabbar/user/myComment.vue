<template>
	<view>		
		<view class="cu-card dynamic">
			<view class="cu-item shadow" v-for="(item,index) in list" :key="index" @click="toDetail(item.taskId)">
				<view class="cu-list menu-avatar comment solids-top">
					<view class="cu-item">
						<view class="cu-avatar round" :style="'background-image:url('+item.avatarUrl+')'"></view>
						<view class="content">
							<view class="text-grey">{{item.name}}</view>
							<view class="text-gray text-content text-df">
								{{item.commentText}}
							</view>
							<view class="margin-top-sm flex justify-between">
								<view class="text-gray text-df">{{item.createTime}}</view>
								<view>
									
									<!-- <text class="cuIcon-messagefill text-green margin-left-sm">已采用</text> -->
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import initData from '../../../common/initData.js'
	export default {
		data() {
			return {
				isCard: true,
				list:[]
			};
		},
		onLoad() {
			initData.checkLogin()
			this.getComment()
		},
		methods: {
			IsCard(e) {
				this.isCard = e.detail.value
			},
			toDetail(taskId){
				uni.navigateTo({
					url: `../../square-detail/RWDetailById?taskId=${taskId}`});
			},
			
			getComment(){
				var _this=this
				this.RWajax.get('/mine/query',{account:uni.getStorageSync('account'),type:1}).then(res=>{
										console.log(res);
						if(res.data.success==true){
							_this.list=res.data.result
							if(res.data.result.length==0){
								uni.showToast({
									title:'无数据'
								})
							}
						}else{
							uni.showToast({
								title:'无数据'
							})
						}
				})

			}
		}
	}
</script>

<style>

</style>