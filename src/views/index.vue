<template>
  <div class="index-container">
    <div class="dialog-container">
      <div class="form-title">注册信息</div>
      <div class="form-content">
        <div class="user-into">
          <div class="into-form">
            <img src="../assets/phone.png" class="left-ico" />
            <input
              type="text"
              v-model="userPhone"
              class="user-input"
              placeholder="请输入手机号"
              @blur="checkPhone"
            />
          </div>
          <div v-show="phoneTip" class="tip">{{ phoneRegText }}</div>
        </div>
        <div class="code-into">
          <div class="into-form">
            <img src="../assets/code.png" class="left-ico" />
            <input
              type="text"
              v-model="phoneCode"
              maxlength="6"
              class="user-input"
              placeholder="请输入验证码"
              @blur="checkCode"
            />
            <div v-if="codeBtn" class="code-btn" @click="getCode">获取验证码</div>
            <div v-else class="code-btn">{{count + 'S'}}</div>
          </div>
          <div v-show="codeTip" class="tip">{{ codeRegText }}</div>
        </div>
      </div>
      <div class="user-bd-btn" @click="bindingSure">
        绑定
      </div>
      <div class="wx-tip">
        <p class="title">微信提示</p>
        <p class="text">1.请使用全民外贸注册手机号登录;</p>
        <p class="text">
          2.若您未注册全民外贸APP,请您去应用商店下载 安装并完成注册后进行绑定；
        </p>
      </div>
    </div>
    <van-dialog v-model="dialogShow" title="提示" confirm-button-color="#1491ff" show-cancel-button @confirm="confirmReplace" @cancel="cancelReplace">
        <p class="dialog-content">
          您的手机号已经通过
          <span style="color:#1491ff">{{nickName}}</span>
          绑定过该平台
        </p>
        <p class="dialog-content">是否替换手机号</p>
    </van-dialog>
  </div>
</template>

<script>
import { authUrl, wxAuthUserInfo, wxBindPhone, verificationCode } from "../plugins/request/index"
import { getParameter } from '../plugins/tool'
export default {
  name: "index",
  data() {
    return {
      dialogShow: false,
      userPhone: "",
      phoneCode: "",
      phoneRegText: "手机号不能为空",
      codeRegText: "验证码不能为空",
      phoneTip: false,
      codeTip: false,
      wxOauthToken: '',
      mobile: '',
      name: '',
      codeBtn: true,
      timer: null,
      count: 120,
      nickName: ''
    };
  },
  async created() {
    let code = getParameter('code')
    let state = getParameter('state')
    if(code) {
      await wxAuthUserInfo({code, state}).then(res=> {
        if(res.data.code === 200) {
          const { wxOauthToken, mobile, name } = res.data.data
          if(!wxOauthToken) {
            this.$router.push('/success')
            this.mobile = mobile
            this.name = name
          } else {
            this.wxOauthToken = wxOauthToken
          }
        }
      })
    } else {
      // 获取微信授权url
      await authUrl().then(res => {
        if (res.data.code === 200) {
          this.a_href(res.data.data)
        }
      })
    }
  },
  methods: {
    checkPhone() {
      const reg = /^134[0-8]\d{7}$|^13[^4]\d{8}$|^14[5-9]\d{8}$|^15[^4]\d{8}$|^16[6]\d{8}$|^17[0-8]\d{8}$|^18[\d]{9}$|^19[8,9]\d{8}$/;
      if (this.userPhone.length == 0) {
        this.phoneRegText = "手机号不能为空";
        this.phoneTip = true;
        return false;
      } else {
        if (reg.test(this.userPhone)) {
          this.phoneTip = false;
          return true;
        } else {
          this.phoneTip = true;
          this.phoneRegText = "手机号不正确";
          return false;
        }
      }
    },
    checkCode() {
      if (this.phoneCode.length == 0) {
        this.codeRegText = "验证码不能为空";
        this.codeTip = true;
        return false;
      } else {
        const reg = /^\d{6}$/;
        if (reg.test(this.phoneCode)) {
          this.codeTip = false;
          return true;
        } else {
          this.codeTip = true;
          this.codeRegText = "请输入6位纯数字验证码";
          return false;
        }
      }
    },
    getCode() {
      const phone = this.checkPhone();
      if(!phone) return
      verificationCode({
        mobile: this.userPhone,
        type: 8
      }).then(res=>{
        if(res.data.code === 200) {
          this.codeBtn = false
          this.$toast.success('发送成功')
        }
        this.timer = setInterval(() => {
          if (this.count <= 1) {
            clearInterval(this.timer)
            this.codeBtn = true
            this.count = 120
          } else {
            this.count--
          }
        }, 1000)
      })
    },
    bindingSure() {
      const code = this.checkCode();
      const phone = this.checkPhone();
      if (code && phone) {
        this.bind()
      }
    },
    // 绑定操作
    bind (flag = 0) {
      // 执行绑定操作
      wxBindPhone({
        confirmFlag: flag,
        mobile: this.userPhone,
        mobileCode: this.phoneCode,
        wxOauthToken: this.wxOauthToken
      }).then(res=>{
        if(res.data.code === 200) {
          const {confirmFlag, nickName} = res.data.data
          if(confirmFlag == 0){
            this.dialogShow = false
            this.$router.push('/success')
          } else {
            this.nickName = nickName
            this.dialogShow = true
          }
        } else {
          this.$router.push('/failure')
        }
      })
    },
    confirmReplace () {
      this.bind(1)
    },
    cancelReplace () {
      clearInterval(this.timer)
      this.codeBtn = true
      this.count = 120
      this.userPhone = ''
      this.phoneCode = ''
      this.dialogShow = false
    },
    // 模拟a标签跳转
    a_href (href) {
      const a = document.createElement('a')
      a.setAttribute('href', href)
      a.setAttribute('target', '_self')
      a.setAttribute('id', 'js_a')
      // 防止反复添加
      if (document.getElementById('js_a')) {
        document.body.removeChild(document.getElementById('js_a'))
      }
      document.body.appendChild(a)
      a.click()
    }
  }
};
</script>

<style lang="scss" scoped>
.index-container {
  width: 750px;
  height: 100vh;
  background-image: url("../assets/bg.png");
  background-clip: border-box;
  background-size: 100% 100%;
  position: relative;
  & .dialog-content {
    text-align: center!important;
    font-size: 28px!important;
  }
  & .dialog-container {
    width: 620px;
    height: 933px;
    position: absolute;
    top: 300px;
    left: 50%;
    transform: translateX(-50%);
    background-image: url("../assets/dislog-bg.png");
    background-size: 100% 100%;
    box-sizing: border-box;
    padding: 192px 46px 35px;
    display: flex;
    flex-flow: column nowrap;
    justify-content: flex-start;
    align-items: center;
    .text {
      font-size: 16px;
      line-height: 24px;
      text-align: left;
    }
    .form-title {
      font-size: 32px;
      font-family: PingFangSC, PingFangSC-Medium;
      font-weight: 500;
      text-align: center;
      color: #333333;
      line-height: 50px;
    }
    .form-content {
      width: 100%;
      height: auto;
      margin-top: 40px;
      .code-into .user-input {
        width: 200px;
      }
      .user-into,
      .code-into {
        width: 100%;
        height: 140px;
        display: flex;
        flex-flow: column nowrap;
        justify-content: flex-start;
        align-items: center;
        position: relative;
        .into-form {
          width: 100%;
          height: 80px;
          border-radius: 8px;
          box-shadow: 0px 0px 10px 6px rgba(0, 0, 0, 0.04);
          display: flex;
          flex-flow: row nowrap;
          justify-content: space-between;
          align-items: center;
          .left-ico {
            width: 33px;
            height: 33px;
            margin: 0px 25px;
          }
          .user-input::-webkit-input-placeholder {
            /* WebKit browsers */
            font-size: 26px;
            color: #c9c9c9;
          }
          .user-input:-moz-placeholder {
            /* Mozilla Firefox 4 to 18 */
            font-size: 26px;
            color: #c9c9c9;
          }
          .user-input::-moz-placeholder {
            /* Mozilla Firefox 19+ */
            font-size: 26px;
            color: #c9c9c9;
          }
          .user-input:-ms-input-placeholder {
            /* Internet Explorer 10+ */
            font-size: 26px;
            color: #c9c9c9;
          }
          .user-input {
            flex: 1;
            height: 60px;
            outline: 0;
            border: none;
            font-size: 26px;
            color: #333333;
            font-weight: 400;
            text-align: left;
            line-height: 37px;
            padding: 0;
          }
          .code-btn {
            width: 200px;
            height: 80px;
            line-height: 80px;
            font-size: 26px;
            text-align: center;
            color: #1491ff;
          }
        }
        .tip {
          width: 100%;
          height: 46px;
          font-size: 26px;
          padding-left: 83px;
          box-sizing: border-box;
          color: red;
          line-height: 46px;
        }
      }
    }
    .user-bd-btn {
      width: 385px;
      height: 80px;
      background: linear-gradient(97deg, #5fd3fd 8%, #0d7eff 98%);
      font-size: 30px;
      font-weight: 400;
      text-align: center;
      color: #ffffff;
      line-height: 80px;
    }
    .wx-tip {
      width: 100%;
      .title {
        width: 100%;
        font-size: 26px;
        font-weight: 400;
        text-align: left;
        color: #666666;
      }
      .text {
        font-size: 24px;
        font-weight: 400;
        text-align: left;
        color: #999999;
        line-height: 40px;
        margin: 6px 0;
      }
    }
  }
}
</style>
