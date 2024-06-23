<template>
  <div class="page">
    <div class="loginBox">
      <div class="commonTitle" style="font-weight: 500;margin-bottom: 30px;color:white">账号密码登录</div>
      <el-input v-model="loginForm.username" class="inputBox" placeholder="请输入账号"></el-input>
      <el-input v-model="loginForm.password" type="password" class="inputBox" placeholder="请输入密码"></el-input>
      <el-button type="primary" @click="submitForm" style="width: 350px;margin-top: 10px;">立即登录</el-button>
      <div class="flex align-center bottomBox">
        <div @click="back" style="margin-right:10px ">返回首页</div>
      </div>
    </div>
    <div class="registerBox" @click="toRegister">
      <div style="color:white">还没有账号？</div>
      <div style="margin-left: 5px;color:white">立即注册</div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: "AppLogin", // 修改组件名称
  data() {
    return {
      loginForm: {
        username: '',
        password: ''
      }
    };
  },
  methods: {
   submitForm() {
      axios.post('/Api/UserController/login', this.loginForm)
        .then(() => {
          // 使用 response 中的 userId 更新 Vuex store
          this.$store.commit('setCurrentUser', this.loginForm.username);
          // 将用户名保存到本地存储中以实现持久登录
        localStorage.setItem('currentUser', JSON.stringify(this.loginForm.username));
          this.$message({
            message: '登录成功',
            type: 'success',

            onClose: () => {
              this.$router.push("/index"); //登陆成功跳转到处理页面
            }
          });
        })
        .catch(error => {
          this.$message.error('登录失败: ' + error.message);
        });
    },

    back() {
      this.$router.push("/welcome");
    },

    toRegister() {
      this.$router.push('/register');
    }
  }
};
</script>


<style scoped>
	.page {
		width: 100vw;
		height: 100vh;
		box-sizing: border-box;
		padding-top: 150px;
		background-color: #f6f7f9;
    background: url(@/assets/images/galaxy.webp);
	}

	.loginBox {
		background-color: #fff;
		border: 1px solid rgb(34, 33, 33);
		border-radius: 8px;
		box-shadow: 0 3px 6px -4px rgba(0, 0, 0, .12), 0 6px 16px 0 rgba(0, 0, 0, .08), 0 9px 28px 8px rgba(0, 0, 0, .05);
		height: 390px;
		box-sizing: border-box;
		margin: 0 auto 20px;
		padding: 48px 32px 0;
		width: 416px;
		position: relative;
    background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(@/assets/images/galaxy.webp);
	}

	.inputBox {
		width: 350px;
		height: 48px;
		margin-bottom: 20px;
	}

	.forgetText {
		position: absolute;
		bottom: 75px;
		left: 35px;
		color: #676873;
		cursor: pointer;
	}

	.bottomBox {
		position: absolute;
		bottom: 75px;
		right: 20px;
		cursor: pointer;
	}
	.registerBox{
		width: 416px;
		margin: 20px auto;
		display: flex;
		justify-content: center;
		cursor: pointer;
	}
</style>
