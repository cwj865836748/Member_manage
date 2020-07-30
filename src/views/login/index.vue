<template>
  <div class="login-container">
    <el-form
      @keyup.enter.native="handleLogin"
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
      autocomplete="on"
      label-position="left"
    >

      <div class="title-container">
        <h3 class="title">
          同安会员管理系统
        </h3>
<!--        <lang-select class="set-language"/>-->
      </div>

      <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon icon-class="user"/>
        </span>
        <el-input
          ref="username"
          v-model="loginForm.username"
          placeholder="账号"
          name="username"
          type="text"
          tabindex="1"
          autocomplete="on"
        />
      </el-form-item>

      <el-tooltip v-model="capsTooltip" content="Caps lock is On" placement="right" manual>
        <el-form-item prop="password">
          <span class="svg-container">
            <svg-icon icon-class="password"/>
          </span>
          <el-input
            :key="passwordType"
            ref="password"
            v-model="loginForm.password"
            :type="passwordType"
            :placeholder="$t('login.password')"
            name="password"
            tabindex="2"
            autocomplete="on"
            @keyup.native="checkCapslock"
            @blur="capsTooltip = false"
            @keyup.enter.native="handleLogin"
          />
          <span class="show-pwd" @click="showPwd">
            <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'"/>
          </span>
        </el-form-item>
      </el-tooltip>

      <el-form-item prop="captcha" >
        <el-input
          ref="captcha"
          v-model="loginForm.captcha"
          placeholder="验证码"
          name="captcha"
          type="text"
          tabindex="3"
          autocomplete="off"
          style="width:74.4%;background: rgba(0,0,0,0.1)"
        />
        <img :src="captchaImg" @click="getCaptcha" class="captcha"/>

      </el-form-item>

      <el-button
        :loading="loading"
        type="primary"
        style="width:100%;"
        @click.native.prevent="handleLogin"
      >
        {{ $t('login.logIn') }}
      </el-button>

<!--      <el-button type="text" class="fr" @click="handleForgotPassword">-->
<!--        {{ $t('login.forgotPassword') }}-->
<!--      </el-button>-->
      <div  style="width:100%;text-align: right">
        <el-button type="text" v-if="!isLogin" @click="forMM">忘记密码?</el-button>
      </div>
    </el-form>
    <el-dialog title="忘记密码" :visible.sync="isLogin" width="500px">
      <el-form :model="passForm" ref="passForm" label-width="70px" class="demo-ruleForm" :rules="passRules">
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="passForm.phone" placeholder="请输入手机号"></el-input>
        </el-form-item>
        <el-form-item label="验证码" prop="code" >
          <div style="display: flex">
          <el-input v-model="passForm.captcha" placeholder="请输入验证码"></el-input>
          <el-button size="small" type="primary" @click="getCode" :disabled="initTime?true:false">{{codeName}}</el-button>
          </div>
        </el-form-item>
        <el-form-item label="新密码" prop="password">
          <el-input v-model="passForm.password" placeholder="请输入新密码"></el-input>
        </el-form-item>
        <el-form-item style="float: right">
          <el-button size="small" @click="isLogin=false">取消</el-button>
          <el-button size="small" type="primary" @click="handleAB('passForm')">确定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
  import {validateRequire,validatePhone} from '@/utils/validate'
  import {Common} from '../../api'

  export default {
    name: 'Login',
    data() {


      const validatePassword = (rule, value, callback) => {
        if (value.length < 6|| value.length > 18) {
          callback(new Error(this.$t('login.tip1')))
        } else {
          callback()
        }
      }
      return {
        loginForm: {
          username: '',
          password: '',
          captcha:''
        },
        captchaImg:null,
        loginRules: {
          username: [{required: true, trigger: 'blur', validator: validateRequire, text: this.$t('login.username')}],
          password: [{required: true, trigger: 'blur', validator: validatePassword, text: this.$t('login.password')}],
          captcha: [{required: true, trigger: 'blur', validator: validateRequire, text: '验证码'}]
        },
        passRules:{
          phone: [{required: true, trigger: 'blur', validator: validatePhone, text: '手机号'}],
          password: [{required: true, trigger: 'blur', validator: validateRequire, text:'密码'}],
          captcha: [{required: true, trigger: 'blur', validator: validateRequire, text:'验证码'}]
        },
        passwordType: 'password',
        capsTooltip: false,
        loading: false,
        redirect: undefined,
        otherQuery: {},
        isLogin:false,
        passForm:{
          phone:'',
          password:'',
          captcha:''
        },
        initTime:null,
        codeName:'获取验证码'
      }
    },

    watch: {
      $route: {
        handler: function (route) {
          const query = route.query
          if (query) {
            this.redirect = query.redirect
            this.otherQuery = this.getOtherQuery(query)
          }
        },
        immediate: true
      }
    },
    created() {
      this.getCaptcha()
    },
    mounted() {

      if (this.loginForm.username === '') {
        this.$refs.username.focus()
      } else if (this.loginForm.password === '') {
        this.$refs.password.focus()
      }
    },
    beforeDestroy() {
      if (this.initTime){
        clearInterval(this.initTime)
        this.initTime=null
      }
    },
    methods: {
      async getCode(){
        if(!(/^1[3456789]\d{9}$/.test(this.passForm.phone))){
          return this.$message.error('手机号码有误')
        }
        const {code,message} = await Common.getCode({mobile:this.passForm.phone})
        if(code!==200){
          return this.$message.error(message)
        }
        this.codeName=180
        this.initTime=setInterval(()=>{
          if (this.codeName){
            this.codeName--
          }else {
            this.codeName='重新获取验证码'
            clearInterval(this.initTime)
            this.initTime=null
          }
        },1000)
      },
      async getCaptcha() {
        const {result} = await Common.getCaptcha()
        this.captchaImg = `data:image/png;base64,${result}`
      },
      checkCapslock({shiftKey, key} = {}) {
        if (key && key.length === 1) {
          if (shiftKey && (key >= 'a' && key <= 'z') || !shiftKey && (key >= 'A' && key <= 'Z')) {
            this.capsTooltip = true
          } else {
            this.capsTooltip = false
          }
        }
        if (key === 'CapsLock' && this.capsTooltip === true) {
          this.capsTooltip = false
        }
      },
       handleAB(form){
        this.$refs[form].validate(valid => {
          if (valid) {
           Common.editPassword(this.passForm).then(res=>{
             if(res.code===200){
               this.$message.success('修改密码成功')
             }
           })
           this.isLogin=false
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      forMM(){
          this.isLogin=true,
          this.passForm={
          phone:'',
            password:'',
            captcha:''
        }
        this.codeName='获取验证码'
        if (this.initTime){
          clearInterval(this.initTime)
          this.initTime=null
        }

        this.$nextTick(() => {
          this.$refs.passForm.clearValidate()
        })
      },
      showPwd() {
        if (this.passwordType === 'password') {
          this.passwordType = ''
        } else {
          this.passwordType = 'password'
        }
        this.$nextTick(() => {
          this.$refs.password.focus()
        })
      },
      handleLogin() {
        this.$refs.loginForm.validate(valid => {
          if (valid) {
            this.loading = true
            this.$store.dispatch('user/login', this.loginForm)
              .then(() => {
                this.$router.push({path: this.redirect || '/', query: this.otherQuery})
                this.loading = false
              })
              .catch(() => {
                this.loading = false
              })
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      getOtherQuery(query) {
        return Object.keys(query).reduce((acc, cur) => {
          if (cur !== 'redirect') {
            acc[cur] = query[cur]
          }
          return acc
        }, {})
      }
    }
  }
</script>

<style lang="scss" type="text/scss">
  /* 修复input 背景不协调 和光标变色 */
  /* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

  $bg: #283443;
  $light_gray: #BCC9D0;

  $cursor: #fff;

  /* reset element-ui css */
  .login-container {
    @supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
      .login-container .el-input input {
        color: $cursor;
      }
    }
    .login-form {
      .el-input {
        display: inline-block;
        height: 47px;
        width: 85%;

        input {
          background: transparent;
          border: 0px;
          -webkit-appearance: none;
          border-radius: 0px;
          padding: 12px 5px 12px 15px;
          color: $light_gray;
          height: 47px;
          caret-color: $cursor;

          &:-webkit-autofill {
            box-shadow: 0 0 0px 1000px $bg inset !important;
            -webkit-text-fill-color: $cursor !important;
          }
        }
      }

      .el-form-item {
        border: 1px solid rgba(255, 255, 255, 0.1);
        background: rgba(0, 0, 0, 0.1);
        border-radius: 5px;
        color: #454545;
      }
    }

  }
</style>

<style lang="scss" scoped type="text/scss">
  $bg: #2d3a4b;
  $dark_gray: #889aa4;
  $light_gray: #eee;

  .login-container {
    min-height: 100%;
    width: 100%;
    //background-color: $bg;
    background: url("~@/assets/images/login_bg.jpg") no-repeat center center;
    background-size: cover;
    overflow: hidden;

    .login-form {
      position: relative;
      width: 520px;
      max-width: 100%;
      padding: 160px 35px 0;
      margin: 0 auto;
      overflow: hidden;
    }

    .tips {
      font-size: 14px;
      color: #fff;
      margin-bottom: 10px;

      span {
        &:first-of-type {
          margin-right: 16px;
        }
      }
    }
    .captcha {
      vertical-align: top;
      height: 47px;
      cursor: pointer;
    }

    .svg-container {
      padding: 6px 5px 6px 15px;
      color: $dark_gray;
      vertical-align: middle;
      width: 30px;
      display: inline-block;
    }

    .title-container {
      position: relative;

      .title {
        font-size: 26px;
        color: $light_gray;
        margin: 0px auto 40px auto;
        text-align: center;
        font-weight: bold;
      }

      .set-language {
        color: #fff;
        position: absolute;
        top: 3px;
        font-size: 18px;
        right: 0px;
        cursor: pointer;
      }
    }

    .show-pwd {
      position: absolute;
      right: 10px;
      top: 7px;
      font-size: 16px;
      color: $dark_gray;
      cursor: pointer;
      user-select: none;
    }

    .thirdparty-button {
      position: absolute;
      right: 0;
      bottom: 6px;
    }

    @media only screen and (max-width: 470px) {
      .thirdparty-button {
        display: none;
      }
    }
  }

  .el-button--primary {
    background: #004FBF;
    border-color: #004FBF;
  }

  .el-button--text {
    color: $light_gray;
  }
</style>
