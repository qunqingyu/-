<template>
	<div class="page">
		<div class="centerBox flex flex-direction align-center">
			<div class="title">
				欢迎来到图片处理网站
			</div>
			<div class="describ">
				提供包含裁剪图片、调整清晰度、应用滤镜、格式转换、加水印等多种图片处理方式。
			</div>
		
			<el-button type="primary" class="useBtn" @click="toLogin">开始使用</el-button>
		</div>
		
	</div>
</template>

<script>
	export default({
		methods:{
			toLogin(){
				this.$router.push("/login")
			}
		}
	})
</script>

<style scoped>
	.page{
		width: 100vw;
		height: 100vh;
		box-sizing: border-box;
		padding-top: 180px;
		background-color: #f6f7f9;
		background: url(/src/assets/images/star.jpg);
	}
	.centerBox{
		width: 800px;
		margin: 0px auto;
	}
	.title{
		
		font-size: 32px;
		font-weight: bold;
		color: #fff;
	}
	.describ{
		color: #fff;
		margin-top: 50px;
	}
	.useBtn{
		margin-top: 160px;
		width: 220px;
	}
</style>