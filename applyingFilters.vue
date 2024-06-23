<template>
  <div class="container">
    <!-- 图片上传区域 -->
    <div class="image-upload-container">
      <div class="upload-area" @click="triggerUpload">
        <input type="file" name="image" ref="fileInput" @change="onFileChange" hidden />
        <canvas ref="canvas" v-show="imageLoaded" :style="{ maxHeight: canvasMaxHeight }"></canvas>
        <i v-if="!imageLoaded" class="el-icon-upload"></i>
      </div>
    </div>

    <!-- 滤镜按钮 -->
    <div>
      <button v-for="(filter, index) in filterList" :key="index" @click="toggleFilter(index)">
        {{ filter.title }}
      </button>
    </div>

    <!-- 下载和上传按钮 -->
    <div class="action-buttons">
      <el-button type="info" @click="downloadImage">下载图片</el-button>
      <el-button type="success" @click="uploadImage" v-if="imageLoaded">上传图片</el-button>
    </div>
  </div>
</template>


<script>
import axios from 'axios';
import { Button } from 'element-ui';

export default {
  data() {
    return {
      selectedFile: null,
      image: null,  // 存储上传的图片
      imageLoaded: false,
      appliedFilterIndex: null,
      canvasMaxHeight: '400px',
      filterList: [
        { title: '浮雕' },
        { title: '黑白色' },
        { title: '锐化' },
        { title: '去雾' },
        { title: '智能绘色' },
        { title: '底片' }
      ]
    };
  },
  components: {
    'el-button': Button,
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
        this.image = new Image();
        this.image.onload = () => {
          this.drawImage(this.image);
          this.imageLoaded = true;
        };
        this.image.src = event.target.result;
      };
      reader.readAsDataURL(file);
    },
    drawImage() {
      const canvas = this.$refs.canvas;
      if (!this.image || !canvas) {
        console.error("Image or canvas element is not found");
        return;
      }
      canvas.width = this.image.width;
      canvas.height = this.image.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(this.image, 0, 0);
    },
    toggleFilter(index) {
      if (this.appliedFilterIndex === index) {
        this.resetImage();
        this.appliedFilterIndex = null;
      } else {
        this.applyFilter(index);
        this.appliedFilterIndex = index;
      }
    },
    resetImage() {
      this.drawImage();
    },
    applyFilter(filterIndex) {
    const canvas = this.$refs.canvas;
    const ctx = canvas.getContext('2d');
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    switch (filterIndex) {
      case 0: // 浮雕
          this.embossEffect(data);
          break;
      case 1: // 黑白色
        this.convertToGrayscale(data);
        break;
      case 2: // 锐化
        this.sharpenEffect(data);
        break;
      case 3: // 去雾
        this.dehazeEffect(data);
        break;
      case 4: // 智能绘色
        this.colorSketchEffect(data);
        break;
      case 5: // 底片
        this.invertColors(data);
        break;
    }
    ctx.putImageData(imageData, 0, 0);
  },
 uploadImage() {
      const canvas = this.$refs.canvas;
      canvas.toBlob(blob => {
        const formData = new FormData();
        formData.append('image', blob, 'filtered-image.png');
        axios.post('/Api/ImageController/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }).then(response => {
          console.log('上传成功:', response.data);
        }).catch(error => {
          console.error('上传失败:', error);
        });
      }, 'image/png');
    },
    downloadImage() {
      const canvas = this.$refs.canvas;
      const link = document.createElement('a');
      link.download = 'filtered-image.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    },
    embossEffect(data) {
    for (let i = 0; i < data.length; i += 4) {
    // 遍历图像数据的每个像素
    data[i] = data[i] - data[i + 4] + 128;       // 对红色通道应用浮雕效果
    data[i + 1] = data[i + 1] - data[i + 5] + 128; // 对绿色通道应用浮雕效果
    data[i + 2] = data[i + 2] - data[i + 6] + 128; // 对蓝色通道应用浮雕效果
    let avg = (data[i] + data[i + 1] + data[i + 2]) / 3; // 计算RGB通道的平均值
    data[i] = avg;    
    data[i + 1] = avg; 
    data[i + 2] = avg; 
  }},
    convertToGrayscale(data) {

  for (let i = 0; i < data.length; i += 4) {
    // 遍历图像数据的每个像素
    const avg = (data[i] + data[i + 1] + data[i + 2]) / 3; // 计算RGB通道的平均值
    data[i] = avg; // 
    data[i + 1] = avg; 
    data[i + 2] = avg; 
  }
},
 sharpenEffect(data, contrastFactor = 1) {
  // 对比度因子，默认为1，可以根据需要调整

  for (let i = 0; i < data.length; i += 4) {
    // 提取当前像素的RGB值
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    // 计算亮度，并增强对比度
    const brightness = 0.3 * r + 0.59 * g + 0.11 * b;
    const adjustedBrightness = brightness * contrastFactor;

    // 调整RGB值，同时保持颜色平衡
    data[i] = Math.max(0, Math.min(255, r + (r - brightness) * adjustedBrightness));
    data[i + 1] = Math.max(0, Math.min(255, g + (g - brightness) * adjustedBrightness));
    data[i + 2] = Math.max(0, Math.min(255, b + (b - brightness) * adjustedBrightness));
    // Alpha通道保持不变
  }
},

    dehazeEffect(data) {
  for (let i = 0; i < data.length; i += 4) {
//增加通道亮度
    data[i] += 20;     
    data[i + 1] += 20; 
    data[i + 2] += 20; 
  }
},
    colorSketchEffect(data) {
  // 将图像转换为灰度，然后通过减少颜色深度来实现素描效果
  for (let i = 0; i < data.length; i += 4) {
    let avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
    avg = Math.round(avg / 50) * 50; // 减少颜色深度
    data[i] = avg;
    data[i + 1] = avg;
    data[i + 2] = avg;
  }
},
   invertColors(data) {
      for (let i = 0; i < data.length; i += 4) {
        data[i] = 255 - data[i];       // R
        data[i + 1] = 255 - data[i + 1]; // G
        data[i + 2] = 255 - data[i + 2]; // B
      }
    },

}};
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
    height: 300px; /* 在较小屏幕上减小高度 */
  }

  .controls {
    flex-direction: column;
  }

  .action-buttons {
    flex-direction: column;
  }
}
</style>
