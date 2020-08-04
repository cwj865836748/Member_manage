<template>
  <el-row :gutter="40">

  <el-upload
    class="avatar-uploader"
    action=""
    :http-request="uploadFile"
    :show-file-list="false"
    :before-upload="beforeAvatarUpload"
    :on-success="handleImageSuccess"
  >
    <div  v-if="url"  class="avatar">
      <img :src="url">
    </div>

    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
  </el-upload>


<!--    <el-dialog title="图片" :visible.sync="addVisible" width="500px">-->
<!--      <img :src="url" class="avatar" @click="showPic" style="width: 100%;height: 100%">-->
<!--    </el-dialog>-->
  </el-row>
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
        },
        type:{
          type:Number,
          default:0
        }
      },
      data() {
        return {
          imageUrl: '',
          addVisible:false
        };
      },
      created() {
      },
      methods: {
        showPic(){
          this.addVisible=true
        },
        emitInput(val) {
          this.$emit('input', val,this.type)
        },
        handleImageSuccess() {
          this.emitInput(this.imageUrl)
        },
        beforeAvatarUpload(file) {
          const isJPG = file.type === 'image/jpeg';
          const isPNG = file.type ==='image/png'
          // const isLt2M = file.size / 1024 / 1024 < 2;

          if (!isJPG&&!isPNG) {
            return this.$message.error('上传封面只能是 JPG或Png 格式!');
          }
          // if (!isLt2M) {
          //   return this.$message.error('上传封面大小不能超过 2MB!');
          // }
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
  .avatar-uploader {

  }
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
    width: 242px;
    height: 242px;
    line-height: 242px;
    text-align: center;
  }
  .avatar {
    width: 242px;
    height: 242px;
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
