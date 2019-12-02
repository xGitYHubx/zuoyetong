<template>
    <view>
        <page-head :title="title"></page-head>
        <view class="uni-padding-wrap">
            <view style="background:#FFF; padding:50upx 0;">
                <view class="uni-hello-text uni-center">支付金额</text></view>
                <view class="uni-h1 uni-center uni-common-mt">
                    <text class="rmbLogo">￥</text>
                    <input class="price" type="digit" :value="price" maxlength="4" @input="priceChange" />学币
                </view>
            </view>
            <view class="uni-btn-v uni-common-mt">
                <!-- #ifdef MP-WEIXIN || MP-QQ -->
                <button type="primary" @click="weixinPay" :loading="loading">微信支付</button>
                <!-- #endif -->
                <!-- #ifdef APP-PLUS -->
                <template v-if="providerList.length > 0">
                    <button v-for="(item,index) in providerList" :key="index" @click="requestPaymentTest(item,index)"
                        :loading="item.loading">{{item.name}}支付</button>
                </template>
                <!-- #endif -->
				
				<button  @click="requestPaymentTest()"
				    :loading="loading">支付
				</button>
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
                title: 'request-payment',
                loading: false,
                price: 1,
                providerList: []
            }
        },
        onLoad: function() {
            // #ifdef APP-PLUS
            uni.getProvider({
                service: "payment",
                success: (e) => {
                    console.log("payment success:" + JSON.stringify(e));
                    let providerList = [];
                    e.provider.map((value) => {
                        switch (value) {
                            case 'alipay':
                                providerList.push({
                                    name: '支付宝',
                                    id: value,
                                    loading: false
                                });
                                break;
                            case 'wxpay':
                                providerList.push({
                                    name: '微信',
                                    id: value,
                                    loading: false
                                });
                                break;
                            default:
                                break;
                        }
                    })
                    this.providerList = providerList;
                },
                fail: (e) => {
                    console.log("获取支付通道失败：", e);
                }
            });
            // #endif
        },
        methods: {
            weixinPay() {
                console.log("发起支付");
                this.loading = true;
                uni.login({
                    success: (e) => {
                        console.log("login success", e);
                        uni.request({
                            url: `https://unidemo.dcloud.net.cn/payment/wx/mp?code=${e.code}&amount=${this.price}`,
                            success: (res) => {
                                console.log("pay request success", res);
                                if (res.statusCode !== 200) {
                                    uni.showModal({
                                        content: "支付失败，请重试！",
                                        showCancel: false
                                    });
                                    return;
                                }
                                if (res.data.ret === 0) {
                                    console.log("得到接口prepay_id", res.data.payment);
                                    let paymentData = res.data.payment;
                                    uni.requestPayment({
                                        timeStamp: paymentData.timeStamp,
                                        nonceStr: paymentData.nonceStr,
                                        package: paymentData.package,
                                        signType: 'MD5',
                                        paySign: paymentData.paySign,
                                        success: (res) => {
                                            uni.showToast({
                                                title: "感谢您的赞助!"
                                            })
                                        },
                                        fail: (res) => {
                                            uni.showModal({
                                                content: "支付失败,原因为: " + res
                                                    .errMsg,
                                                showCancel: false
                                            })
                                        },
                                        complete: () => {
                                            this.loading = false;
                                        }
                                    })
                                } else {
                                    uni.showModal({
                                        content: res.data.desc,
                                        showCancel: false
                                    })
                                }
                            },
                            fail: (e) => {
                                console.log("fail", e);
                                this.loading = false;
                                uni.showModal({
                                    content: "支付失败,原因为: " + e.errMsg,
                                    showCancel: false
                                })
                            }
                        })
                    },
                    fail: (e) => {
                        console.log("fail", e);
                        this.loading = false;
                        uni.showModal({
                            content: "支付失败,原因为: " + e.errMsg,
                            showCancel: false
                        })
                    }
                })
            },
			requestPaymentTest(e){
				uni.request({
					url:this.$host+"/user/recharge",
					header:{
						"Authorization":uni.getStorageSync('token')
					},
					method:"post",
					data:{
						account:uni.getStorageSync('account'),
						coin:this.price
					},
					success(res){
						if(res.data.success==true){
							uni.showToast({
								title:"充值成功",
								icon:'success'
							})
							initData.getBalance()
							setTimeout(()=>{
								uni.navigateBack({
									delta:1
								})
							},1000)
						}
						console.log(res);
					},						
					fail(res) {
						console.log(res);
					}
					
				})
			},
            async requestPayment(e, index) {
                this.providerList[index].loading = true;
                let orderInfo = await this.getOrderInfo(e.id);
				console.log(orderInfo.data)
                console.log("得到订单信息", orderInfo);
                if (orderInfo.statusCode !== 200) {
                    console.log("获得订单信息失败", orderInfo);
                    uni.showModal({
                        content: "获得订单信息失败",
                        showCancel: false
                    })
                    return;
                }
                uni.requestPayment({
                    provider: e.id,
                    orderInfo: orderInfo.data,
                    success: (e) => {
                        console.log("success", e);
                        uni.showToast({
                            title: "感谢您的赞助!"
                        })
                    },
                    fail: (e) => {
                        console.log("fail", e);
                        uni.showModal({
                            content: "支付失败,原因为: " + e.errMsg,
                            showCancel: false
                        })
                    },
                    complete: () => {
                        this.providerList[index].loading = false;
                    }
                })
            },
            getOrderInfo(e) {
                let appid = "";
                // #ifdef APP-PLUS
                appid = plus.runtime.appid;
                // #endif
                let url = 'https://demo.dcloud.net.cn/payment/?payid=' + e + '&appid=' + appid + '&total=' + this.price;
                return new Promise((res) => {
                    uni.request({
                        url: url,
                        success: (result) => {
                            res(result);
                        },
                        fail: (e) => {
                            res(e);
                        }
                    })
                })
            },
            priceChange(e) {
                console.log(e.detail.value)
                this.price = e.detail.value;
            }
        }
    }
</script>

<style>
    .rmbLogo {
        font-size: 40upx;
    }

    button {
        background-color: #007aff;
        color: #ffffff;
    }

    .uni-h1.uni-center {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: flex-end;
    }

    .price {
        border-bottom: 1px solid #eee;
        width: 200upx;
        height: 50upx;
		font-size: 20px;
        padding-bottom: 4upx;
    }

    .ipaPayBtn {
        margin-top: 30upx;
    }
	.uni-common-mt{
		display: flex;
	}
</style>
