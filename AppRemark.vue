<template>
  <div class="page">
    <!-- 用户评论列表 -->
    <div class="remarkList">
      <div class="commonTitle">用户评论</div>
      <div class="remarkItem" v-for="(comment, index) in commentList" :key="index">
        <!-- 评论内容 -->
        <div class="flex align-center justify-between">
          <div class="itemName">{{ comment.username }}</div>
          <div class="itemDate">{{ comment.created_at }}</div>
        </div>
        <div class="itemRemark">
          <!-- el rate默认样式为五颗星-->
          <el-rate v-model="comment.rate" :colors="colors" disabled></el-rate>
        
        </div>
        <div class="itemRemark">{{ comment.comment }}</div>
      </div>
    </div>

    <!-- 添加评论按钮 -->
    <el-button type="primary" @click="addRemark" style="width: 100px;">添加评价</el-button>

    <!-- 添加评论对话框 -->
    <el-dialog title="添加评价" :visible.sync="dialogVisible" width="30%">
      <div class="flex align-center">
        <div class="commonLeft">评分</div>
       <el-rate v-model="rate" :colors="colors"></el-rate> 
      </div>
      <div class="flex align-center" style="margin-top: 20px;">
        <div class="commonLeft">评价</div>
        <el-input style="width: 300px;" type="textarea" :rows="5" placeholder="请输入内容" v-model="textarea"></el-input>
      </div>
      <div class="flex align-center justify-center">
        <el-button type="primary" style="width: 120px; margin-top: 80px;" @click="submit">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import axios from 'axios';
import { mapGetters } from 'vuex';

export default {
  data() {
    return {
     rate: null,
      colors: ['#99A9BF', '#F7BA2A', '#FF9900'],
      textarea: '',
      commentList: [],
      dialogVisible: false
    };
  },
  computed: {
    ...mapGetters(['getCurrentUser'])
  },
  created() {
    this.loadComments();
  },
  methods: {
    loadComments() {
      axios.get('/Api/CommentController/getComments')
        .then(response => {
          this.commentList = response.data;
        })
        .catch(error => {
          console.error('加载评论失败:', error);
        });
    },
    addRemark() {
      if (!this.getCurrentUser) {
        this.$message.error('请先登录');
        return;
      }//首先检查用户是否登录（this.getCurrentUser）。如果用户未登录，则显示错误消息并返回，阻止进一步操作。
      this.dialogVisible = true;
    },
    getNowTime() {
      const date = new Date();
      return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
    },
    submit() {
      if (!this.getCurrentUser) {
        this.$message.error('请先登录');
        return;
      }
      const newComment = {
        username: this.getCurrentUser,
        comment: this.textarea,
        rate: this.rate,
        date: this.getNowTime()
      };
      axios.post('/Api/CommentController/addComment', newComment)
        .then(() => {
          this.loadComments(); // 重新加载评论
          this.dialogVisible = false;
          this.$message.success('评论添加成功');
        })
        .catch(error => {
          console.error('添加评论失败:', error);
          this.$message.error('评论添加失败');
        });
      this.rate = null;
      this.textarea = '';
    }
  }
};
</script>

<style scoped>
	.page {
		width: 100%;
		height: 100%;
		box-sizing: border-box;
		padding: 40px 20px;
	}

	.el-dialog {
		border-radius: 4px;
	}

	.remarkList {
		width: 100%;
		height: 100%;
		overflow-y: auto;
	}

	.remarkItem {
		margin-bottom: 20px;
	}



	.itemDate {
		font-size: 12px;
		color: #aaa;
	}

	.itemRemark {
		margin-top: 5px;
	}

	.commonLeft {
		margin-right: 15px;
		font-size: 14px;
	}
</style>
