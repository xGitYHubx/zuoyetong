(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["pages/tabbar/square/RWsquare"],{"29ec":function(t,a,e){"use strict";(function(t,e){Object.defineProperty(a,"__esModule",{value:!0}),a.default=void 0;var n={data:function(){return{isCard:!1,list:[],page:0,isLoading:!1,loadingMsg:"加载中..."}},onLoad:function(){},onShow:function(){this.getTask()},onReachBottom:function(){this.getTask()},onPullDownRefresh:function(){this.list=[],this.page=0,this.getTask()},methods:{IsCard:function(t){this.isCard=t.detail.value},toDetail:function(a){var e=JSON.parse(JSON.stringify(a));e.firstUrl="",t.navigateTo({url:"../../square-detail/RWDetailById?taskId=".concat(e.taskId)})},getTask:function(){var a=this;this.isLoading=!0,t.request({url:a.$host+"/task/query/info",method:"GET",header:{Authorization:t.getStorageSync("token")},data:{page:a.page},success:function(n){console.log(e(n," at pages\\tabbar\\square\\RWsquare.vue:85")),1==n.data.success?(a.page=a.page+1,a.list=a.list.concat(n.data.result),0==n.data.result.length&&(a.loadingMsg="加载中...")):t.showToast({title:"无数据"})},fail:function(t){},complete:function(e){a.isLoading=!1,t.stopPullDownRefresh()}})}}};a.default=n}).call(this,e("6e42")["default"],e("0de9")["default"])},"2eb7":function(t,a,e){"use strict";e.r(a);var n=e("29ec"),o=e.n(n);for(var i in n)"default"!==i&&function(t){e.d(a,t,function(){return n[t]})}(i);a["default"]=o.a},"87c4":function(t,a,e){"use strict";(function(t){e("af20"),e("921b");n(e("66fd"));var a=n(e("8aa4"));function n(t){return t&&t.__esModule?t:{default:t}}t(a.default)}).call(this,e("6e42")["createPage"])},"8aa4":function(t,a,e){"use strict";e.r(a);var n=e("dfae"),o=e("2eb7");for(var i in o)"default"!==i&&function(t){e.d(a,t,function(){return o[t]})}(i);var s=e("2877"),u=Object(s["a"])(o["default"],n["a"],n["b"],!1,null,null,null);a["default"]=u.exports},dfae:function(t,a,e){"use strict";var n=function(){var t=this,a=t.$createElement;t._self._c},o=[];e.d(a,"a",function(){return n}),e.d(a,"b",function(){return o})}},[["87c4","common/runtime","common/vendor"]]]);