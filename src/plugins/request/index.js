import Request from "../axios";
// 获取微信授权链接
export const authUrl = () => {
	return Request({
		method: 'get',
		url: '/api/delegate/oauth/wx/authorize/url'
	})
}
/**
 * 获取微信授权信息
 * code  微信返回code
 * state 微信返回
 * */
export const wxAuthUserInfo = (data)=>{
	return Request({
		url: '/api/delegate/oauth/wx',
		method: 'post',
		data
	})
}

/**
 * 公众号绑定手机号
 * */
export const wxBindPhone = (params)=>{
	return Request({
		url: '/api/delegate/oauth/wx/official/accounts',
		method: 'post',
		data: {
			...params
		}
	})
}

/**
 *  获取手机号验证码
 * */
export const verificationCode = ({mobile, type})=>{
	return Request({
		url: `/api/delegate/mobile/send/white/${mobile}/${type}`,
		method: 'post'
	})
}
