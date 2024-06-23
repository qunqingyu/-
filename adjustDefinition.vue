<template>
  <div class="image-editor">
    <!-- 图片上传区域 -->
    <div class="upload-area" @click="triggerFileUpload">
      <input type="file" ref="fileInput" @change="onImageSelected" hidden />
      <div v-if="imageLoaded" ref="canvasContainer" class="canvas-container"></div>
      <i v-else class="el-icon-upload upload-icon"></i>
    </div>
    <!-- 调整保存图片区域 -->
    <div class="slider-container">
      <input type="range" v-model="blurAmount" min="0" max="10" @input="applyBlurFilter" />
    </div>
    <button class="el-button el-button--primary" @click="uploadImage">上传图片</button>
  </div>
</template>

<script>
import * as PIXI from 'pixi.js';
import axios from 'axios';
import { BlurFilter } from '@pixi/filter-blur';
import { mapGetters } from 'vuex';
export default {
   
  data() {
    return {
      pixiApp: null,
      imageLoaded: false,
      blurAmount: 0,
    };
  },
  computed: {
    ...mapGetters(['getCurrentUser'])},
  methods: {
    triggerFileUpload() {
      this.$refs.fileInput.click();
    },
    onImageSelected(event) {
    const file = event.target.files[0];
    if (file) {
      this.imageLoaded = true;
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (e) => {
        // 延迟执行以确保DOM已更新
        this.$nextTick(() => {
          this.createPixiApp(e.target.result);
        });
      };
    }
  },
 createPixiApp(imageSrc) {
    // 确保 canvasContainer 已经在 DOM 中
    if (!this.$refs.canvasContainer) {
      console.error("Canvas container is not found in the DOM");
      return;
    }

    // 获取容器尺寸
    const { offsetWidth, offsetHeight } = this.$refs.canvasContainer;
    console.log(`Canvas Size: ${offsetWidth} x ${offsetHeight}`); // 调试输出

    if (this.pixiApp) {
      this.pixiApp.destroy(true);
    }

    // 创建 PIXI 应用
    this.pixiApp = new PIXI.Application({
      width: offsetWidth,
      height: offsetHeight,
      transparent: true,
    });
    this.$refs.canvasContainer.appendChild(this.pixiApp.view);

    // 加载图像并添加到 PIXI 应用
    const sprite = PIXI.Sprite.from(imageSrc);
    sprite.width = offsetWidth;
    sprite.height = offsetHeight;
    this.pixiApp.stage.addChild(sprite);
    console.log("Image added to PIXI app"); // 调试输出
  },
    applyBlurFilter() {
      const blurFilter = new BlurFilter(this.blurAmount);
      if (this.pixiApp && this.pixiApp.stage.children[0]) {
        this.pixiApp.stage.children[0].filters = [blurFilter];
      }
    },
  getImageBlob() {
      return new Promise((resolve, reject) => {
        if (!this.pixiApp) {
          reject("PIXI app not initialized");
          return;
        }

        // 渲染 PIXI 应用到临时canvas
        const renderer = this.pixiApp.renderer;
        const canvas = renderer.view;
        renderer.render(this.pixiApp.stage);

        // 将canvas内容转换为Blob
        canvas.toBlob((blob) => {
          resolve(blob);
        }, 'image/png');
      });
    },

    uploadImage() {
      this.getImageBlob().then((imageBlob) => {
        // 创建FormData对象
        const formData = new FormData();
        formData.append('image', imageBlob);

        // 发送POST请求到后端
        axios.post('/Api/ImageController/upload', formData).then((response) => {
          console.log('Image uploaded:', response.data);
        }).catch((error) => {
          console.error('Upload failed:', error);
        });
      }).catch((error) => {
        console.error('Error getting image blob:', error);
      });
    },

   
    dataURLtoBlob(dataURL) {
      const parts = dataURL.split(';base64,');
      const imageType = parts[0].split(':')[1];
      const decodedData = window.atob(parts[1]);
      const arrayBuffer = new ArrayBuffer(decodedData.length);
      const intArray = new Uint8Array(arrayBuffer);

      for (let i = 0; i < decodedData.length; ++i) {
        intArray[i] = decodedData.charCodeAt(i);
      }

      return new Blob([intArray], { type: imageType });
    },
	downloadImage() {
      if (!this.pixiApp) {
        console.error("PIXI app not initialized");
        return;
      }

      const renderer = this.pixiApp.renderer;
      renderer.render(this.pixiApp.stage);
      const dataURL = renderer.view.toDataURL('image/png');

      const a = document.createElement('a');
      a.href = dataURL;
      a.download = 'edited-image.png';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      console.log("Download triggered with data URL: " + dataURL.slice(0, 30) + "..."); // 调试输出
    },                       
  },

   mounted() {
  // 初始化 PIXI 应用
  this.$nextTick(() => {
    if (this.$refs.canvasContainer) {
      this.pixiApp = new PIXI.Application({
        width: this.$refs.canvasContainer.offsetWidth,
        height: this.$refs.canvasContainer.offsetHeight,
        transparent: true,
      });
      this.$refs.canvasContainer.appendChild(this.pixiApp.view);
    }
  });
},}
</script>


<style scoped>
.image-editor {
  margin: auto;
  width: 100%; 
  height: 600px; 
  display: flex;
  justify-content: center;
  align-items: center;
gap:20px;
flex-direction: column;
}

.upload-area {
    cursor: pointer;
  border: 2px dashed #d9d9d9;
  width: 100%; 
  height:100%; 
  display: flex;
  justify-content: center;
  align-items: center;

}

.upload-area .upload-icon {
  font-size: 28px;
  color: #C0C4CC;
}

.canvas-container {
  width: 500px; 
  height: 400px; 
  display: flex;
  justify-content: center;
  align-items: center;
}


.slider-container {
  width: 100%;
  margin: 10px 0;
}

input[type="range"] {
  appearance: none;
  -webkit-appearance: none; 
  width: 100%;
  background: #409EFF; 
  outline: none;
  height: 5px; 
  border-radius: 5px; 
}

input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 20px;
  height: 20px; 
  background: #FFFFFF; 
  cursor: pointer; 
  border: 2px solid #409EFF; 
  border-radius: 50%; 
}

input[type="range"]::-moz-range-thumb {
  width: 20px;
  height: 20px;
  background: #FFFFFF;
  cursor: pointer;
  border: 2px solid #409EFF;
  border-radius: 50%;
}


.el-button {
  margin-top: 10px;
}
</style>
