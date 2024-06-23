<template>
  <div class="container">
    <!-- 图片上传区域 -->
    <div class="image-upload-container">
      <div class="upload-area" @click="triggerUpload">
        <input type="file" ref="fileInput" @change="onFileChange" hidden />
        <canvas ref="canvas" v-show="imageLoaded" :style="{ maxHeight: canvasMaxHeight }"></canvas>
        <i v-if="!imageLoaded" class="el-icon-upload"></i>
      </div>
    </div>

    <!-- 水印控制区域 -->
    <div class="controls">
      <div class="control-item">
        <label>水印文本:</label>
        <el-input v-model="watermarkText" placeholder="输入水印文本"></el-input>
      </div>
      <div class="control-item">
        <label>字体大小:</label>
        <el-input-number v-model="fontSize" :min="10" :max="500"></el-input-number>
      </div>
      <div class="coordinates">
        <div class="control-item">
          <label>X 坐标:</label>
          <el-input-number v-model="x"></el-input-number>
        </div>
        <div class="control-item">
          <label>Y 坐标:</label>
          <el-input-number v-model="y"></el-input-number>
        </div>
      </div>
      <div class="control-item">
        <label>透明度:</label>
        <input type="range" v-model.number="opacity" min="0" max="1" step="0.01" />
      </div>
      <div class="action-buttons">
        <el-button type="info" @click="downloadImage">保存图片</el-button>
        <el-button type="success" @click="uploadImage" v-if="imageLoaded">上传图片</el-button>
      </div>
    </div>
  </div>
</template>



<script>
import axios from 'axios';
import {  Button, Input, InputNumber } from 'element-ui';

export default {
  data() {
    return {
      canvasMaxHeight: 'auto',
      selectedFile: null,
      watermarkText: '水印',
      fontSize: 30,
      x: 32,
      y: 46,
      opacity: 1.0,
      imageLoaded: false,
      uploadAreaHeight: 'auto', // 让上传区域的高度自动调整以适应图片
    };
  },
  components: {
    'el-button': Button,
    'el-input': Input,
    'el-input-number': InputNumber,
   
  },
  methods: {
    triggerUpload() {
      this.$refs.fileInput.click();
    },
     onFileChange(e) {
  const file = e.target.files[0];
  if (!file) {
    this.imageLoaded = false;
    return;
  }
  this.selectedFile = file;
  const reader = new FileReader();
  reader.onload = (event) => {
    const img = new Image();
    img.onload = () => {
      this.uploadAreaWidth = `${img.naturalWidth}px`; // 根据图片宽度调整上传框宽度
      this.uploadAreaHeight = `${img.naturalHeight}px`; // 根据图片高度调整上传框高度
      this.imageLoaded = true;
      this.updateCanvas(); // 现在调用 updateCanvas 无需参数
    };
    img.src = event.target.result;
  };
  reader.readAsDataURL(file);
},

    updateCanvas() {
  if (!this.selectedFile) {
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    const img = new Image();
    img.onload = () => {
      const canvas = this.$refs.canvas;
      // 设置 canvas 的大小与图片的原始尺寸一致
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;

      const ctx = canvas.getContext('2d');
      // 清除画布内容
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      // 绘制图片
      ctx.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight);

      // 设置水印样式
      ctx.globalAlpha = this.opacity; // 设置水印透明度
      ctx.font = `${this.fontSize}px Arial`; // 设置水印字体大小
      ctx.fillStyle = 'black'; // 设置水印颜色
      ctx.fillText(this.watermarkText, this.x, this.y); // 绘制水印文本
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(this.selectedFile);
},


    downloadImage() {
      const canvas = this.$refs.canvas;
      const image = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = image;
      link.download = 'watermarked-image.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
    async uploadImage() {
      const canvas = this.$refs.canvas;
      canvas.toBlob(async (blob) => {
        const formData = new FormData();
        formData.append('image', blob, 'watermarked.png');
        const response = await axios.post('http://192.168.32.128/ImageController/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        console.log('上传成功:', response.data);
        
      }, 'image/png');
    },
  },
  watch: {
watermarkText() {
      if (this.imageLoaded) {
        this.updateCanvas();
      }
    },
    fontSize() {
      if (this.imageLoaded) {
        this.updateCanvas();
      }
    },
    x() {
      if (this.imageLoaded) {
        this.updateCanvas();
      }
    },
    y() {
      if (this.imageLoaded) {
        this.updateCanvas();
      }
    },
    opacity() {
      if (this.imageLoaded) {
        this.updateCanvas();
      }
    },
  },
};
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 800px;
  margin: auto; 
}

.image-upload-container {
  position: relative;
  margin: 20px 0;
  width: 100%;
  height: 400px; 
  display: flex;
  justify-content: center;
  align-items: center;
}

.upload-area {
  cursor: pointer;
  border: 2px dashed #d9d9d9;
  width: 100%; 
  height: 100%; 
  display: flex;
  justify-content: center;
  align-items: center;
}

.upload-area i {
  font-size: 40px; 
  color: #C0C4CC; 
}

.upload-area canvas {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain; 
}

.controls {
  width: 100%; 
  margin-top: 20px; 
}

.coordinates,
.font-size-input {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px; 
}


.slider-container {
  margin: 10px 0;
}

.slider-container label {
  margin-right: 10px;
}

input[type="range"] {
appearance: none;
  -webkit-appearance: none; 
  width: 100%; 
  height: 2px;
  background: #409EFF; 
  border-radius: 5px; 
  outline: none;
}

input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none; 
  width: 20px;
  height: 20px; 
  background: #FFFFFF; 
  cursor: pointer; 
  border: 2px solid #409EFF; 
  border-radius: 50%;
}

input[type="range"]::-moz-range-thumb {
  background: #FFFFFF;
  border: 2px solid #409EFF;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  cursor: pointer;
}

.action-buttons {
  display: flex;
  justify-content: center;
  gap: 20px; 
}


.el-button {
  margin-top: 10px; 
}


@media (max-width: 768px) {
  .container {
    max-width: 100%;
  }
  
  .image-upload-container {
    height: 300px; 
  }

  .controls {
    flex-direction: column;
  }

  .coordinates,
  .font-size-input {
    flex-direction: column;
  }

  .action-buttons {
    flex-direction: column;
  }
}
</style>