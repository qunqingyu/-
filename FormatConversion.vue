<template>
  <div class="container">
    <!-- 图片上传区域 -->
    <div class="image-upload-container">
      <div class="upload-area" @click="triggerUpload">
        <!-- 隐藏的文件输入，用于触发文件选择 -->
        <input type="file" ref="fileInput" @change="onFileChange" hidden />
        <!-- 显示选择的图片 -->
        <canvas ref="canvas" v-show="imageLoaded" :style="{ maxHeight: canvasMaxHeight }"></canvas>
        <!-- 上传图标，仅在图片未加载时显示 -->
        <i v-if="!imageLoaded" class="el-icon-upload"></i>
      </div>
    </div>

    <!-- 格式转换和操作按钮区域 -->
    <div class="controls">
      <!-- 下拉框选择图片转换格式 -->
      <el-select v-model="form.format" placeholder="请选择转换后的格式">
        <el-option v-for="item in options" :key="item" :label="item" :value="item"></el-option>
      </el-select>
      <!-- 按钮用于触发图片格式转换 -->
      <el-button type="primary" @click="convertImageFormat">开始转换</el-button>
      <!-- 上传和下载图片的按钮 -->
      <el-button type="success" @click="uploadImage" :disabled="!newImageDataUrl">上传图片</el-button>
      <el-button type="info" @click="downloadImage" :disabled="!newImageDataUrl">保存到本地</el-button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { Button, Select, Option } from 'element-ui';

export default {
  data() {
    return {
      form: {
        imgSrc: '',
        format: ''
      },
      newImageDataUrl: '',
      imageLoaded: false,
      canvasMaxHeight: 'auto',
      options: ['.png', '.jpg', '.gif', '.bmp', '.webp', '.tiff','.text']
    };
  },
  components: {
    'el-button': Button,
    'el-select': Select,
    'el-option': Option
  },
  methods: {
    triggerUpload() {
      // 触发文件选择
      this.$refs.fileInput.click();
    },
    onFileChange(e) {
      // 处理文件选择，读取并显示图片
      const file = e.target.files[0];
      if (!file) {
        this.imageLoaded = false;
        return;
      }
      const reader = new FileReader();
      reader.onload = e => {
        this.form.imgSrc = e.target.result;
        this.imageLoaded = true;
        this.updateCanvas();
      };
      reader.readAsDataURL(file);
    },
    updateCanvas() {
      // 将选定的图片绘制到Canvas上
      const img = new Image();
      img.onload = () => {
        const canvas = this.$refs.canvas;
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
      };
      img.src = this.form.imgSrc;
    },
    async convertImageFormat() {
      // 转换图片格式
      const img = new Image();
      img.src = this.form.imgSrc;
      await new Promise(resolve => img.onload = resolve);

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      this.newImageDataUrl = canvas.toDataURL('image/' + this.form.format.slice(1));
      this.$message.success('转换成功');
    },
    async uploadImage() {
      // 上传图片到服务器
      const blob = await fetch(this.newImageDataUrl).then(r => r.blob());
      const formData = new FormData();
      formData.append('image', blob, `image.${this.form.format.slice(1)}`);
      await axios.post('/Api/ImageController/upload', formData, {
        headers: {'Content-Type': 'multipart/form-data'},
      });
      this.$message.success('上传成功');
    },
    downloadImage() {
      // 下载图片到本地
      const link = document.createElement('a');
      link.href = this.newImageDataUrl;
      link.download = `converted-image.${this.form.format.slice(1)}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }
};
</script>

<style scoped>
.page {
  width: 100%;
  padding: 40px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.image-upload-container {
  width: 100%;
  margin-bottom: 20px;
  text-align: center;
}

.el-icon-upload {
  font-size: 80px; /* 调整图标的大小 */
  color: #c0c0c0; /* 调整图标的颜色 */
}

.preview img {
  max-width: 100%;
  max-height: 400px;
  margin-top: 20px;
}

.operateBox {
  width: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.action-buttons {
  display: flex;
  justify-content: space-around;
  margin-top: 20px;
}
</style>
