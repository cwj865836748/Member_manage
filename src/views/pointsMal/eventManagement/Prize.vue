<template>
  <div class="app-container">
    <div class="app-content">
      <div class="prizeList">
        <el-row :gutter="140">
          <el-col :span="3" :lg="3" :md="5" :sm="5" :xs="6" >
            <div class="leftImg">
              <img :src="activeDetail.cover?activeDetail.cover:$defaultImg" />
            </div>

          </el-col>
          <el-col :span="17" :lg="17" :md="14" :sm="14" :xs="13">
            <div class="flex">
              <div class="activeName">{{activeDetail.name}}</div>

              <div class="activeStatus ">
                <el-tag :type="activeDetail.status===1?'danger':(activeDetail.status===2?'success':(activeDetail.status===3?'':'info'))"> {{activeDetail.status|activeType}}</el-tag>

              </div>
            </div>
            <div class="formSize" style="margin-bottom: 20px;">
              活动时间：{{activeDetail.startTime}}~{{activeDetail.endTime}}
            </div>
            <div class="formSize" style="   margin-bottom: 20px;">
              活动介绍：{{activeDetail.introduce}}
            </div>
          </el-col>
          <el-col :span="4">
            <el-button @click="$router.go(-1)">返回上一级</el-button>
          </el-col>
        </el-row>
      </div>
      <div class="myPrize">
        <search ref="search" :fields="searchFields" @change="handleSearch"/>
        <div class="filter-container">
          <UploadXls  @downMo="downMo" @uploadFile="uploadFile"/>

        </div>
        <div class="flex-wrap">
          <div style="margin-bottom: 10px;margin-right: 30px;">
             <div class="prizeDetail" @click="handleCreateEdit('create')">
               <div class="text">+添加奖品</div>
             </div>
          </div>
          <div v-for="(item,index) in list" :key="index" style="margin-bottom: 10px;margin-right: 30px;">
            <div class="prizeDetail" @click="handleCreateEdit('edit',item)">
               <div class="prizeDetail-head">
                 <img :src="item.cover?item.cover:$defaultImg">
                 <div :class="['title',item.status?'greenSize':'redSize']">{{item.status|shelfType}}</div>
               </div>
               <div class="prizeDetail-content">
                 <div class="prizeDetail-content-size">
                   {{item.name}}
                 </div>
                 <div class="prizeDetail-content-count">
                    <div class="prizeDetail-content-count-sz ">
                      <div class="font">总数 {{item.count}}</div>
                      <div class="font">已兑 {{item.redeemedCount}}</div>
                      <div class="font">积分 {{item.integral}}</div>
                    </div>
                 </div>
               </div>
            </div>
          </div>

        </div>
      </div>
    </div>
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.pageNo"
      :limit.sync="listQuery.pageSize"
      @pagination="getList"
    />
    <el-dialog :title="isAdd==='create'?'添加奖品':'修改奖品'" :visible.sync="addVisible" width="1000px">
      <el-form :model="addForm" ref="addForm" label-width="auto" label-position="right" class="demo-ruleForm" :rules="addRules">
        <el-form-item label="奖品名称:" prop="name">
          <el-input v-model="addForm.name" placeholder="请输入奖品名称"/>
        </el-form-item>
        <el-form-item label="兑换说明:" prop="remarks">
          <el-input  v-model="addForm.remarks" autosize type="textarea" placeholder="请输入兑换说明"/>
        </el-form-item>
        <el-form-item label="奖品数量:" prop="count">
          <el-input-number v-model="addForm.count" controls-position="right" :min="1" size="mini"></el-input-number>
        </el-form-item>
        <el-form-item label="兑奖数量限制:" prop="limitNum">
          <el-input-number v-model="addForm.limitNum" controls-position="right" :min="1" size="mini"></el-input-number>
        </el-form-item>
        <el-form-item label="积分值:" prop="integral">
          <el-input-number v-model="addForm.integral" controls-position="right" :min="0" size="mini"></el-input-number>
        </el-form-item>
        <el-form-item label="状态:" prop="status">
        <el-select v-model="addForm.status" placeholder="请选择状态">
          <el-option
            v-for="item in shelfType"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        </el-form-item>
        <el-form-item label="上传图片:" prop="cover">
          <Upload @input="myUpload" :url="this.addForm.cover" ref="Upload"/>
        </el-form-item>
        <el-form-item class="flex-x-end">
          <el-button size="small" @click="addVisible=false">取消</el-button>
          <el-button size="small" type="primary" @click="createEditData('addForm')">确定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

  </div>
</template>

<script>
  import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
  import Search from '@/components/Search'
  import {shelfType} from '@/config/userManage'
  import {recordApi} from '@/api'
  import {validateRequire} from '@/utils/validate'
  import Upload from '@/components/Upload/Upload2'
  import UploadXls from "@/components/Upload/UploadXls";
  import fileDownload from "js-file-download"
    export default {
        name: "Prize",
      data(){
          return{
            shelfType,
            searchFields: [
              {type: 0, label: '奖品名称', value: '', options: '', field: 'name'},
              {type: 1, label: '状态', value: '', options: shelfType, field: 'status'},
            ],
            list: null,
            listQuery: {
              pageNo: 1,
              pageSize: 10
            },
            addRules: {
              name: [{
                required: true,
                trigger: 'blur',
                validator: validateRequire,
                text: '奖品名称'
              }],
              limitNum: [{
                required: true,
                trigger: 'blur',
                validator: validateRequire,
                text: '兑奖数量限制'
              }],
              integral: [{
                required: true,
                trigger: 'blur',
                validator: validateRequire,
                text: '积分值'
              }]
            },
            total: 0,
            addVisible:false,
            isAdd:'create',
            addForm:{
              count:1,
              integral:0,
              name:'',
              cover:'',
              limitNum:1,
              remarks:'',
              status:''
            },
            activityId:this.$route.query.id,
            activeDetail:{
              cover:'',
              name:'',
              status:'',
              startTime:'',
              endTime:'',
              introduce:''
            }
          }
      },
      components: {Pagination, Search,Upload,UploadXls},
      watch: {
        '$route': function (to, from) {
          if(from.name==='eventManagement'){
            this.getList()
            this.getActivity()
          }
        }
      },
      created() {
        this.getList()
        this.getActivity()
      },
      methods: {
        handleSearch() {
          this.listQuery.pageNo = 1
          this.getList()
        },
        getActivity(){
          recordApi.queryById({id:this.activityId}).then(res => {
            this.activeDetail=res.result
          })
        },
        // 获取数据
        getList() {
          const tempSearch = this.searchFields.reduce((acc, cur) => {
              acc[cur.field] = cur.value
            return acc
          }, {...this.listQuery})

          recordApi.queryActPrizeList({...tempSearch,id:this.activityId}).then(res => {
            this.list = res.result.records
            this.total = res.result.total
          })
        },

        // 重置
        resetForm() {
          this.addForm={
            count:1,
            id:'',
            integral:0,
            name:'',
            cover:'',
            limitNum:1,
            remarks:'',
            status:0
          }
        },
        myUpload(val){
          this.addForm.cover=val
        },
        // 创建或编辑 type create or edit
        handleCreateEdit(type, row) {
          this.addVisible = true
          this.$nextTick(async ()=>{
            if (type == 'create') {
              this.resetForm()
              this.$refs.Upload.imageUrl=''
            }

            if (type == 'edit') {
              const {result} = await recordApi.findPrize({id:row.id})
              this.addForm=result
              delete this.addForm.createdAt
              delete this.addForm.activity
              delete this.addForm.updatedAt
              this.$refs.Upload.imageUrl=result.cover
            }
            this.isAdd = type

            this.$nextTick(() => {
              this.$refs['addForm'].clearValidate()
            })
          })

        },
        // 确定创建或编辑
        createEditData(form) {
          if (this.isAdd==='create'){
            this.addForm.id=this.activityId
          }
          this.$refs[form].validate((valid) => {
            if (valid) {
              if (this.isAdd ==='create') {
                recordApi.addPrice(this.addForm).then((res) => {
                  this.getList()
                  this.$message({
                    message: res.message || this.$t('common.success'),
                    type: 'success'
                  })
                })
              }

              if (this.isAdd == 'edit') {
                recordApi.editPrize(this.addForm).then((res) => {
                  this.getList()
                  this.$message({
                    message: res.message || this.$t('common.success'),
                    type: 'success'
                  })
                })
              }
              this.addVisible=false
            }
          })

        },
        uploadFile(file){
          return new Promise((resolve, reject) => {
            const formData = new FormData()
            formData.append('file', file.file)
            formData.append('id', this.activityId)
            recordApi.importExcel(formData).then((res) => {
              let buf = new Buffer(res).toString();
              //判断大小 小于80即有错误码，判断
              if (buf.length <= 80) {
                this.$message({
                  message: '导入成功',
                  type: 'success'
                })
                this.getList()
              }else {
                fileDownload(res, `模板导入失败.xls`);
                this.$message({
                  message: '导入失败',
                  type: 'error'
                })
              }
              resolve(true)
            }).catch(err => {
              reject(false)
            })
          })
        },
        async downMo(){
          const data = await recordApi.exportTemplate()
          fileDownload(data, `活动奖品导入模板.xls`);
        },
      }
    }
</script>

<style lang="scss" scoped>
.app-content {
  padding: 10px 30px;
  background: #ffffff;
}
  .prizeList {
    padding: 10px;
    border-bottom: 1px #E8E8E8 solid;
    margin-bottom: 20px;
  }
  .flex {
    display: flex;
    margin-bottom: 20px;
    .activeName {
      font-size: 20px;
      color: #606266;
      box-sizing: border-box;
      padding-top: 5px;
    }
    .activeStatus {

      margin-left: 30px;

    }
  }
  .prizeDetail {
     width: 265px;
     height: 265px;
     border: 1px solid #E8E8E8 ;
     position: relative;
     .text {
       font-size: 16px;
       position: absolute;
       top: 50%;
       left: 50%;
       transform: translate(-50%,-50%);
       cursor: pointer;
     }
     &-head{
       height: 66%;
       position: relative;
       background: #F4F8FB;
       img {
         max-height: 100%;
         max-width: 100%;
         position: absolute;
         left: 50%;
         top: 50%;
         transform: translate(-50%,-50%);
       }
       .title {
         position: absolute;
         right: 10px;
         top: 5px;
         text-align: center;
         height: 20px;
         line-height: 20px;
         border-radius: 4px;
         background-color: #fff;
         font-size: 14px;
         width: 50px;
         &.redSize {
           color: #F56C6C;
           border: 1px solid #FDE2E2;
           background: #FEF0F0;

         }
         &.greenSize {
           color: #13CE66;
           border: 1px solid #D0F5E0;
           background: #E7FAF0;
         }
       }
     }
     &-content{
       height: 33%;
       padding: 0 10px ;
       box-sizing: content-box;
       &-size {
         font-size: 16px;
         color: #606266;
         padding: 10px 0 0 10px;
         box-sizing: border-box;
         text-overflow: -o-ellipsis-lastline;
         overflow: hidden;
         text-overflow: ellipsis;
         display: -webkit-box;
         -webkit-line-clamp: 2;
         line-clamp: 2;
         -webkit-box-orient: vertical;
         height: 46px;

       }
       &-count {
         padding-top: 15px;
         &-sz {
           font-size: 14px;
           display: flex;
           color: #606266;
           .font {
             padding-left: 12px;
           }
         }
       }
     }
   }
  .prizeDetail:hover {
    border: 1px solid #61AFFE ;
  }
  .leftImg {
    height: 150px;
    width: 150px;
    position: relative;
    background: #F4F8FB;
    img {
      max-height: 100%;
      max-width: 100%;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%,-50%);
    }
  }
.formSize {
  margin-bottom: 10px;
  font-size: 14px;
  color: #606266;

}
</style>
