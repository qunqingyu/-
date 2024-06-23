<template>
	<div class="page">
		<div class="header ">
			<div class="headerLeft">
				图片处理网站
			</div>
			
<div class="flex align-center headerRight">
  <div style="margin-right: 20px;">
    {{ $store.getters.getCurrentUser }}
  </div>
				<div @click="logout" style="cursor: pointer;">
					退出登录
				</div>
			</div>
		</div>
				<div class="contentBox">
			<div class="menu">
				<el-menu :default-active="active" class="el-menu-vertical-demo" :router="true" @select="menuSelect" background-color="rgb(33,33,33)" text-color="#fff" active-text-color="white">
					<el-menu-item :index="item.path" v-for="(item,index) in menuList" :key="index">
						<span slot="title">{{item.title}}</span>
					</el-menu-item>
				</el-menu>
			</div>
			<div class="rightShow">
				<router-view></router-view>
			</div>
		</div>
	</div>
</template>

<script>

	export default {
	
		data() {
			return {
				
				menuList: [

					{
						title: '图片裁剪',
						path: '/croppingImage',
					}, {
						title: '清晰度调整',
						path: '/adjustDefinition',
					}, {
						title: '应用滤镜',
						path: '/applyingFilters',
					}, {
						title: '格式转换',
						path: '/formatConversion',
					}, {
						title: '添加水印',
						path: '/addWatermark',
					},
					{
						title: '评论建议',
						path: '/remark',
					}
				],
			}
		},
		created(){
			let path = localStorage.getItem('path');
			if(path){
				this.active = path
			}
		},
		methods: {
			logout() {
				this.$router.push("/login");
				localStorage.clear();
			},
			menuSelect(e){
				this.active = e;
				localStorage.setItem("path",e);
			}
		}
	}
</script>
<style scoped>
    .page {
        width: 100vw;
        height: 100vh;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
    }

    .header {
        width: 100%;
        height: 80px;
        background: linear-gradient(to right, #333, #000); /* 黑色渐变 */
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        box-sizing: border-box;
        padding: 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .headerLeft {
        font-size: 20px;
        font-weight: bold;
        letter-spacing: 2px;
        color: #fff;
    }

    .headerRight {
        font-size: 14px;
        font-weight: bold;
        letter-spacing: 2px;
        color: #fff;
        display: flex;
        align-items: center;
    }

    .headerRight > div {
        cursor: pointer;
        transition: transform 0.3s ease;
    }

    .headerRight > div:hover {
        transform: scale(1.1);
    }

    .contentBox {
        flex-grow: 1;
        display: flex;
        height: calc(100vh - 80px);
    }

    .menu {
        height: 100%;
        width: 200px;
        background-color: #005fcc; 
        box-shadow: 4px 0 8px rgba(0, 0, 0, 0.1);
    }

    .el-menu {
        height: 100%;
    }

    .el-menu-item {
        transition: background-color 0.3s, color 0.3s;
    }

    .el-menu-item:hover {
        background-color: #004da3; 
        color: #fff;
    }

    .el-menu-item.is-active {
        font-weight: bold;
        color: #fff;
    }

    .rightShow {
        flex-grow: 1;
        background-color: #f0f2f4;
        padding: 10px 50px;
        box-sizing: border-box;
        background: url(/src/assets/images/bg.png) no-repeat center;
        background-size: 100%;
    }
</style>

