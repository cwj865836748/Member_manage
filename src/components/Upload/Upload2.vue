<template>
  <el-upload
    class="avatar-uploader"
    action=""
    :http-request="uploadFile"
    :show-file-list="false"
    :before-upload="beforeAvatarUpload"
    :on-success="handleImageSuccess"
  >
    <div  v-if="imageUrl"  class="avatar">
      <img :src="imageUrl">
    </div>
    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
  </el-upload>
</template>

<script>
  import {Common} from '@/api'
  export default {
    name: "Upload",
    props:{
      url:{
        type:String,
        default:''
      }
    },
    data() {
      return {
        imageUrl: ''
      };
    },
    created() {
    },
    methods: {
      emitInput(val) {
        this.$emit('input', val)
      },
      handleImageSuccess() {
        this.emitInput(this.imageUrl)
      },
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg';
        const isPNG = file.type ==='image/png'
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isJPG&&!isPNG) {
          return this.$message.error('上传封面只能是 JPG或Png 格式!');
        }
        if (!isLt2M) {
          return this.$message.error('上传封面大小不能超过 2MB!');
        }
      },
      uploadFile(file) {
        const that = this
        return new Promise((resolve, reject) => {
          const formData = new FormData()
          formData.append('file', file.file)
          Common.uploadFile(formData).then((res) => {
            that.imageUrl=res.result
            resolve(true)
          }).catch(err => {
            reject(false)
          })
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    position: relative;
    background: #F4F8FB;
    img {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      max-width: 100%;
      max-height: 100%;
    }
  }
</style>
