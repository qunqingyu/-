<template>
  <div class="page">
    <div class="loginBox">
      <el-input v-model="ruleForm.username" class="inputBox" placeholder="请输入账号"></el-input>
      <el-input v-model="ruleForm.email" class="inputBox" placeholder="请输入邮箱"></el-input>
      <el-input v-model="ruleForm.password" class="inputBox" type="password" placeholder="请输入密码"></el-input>
      <el-button type="primary" @click="submitForm" style="width: 350px; margin-top: 10px;">立即注册</el-button>
    </div>
    <div class="registerBox" @click="toLogin">
      <div style="color:white">已有账号</div>
      <div style="margin-left: 5px;color:white">立即登录</div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
export default {
  data() {
    return {
      ruleForm: {
        username: '',
        email: '',
        password: ''
      }
    };
  },
  methods: {
    toLogin() {
      this.$router.push('/login');
    },
    submitForm() {
      axios.post('/Api/UserController/create', this.ruleForm)
        .then(() => {
      
          this.$message({
            message: '注册成功',
            type: 'success',
            onClose: () => {
              this.$router.push('/login');
            }
          });
        })
        .catch(error => {
          console.error('Registration failed:', error);
          this.$message.error('注册失败，请重试');
        });
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
		background-color: rgb(57, 50, 50);
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
		color: white;
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
  .el-input__inner{
		color:#4b4b4b;
	}
</style>
