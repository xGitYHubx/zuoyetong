<script>
import initData from "./common/initData.js"
export default {
	onLaunch: function() {
		console.log('App Launch');
		initData.getBalance()//初始化余额
		initData.getUserInfo()
	},
	onShow: function() {
		console.log('App Show');
	},
	onHide: function() {
		console.log('App Hide');
	}
};
</script>

<style>
/*每个页面公共css */ 
@import "colorui/main.css";
@import "colorui/icon.css";
@import './common/uni.css';
</style>
