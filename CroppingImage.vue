<template>
  <div class="cropper-content">
    <div class="cropper-box">
      <div class="cropper">
        <!-- Vue Cropper组件配置 -->
        <vue-cropper
          ref="cropper"
          :img="option.img"
          :outputSize="option.outputSize"
          :outputType="option.outputType"
          :info="option.info"
          :canScale="option.canScale"
          :autoCrop="option.autoCrop"
          :autoCropWidth="option.autoCropWidth"
          :autoCropHeight="option.autoCropHeight"
          :fixed="option.fixed"
          :fixedNumber="option.fixedNumber"
          :full="option.full"
          :fixedBox="option.fixedBox"
          :canMove="option.canMove"
          :canMoveBox="option.canMoveBox"
          :original="option.original"
          :centerBox="option.centerBox"
          :height="option.height"
          :infoTrue="option.infoTrue"
          :maxImgSize="option.maxImgSize"
          :enlarge="option.enlarge"
          :mode="option.mode"
          @realTime="realTime"
          @imgLoad="imgLoad"
        ></vue-cropper>
      </div>
      <div class="show-preview">
        <div :style="previews.div" class="preview">
          <img :src="previews.url" :style="previews.img" />
        </div>
      </div>
    </div>
    <div class="handle-cropper">
      <div class="scope-btn">
        <!-- 图片预览和上传按钮 -->
        <label class="btn" for="uploads">预览图片</label>
        <input
          type="file"
          id="uploads"
          style="position: absolute; clip: rect(0 0 0 0)"
          accept="image/png, image/jpeg, image/gif, image/jpg"
          @change="selectImg($event)"
        />
        <el-button size="mini" type="info" @click="uploadToServer">上传到服务器</el-button>
        <el-button size="mini" type="danger" plain icon="el-icon-zoom-in" @click="changeScale(1)">放大</el-button>
        <el-button size="mini" type="danger" plain icon="el-icon-zoom-out" @click="changeScale(-1)">缩小</el-button>
        <el-button size="mini" type="danger" plain @click="rotateLeft">↺ 左旋转</el-button>
        <el-button size="mini" type="danger" plain @click="rotateRight">↻ 右旋转</el-button>
      </div>
      <div class="upload-btn">
        <!-- 保存图片按钮 -->
        <el-button size="mini" type="success" @click="onConfirm('blob')">保存图片</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { VueCropper } from 'vue-cropper'
import axios from 'axios';

export default {
  name: 'CropperImage',
  components: {
    VueCropper
  },
  props: {
    initialImg: {
      type: String,
      require: true
    }
  },
  data() {
    return {
      // 预览和配置选项
      previews: {},
      option: {
        img: this.initialImg, // 图片地址
        outputSize: 1, // 图片质量
        outputType: 'png', // 图片格式
        info: true, // 显示图片信息
        canScale: true, // 允许缩放
        autoCrop: true, // 自动裁剪
        autoCropWidth: 200, // 裁剪框宽度
        autoCropHeight: 200, // 裁剪框高度
        fixed: true, // 固定比例
        full: false, // 完整比例裁剪
        fixedBox: false, // 固定裁剪框大小
        canMove: false, // 允许移动图片
        canMoveBox: true, // 允许移动裁剪框
        original: false, // 使用原始比例
        centerBox: false, // 中心裁剪框
        height: true, // 设备DPR适配
        infoTrue: false, // 显示真实输出尺寸
        maxImgSize: 3000, // 最大尺寸限制
        enlarge: 1 // 输出比例
      }
    };
  },
  methods: {
    imgLoad(msg) {
      console.log('初始化消息：' + msg);
    },
    changeScale(num) {
      // 缩放图片
      num = num || 1;
      this.$refs.cropper.changeScale(num);
    },
    rotateLeft() {
      // 左旋转图片
      this.$refs.cropper.rotateLeft();
    },
    rotateRight() {
      // 右旋转图片
      this.$refs.cropper.rotateRight();
    },
    realTime(data) {
      // 实时预览
      this.previews = data;
    },
    selectImg(e) {
      // 选择图片
      const file = e.target.files[0];
      if (!/\.(jpg|jpeg|png|JPG|PNG)$/.test(e.target.value)) {
        this.$message({
          message: '仅支持jpeg、jpg、png格式',
          type: 'error'
        });
        return false;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        let data;
        if (typeof e.target.result === 'object') {
          data = window.URL.createObjectURL(new Blob([e.target.result]));
        } else {
          data = e.target.result;
        }
        this.option.img = data;
      };
      reader.readAsDataURL(file);
    },
    onConfirm(type) {
      // 确认裁剪
      if (type === 'blob') {
        this.$refs.cropper.getCropBlob((blob) => {
          this.updatePhoto(blob);
        });
      }
    },
    uploadToServer() {
      // 上传到服务器
      this.$refs.cropper.getCropBlob(async (blob) => {
        try {
          const formData = new FormData();
          formData.append('image', blob);
          const response = await axios.post('/Api/ImageController/upload', formData);
          this.$message.success('图片上传成功：' + response.data.message);
        } catch (error) {
          this.$message.error('上传失败：' + error.message);
        }
      });
    },
    async updatePhoto(blob) {
      // 保存图片到本地
      try {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'image.jpg';
        link.click();
        await new Promise(resolve => setTimeout(resolve, 1000));
        this.$message.success('图片已保存到本地！');
        this.$emit('close');
      } catch (error) {
        this.$message.error('保存失败！');
      }
    }
  }
};
</script>
  <style scoped lang="less">
  .cropper-content {
    display: flex;
    flex-direction: column;
    .cropper-box {
      display: flex;
      justify-content: space-between;
      width: 100%;
      .cropper {
        width: 500px;
        height: 350px;
      }
      .show-preview {
        width: 500px;
        display: flex;
        margin-right: 100px;
        justify-content: center;
        .preview {
          overflow: hidden;
          border: 1px solid #ccc;
          background: #fff;
          box-sizing: border-box;
        }
      }
    }
    .handle-cropper {
      margin-top: 30px;
      display: flex;
      .scope-btn {
        display: flex;
        display: -webkit-flex;
        justify-content: space-between;
        padding-right: 10px;
      }
      .upload-btn {
        flex: 1;
        -webkit-flex: 1;
        display: flex;
        display: -webkit-flex;
        justify-content: center;
      }
      .btn {
        outline: none;
        display: inline-block;
        line-height: 1;
        white-space: nowrap;
        cursor: pointer;
        appearance: none;
        -webkit-appearance: none;
        text-align: center;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        outline: 0;
        -webkit-transition: 0.1s;
        transition: 0.1s;
        font-weight: 500;
        padding: 8px 15px;
        font-size: 12px;
        border-radius: 3px;
        color: #fff;
        background-color: #409eff;
        border-color: #409eff;
        margin-right: 10px;
      }
    }
  }
  </style>
  