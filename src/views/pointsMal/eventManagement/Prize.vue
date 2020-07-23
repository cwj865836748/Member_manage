<template>
  <div class="app-container">
    <div class="app-content">
      <div class="prizeList">
        <el-row :gutter="20" >
          <el-col :span="4">
            <img :src="activeDetail.cover" style="width: 100%;height: 100%"/>
          </el-col>
          <el-col :span="16">
            <div class="flex">
              <div class="activeName">{{activeDetail.name}}</div>
              <div class="activeStatus">{{activeDetail.status|activeType}}</div>
            </div>
            <div style="   margin-bottom: 20px;">
              活动时间：{{activeDetail.startTime}}~{{activeDetail.endTime}}
            </div>
            <div style="   margin-bottom: 20px;">
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
          <el-button
            class="filter-item"
            type="primary"
            icon="el-icon-plus"
            size="small"
          >
            导入
          </el-button>
          <el-button
            class="filter-item"
            icon="el-icon-plus"
            size="small"
          >
            导入模板下载
          </el-button>
        </div>
        <el-row :gutter="40">
          <el-col :span="6">
             <div class="prizeDetail" @click="handleCreateEdit('create')">
               <div class="text">+添加奖品</div>
             </div>
          </el-col>
          <el-col :span="6" v-for="(item,index) in list" :key="index">
            <div class="prizeDetail" @click="handleCreateEdit('edit',item)">
               <div class="prizeDetail-head">
                 <img :src="item.cover?item.cover:''">
                 <div class="title">{{item.status|shelfType}}</div>
               </div>
               <div class="prizeDetail-content">
                 <div class="prizeDetail-content-size">
                   {{item.name}}
                 </div>
                 <div class="prizeDetail-content-count">
                    <div class="prizeDetail-content-count-sz">
                      <div class="font">总数</div>
                      <div class="font">{{item.count}}</div>
                    </div>
                   <div class="prizeDetail-content-count-sz">
                     <div class="font">已兑</div>
                     <div class="font">{{item.redeemedCount}}</div>
                   </div>
                   <div class="prizeDetail-content-count-sz">
                     <div class="font">积分</div>
                     <div class="font">{{item.integral}}</div>
                   </div>
                 </div>
               </div>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
    <el-dialog :title="isAdd==='create'?'添加奖品':'修改奖品'" :visible.sync="addVisible" width="1000px">
      <el-form :model="addForm" ref="addForm" label-width="100px" class="demo-ruleForm" :rules="addRules">
        <el-form-item label="奖品名称:" prop="name">
          <el-input v-model="addForm.name" placeholder="请输入奖品名称"/>
        </el-form-item>
        <el-form-item label="兑换说明:" prop="remarks">
          <el-input  v-model="addForm.remarks" type="textarea" placeholder="请输入兑换说明"/>
        </el-form-item>
        <el-form-item label="奖品数量:" prop="count">
          <el-input-number v-model="addForm.count" controls-position="right" :min="0" size="mini"></el-input-number>
        </el-form-item>
        <el-form-item label="兑奖数量限制:" prop="limitNum">
          <el-input-number v-model="addForm.limitNum" controls-position="right" :min="0" size="mini"></el-input-number>
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
        <el-form-item>
          <el-button type="primary" @click="createEditData('addForm')">确定</el-button>
          <el-button type="primary" @click="addVisible=false">取消</el-button>
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
  import Upload from '@/components/Upload/Upload'
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
              count:0,
              integral:0,
              name:'',
              cover:'',
              limitNum:0,
              remarks:'',
              status:''
            },
            activityId:this.$route.query.id,
            activeDetail:null
          }
      },
      components: {Pagination, Search,Upload},
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
            count:0,
            id:'',
            integral:0,
            name:'',
            cover:'',
            limitNum:0,
            remarks:'',
            status:''
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

        }
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
    border-bottom: 1px slategrey solid;
    margin-bottom: 20px;
  }
  .flex {
    display: flex;
    margin-bottom: 20px;
    .activeName {
      font-size: 20px;
      font-weight: bold;
    }
    .activeStatus {
      border: 2px solid #FFA39E;
      background: #FEF0EF;
      color: #F5222D;
      margin-left: 30px;
      border-radius: 3px;
    }
  }
  .prizeDetail {
    width: 100%;
    height: 300px;
    border: 1px solid #E8E8E8 ;
    position: relative;
    .text {
      font-size: 20px;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%,-50%);
    }
    &-head{
      height: 50%;
      position: relative;
      img {
        width: 100%;
        height: 100%;
      }
      .title {
        position: absolute;
        right: 10px;
        top: 5px;
        text-align: center;
        height: 20px;
        line-height: 20px;
        border-radius: 5px;
        background-color: #fff;
      }
    }
    &-content{
      height: 50%;
      padding: 10px 10px 0 10px;
      box-sizing: content-box;
      &-size {
        font-size: 20px;
        font-weight: bold;
        height:60px;
        padding: 10px 0 0 30px;
        box-sizing: border-box;
      }
      &-count {
        display: flex;
        &-sz {
          width: 33%;
          padding-right: 10px;
          border-right: 1px slategrey solid;
          display: flex;
          flex-direction: column;
          align-items: center;
          height: 60px;
          justify-items: center;
          font-size: 20px;
          padding-top: 10px;
        }
        &-sz:last-child {
          border-right:none;
        }
      }
    }
  }

</style>
