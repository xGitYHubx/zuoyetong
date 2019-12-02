//全局函数
function avatarDefault(url) {
	if (url) {
		return url
	} else {
		return "/static/user/avartar.png"
	}
}

let RWcommon={
	avatarDefault:avatarDefault
}

export default RWcommon