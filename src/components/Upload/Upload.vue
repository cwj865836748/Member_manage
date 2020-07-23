<template>
  <el-upload
    class="avatar-uploader"
    action=""
    :http-request="uploadFile"
    :show-file-list="false"
    :before-upload="beforeAvatarUpload"
    :on-success="handleImageSuccess"
  >
    <img v-if="imageUrl" :src="imageUrl" class="avatar">
    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
  </el-upload>
</template>

<script>
  import Upload from '@/components/Upload/Upload'
  import {recordApi} from '@/api'
  import {validateRequire} from '@/utils/validate'
  import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
  import Search from '@/components/Search'
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
    display: block;
  }
</style>
