<template>
<div class="detail-contain">
  <div class="landlord" v-if="identity==='landlord'">
    <div class="detail_top">
      <div class="head flex-x-between flex-y-center">
        <div>业主信息（东山北门里86号）</div>
        <div style="display: flex">
           <UploadSFZ @input="getSFZ()":type="1"/>
          <el-button size="small" @click="cleanObj(1)">清空</el-button>
        </div>
      </div>
      <el-form :model="addForm" label-position="top"  ref="addForm" class="demo-ruleForm" style="padding: 0 20px">
        <el-row :gutter="80">
          <el-col :span="8">
              <el-form-item label="上传正面照:" prop="photoPath">
                <Upload @input="myUpload" :url="this.addForm.photoPath" ref="Upload"/>
              </el-form-item>
              <el-form-item label="性别:" prop="sex">
                <el-select v-model="addForm.sex" placeholder="请选择性别" style="width: 100%" disabled>
                  <el-option label="男" :value="1"></el-option>
                  <el-option label="女" :value="2"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="户籍:" prop="census">
                <el-input v-model="addForm.census" placeholder="请输入户籍" style="width: 100%" disabled/>
              </el-form-item>
          </el-col>
          <el-col :span="8">

              <el-form-item label="姓名:" prop="name">
                <el-input v-model="addForm.name" placeholder="请输入姓名" style="width: 100%" disabled/>
              </el-form-item>
              <el-form-item label="证件类型：" prop="certificateType">
                <el-select v-model="addForm.certificateType" placeholder="请选择证件类型" style="width: 100%" disabled>
                  <el-option label="身份证" :value="1"></el-option>
                  <el-option label="护照" :value="2"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="民族：" prop="nation">
                <el-input v-model="addForm.nation" placeholder="请输入民族" style="width: 100%" disabled/>
              </el-form-item>

          </el-col>
          <el-col :span="8">

              <el-form-item label="手机号:" prop="phone">
                <el-input v-model="addForm.phone" placeholder="请输入手机号" style="width: 100%"/>
              </el-form-item>

              <el-form-item label="证件号码：" prop="cardNo">
                <el-input v-model="addForm.cardNo" placeholder="请输入证件号码" style="width: 100%" disabled/>
              </el-form-item>

              <el-form-item label="出生日期：" prop="birthday">
                <el-date-picker
                  disabled
                  v-model="addForm.birthday"
                  type="date"
                  value-format="yyyy-MM-dd"
                  placeholder="选择日期">
                </el-date-picker>
              </el-form-item>

          </el-col>
        </el-row>
      </el-form>
    </div>

  </div>
  <div class="owner" v-else>
    <div class="detail_top">
      <div class="head flex-x-between flex-y-center">
        <div>户主信息（101号）</div>
        <div>
          <el-button type="primary">扫描身份证</el-button>
          <el-button >清空</el-button>
        </div>
      </div>
      <el-form :model="addForm" label-position="top"  ref="addForm" class="demo-ruleForm" style="padding: 0 20px">
        <el-row :gutter="80">
          <el-col :span="8">
            <el-form-item label="上传正面照:" prop="region">
              <el-upload
                class="avatar-uploader"
                action="https://jsonplaceholder.typicode.com/posts/"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload">
                <img v-if="imageUrl" :src="imageUrl" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-form-item>
            <el-form-item label="性别:" prop="region">
              <el-select v-model="addForm.sex" placeholder="请选择性别" style="width: 100%">
                <el-option label="男" value="shanghai"></el-option>
                <el-option label="女" value="beijing"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="户籍:" prop="region">
              <el-input v-model="addForm.hj" placeholder="请输入户籍" style="width: 100%"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">

            <el-form-item label="姓名:" prop="region">
              <el-input v-model="addForm.name" placeholder="请输入姓名" style="width: 100%"/>
            </el-form-item>
            <el-form-item label="证件类型：" prop="region">
              <el-select v-model="addForm.sex" placeholder="请选择证件类型" style="width: 100%">
                <el-option label="身份证" value="shanghai"></el-option>
                <el-option label="护照" value="beijing"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="民族：" prop="region">
              <el-input v-model="addForm.nation" placeholder="请输入民族" style="width: 100%"/>
            </el-form-item>

          </el-col>
          <el-col :span="8">

            <el-form-item label="手机号:" prop="region">
              <el-input v-model="addForm.phone" placeholder="请输入手机号" style="width: 100%"/>
            </el-form-item>

            <el-form-item label="证件号码：" prop="region">
              <el-input v-model="addForm.id" placeholder="请输入证件号码" style="width: 100%"/>
            </el-form-item>

            <el-form-item label="出生：" prop="region">
              <el-select v-model="addForm.cs" placeholder="请选择出生" style="width: 100%">
                <el-option label="身份证" value="shanghai"></el-option>
                <el-option label="护照" value="beijing"></el-option>
              </el-select>
            </el-form-item>

          </el-col>
        </el-row>
      </el-form>
    </div>
     <!--租户信息-->
    <div class="detail_top">
      <div class="head flex-x-between flex-y-center">
        <div>租户</div>
        <div>
          <el-button type="primary">扫描身份证</el-button>
          <el-button >删除</el-button>
        </div>
      </div>
      <el-form :model="addForm" label-position="top"  ref="addForm" class="demo-ruleForm" style="padding: 0 20px">
        <el-row :gutter="80">
          <el-col :span="8">
            <el-form-item label="上传正面照:" prop="region">
              <el-upload
                class="avatar-uploader"
                action="https://jsonplaceholder.typicode.com/posts/"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload">
                <img v-if="imageUrl" :src="imageUrl" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-form-item>
            <el-form-item label="性别:" prop="region">
              <el-select v-model="addForm.sex" placeholder="请选择性别" style="width: 100%">
                <el-option label="男" value="shanghai"></el-option>
                <el-option label="女" value="beijing"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="户籍:" prop="region">
              <el-input v-model="addForm.hj" placeholder="请输入户籍" style="width: 100%"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">

            <el-form-item label="姓名:" prop="region">
              <el-input v-model="addForm.name" placeholder="请输入姓名" style="width: 100%"/>
            </el-form-item>
            <el-form-item label="证件类型：" prop="region">
              <el-select v-model="addForm.sex" placeholder="请选择证件类型" style="width: 100%">
                <el-option label="身份证" value="shanghai"></el-option>
                <el-option label="护照" value="beijing"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="民族：" prop="region">
              <el-input v-model="addForm.nation" placeholder="请输入民族" style="width: 100%"/>
            </el-form-item>

          </el-col>
          <el-col :span="8">

            <el-form-item label="手机号:" prop="region">
              <el-input v-model="addForm.phone" placeholder="请输入手机号" style="width: 100%"/>
            </el-form-item>

            <el-form-item label="证件号码：" prop="region">
              <el-input v-model="addForm.id" placeholder="请输入证件号码" style="width: 100%"/>
            </el-form-item>

            <el-form-item label="出生：" prop="region">
              <el-select v-model="addForm.cs" placeholder="请选择出生" style="width: 100%">
                <el-option label="身份证" value="shanghai"></el-option>
                <el-option label="护照" value="beijing"></el-option>
              </el-select>
            </el-form-item>

          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class=" detail_top flex-xy-center" style="height: 30px">
      +新增成员
    </div>
  </div>
  <div class="flex-x-bottom">
     <el-button style="margin-right: 10px" @click="$router.push('/houseManage/detail')">取消</el-button>
    <el-button type="primary" @click="handleSubmit">提交</el-button>
  </div>

</div>
</template>

<script>
  import {houseListApi} from '@/api'
  import Upload from '@/components/Upload/Upload'
  import UploadSFZ from '@/components/Upload/UploadSFZ'
  export default {
        name: "detailMsg",
      data(){
        return{
          addForm:{},
          addForm2:{},
          addForm3:{},
          identity:this.$route.query.identity,
          systemId:sessionStorage.getItem("systemId"),
          houseId:sessionStorage.getItem("houseId")
        }
      },
    components:{
      Upload,UploadSFZ
    },
      watch: {
        '$route': function (to, from) {
          if(from.name==='detail'){
            this.identity=this.$route.query.identity
            this.systemId=sessionStorage.getItem("systemId")
          }
        }
      },
      created() {
          this.getList()
      },
      methods: {
          async getList(){
             if (this.identity==='landlord'){
               const {result}=await houseListApi.getLandlordDetailList({floorId:this.houseId})
             }
          },
        myUpload(val){
          this.addForm.photoPath=val
        },
        cleanObj(num){
            if (num===1){
              this.addForm={}
            }
        },
        getSFZ(val){
          // this.addForm={
          //   birthday: val.birthday,
          //   cardNo: val.cardNo,
          //   census: val.census,
          //   certificateType: val.certificateType,
          //   name: val.name,
          //   nation: val.nation,
          //   phone: val.phone,
          //   photoPath: val.photo,
          //   sex: val.sex,
          //   type
          // }
          this.addForm=val
        },
        async handleSubmit(){
            const landlords=[this.addForm]
            const {code} = await houseListApi.addLandlordInfo({landlords,systemId:''})
          if (code===200){
            this.$message.success('提交成功')
          }
        },
        deleteId(){
          this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            });
          });
        }
      }
    }
</script>

<style lang="scss" scoped>
.detail-contain {
  padding: 10px 70px;
  .detail_top{
    background: #fff;
    margin-bottom: 30px;
    .head {
      height: 70px;
      padding: 0px 30px;
      border-bottom: 1px solid #E9E9E9;
      font-size: 20px;
      font-weight: 600;
    }
  }
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
  width: 120px;
  height: 120px;
  line-height: 120px;
  text-align: center;
}
.avatar {
  width: 120px;
  height: 120px;
  display: block;
}
</style>
