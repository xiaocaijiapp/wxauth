import axios from "axios";
import { Toast } from 'vant'
const $Toast = Toast
const Request = axios.create({
  timeout: 10000
});
Request.interceptors.request.use(config => {
  $Toast.loading({
    duration: 0,
    forbidClick: true,
  })
  return config
});
Request.interceptors.response.use(response => {
  $Toast.clear()
  const {status, data: { code }} = response
  if(status === 200 && code === 200){
    return response
  } else {
    if(status!== 200) {
      return Promise.reject(response)
      $Toast('服务器异常,请稍后重试!')
    } else {
      $Toast(response.data.message)
      return Promise.reject(response)
      // switch (code) {
      //   case 400:
      //     return Promise.reject(response)
      //     break
      //   case 401:
      //     return Promise.reject(response)
      //     break
      //   case 404:
      //     return Promise.reject(response)
      //     break
      // }
    }
  }
});

export default Request;
