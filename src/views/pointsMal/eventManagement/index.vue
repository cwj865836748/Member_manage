<template>
  <div class="app-container">
    <search ref="search" :fields="searchFields" @change="handleSearch"/>
    <div class="filter-container">
      <el-button
        class="filter-item"
        type="primary"
        icon="el-icon-plus"
        @click="handleCreateEdit('create')"
        size="small"
      >
        添加
      </el-button>
    </div>
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row stripe style="width: 100%">
      <el-table-column  align="center" fixed :label="$t('common.serial')" width="50px">
        <template slot-scope="scope">
          {{ (listQuery.pageNo - 1) * listQuery.pageSize + scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column  align="center" label="活动名称" prop="name"/>
      <el-table-column  align="center" label="活动时间" prop="startTime" width="300px">
        <template slot-scope="{row}">
          {{row.startTime}}~{{row.endTime}}
        </template>
      </el-table-column>
      <el-table-column  align="center" label="奖品数量" prop="prizeCount"/>

      <el-table-column  align="center" label="已兑数量" prop="exchangeCount"/>
      <el-table-column  align="center" label="状态" prop="status" width="150px">
        <template slot-scope="{row}">
          <el-tag :type="row.status===1?'danger':(row.status===2?'success':(row.status===3?'':'info'))"> {{row.status|activeType}}</el-tag>
        </template>
      </el-table-column>


      <el-table-column  align="center" label="更新时间" prop="updatedAt" width="200px"/>

      <el-table-column
        label="操作"
        align="center"
        width="300px"
      >
        <template slot-scope="{row}">
          <el-button type="warning"  size="small" @click="handleCreateEdit('edit',row)" v-if="row.status===1">
            编辑
          </el-button>
          <el-button type="primary" size="small" @click="handleView(row)">
            查看
          </el-button>
          <el-button type="success" size="small" @click="sendMsg(row)" v-if="row.status===1">
            发布
          </el-button>
          <el-button type="danger" size="small" @click="handleOver(row)" v-if="row.status===3">
            结束
          </el-button>
          <el-button type="danger" size="small" @click="handleDelete(row)" v-if="row.status===1||row.status===2">
            删除
          </el-button>
          <el-button type="info" size="small" @click="handleOut(row)" v-if="row.status===2">
            撤回
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.pageNo"
      :limit.sync="listQuery.pageSize"
      @pagination="getList"
    />
    <el-dialog :title="isAdd==='create'?'添加活动':'编辑活动'" :visible.sync="addVisible" width="1000px">
      <el-form :model="addForm" ref="addForm" label-width="auto" label-position="right"  class="demo-ruleForm" :rules="addRules">
        <el-form-item label="活动名称:" prop="name">
          <el-input v-model="addForm.name" placeholder="请输入活动名称"/>
        </el-form-item>
        <el-form-item label="活动时间:" prop="time">
          <el-date-picker
            v-model="addForm.time"
            type="datetimerange"
            value-format="yyyy-MM-dd HH:mm:ss"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :default-time="['00:00:00', '23:59:59']"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="活动介绍:" prop="introduce">
          <el-input  v-model="addForm.introduce" autosize type="textarea" placeholder="请输入活动介绍"/>
        </el-form-item>
        <el-form-item label="上传封面:" prop="type">
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
  import {activeType} from '@/config/userManage'
  import {recordApi} from '@/api'
  import {validateRequire} from '@/utils/validate'
  import Upload from '@/components/Upload/Upload2'
  export default {
    name: "index",
    data(){
      return {
        activeType,
        searchFields: [
          {type: 0, label: '活动名称', value: '', options: '', field: 'content'},
          {type: 8, label:'活动时间', value: '', options: '', field: 'time'},
          {type: 1, label: '状态', value: '', options: activeType, field: 'status'},
        ],
        listLoading: false,
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
            text: '活动名称'
          }],
          startTime: [{
            required: true,
            trigger: 'blur',
            validator: validateRequire,
            text: '类型'
          }]
        },
        total: 0,
        addVisible:false,
        isAdd:'create',
        addForm:{
          cover:'',
          endTime:'',
          introduce:'',
          name:'',
          startTime:'',
          time:[]
        }
      }
    },
    components: {Pagination, Search,Upload},
    created() {
      this.getList()
    },
    methods: {
      handleSearch() {
        this.listQuery.pageNo = 1
        this.getList()
      },
      // 获取数据
      getList() {
        this.listLoading = true
        const tempSearch = this.searchFields.reduce((acc, cur) => {
          if(cur.field==='time'){
            acc['startTime'] = cur.value.length?cur.value[0]:''
            acc['endTime'] = cur.value.length>1?cur.value[1]:''
          }else {
            acc[cur.field] = cur.value
          }
          return acc
        }, {...this.listQuery})

        recordApi.activityList(tempSearch).then(res => {
          this.list = res.result.records
          this.total = res.result.total
          this.listLoading = false
        })
      },

      // 重置
      resetForm() {
        this.addForm={
          cover:'',
          endTime:'',
          introduce:'',
          name:'',
          startTime:'',
          time:[]
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
            const {result} = await recordApi.queryById({id:row.id})
            this.addForm={
              cover:result.cover,
              introduce:result.introduce,
              name:result.name,
              time:[result.startTime,result.endTime],
              id:result.id
            }
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
        this.addForm.startTime =  this.addForm.time.length?this.addForm.time[0]:''
        this.addForm.endTime = this.addForm.time.length>1?this.addForm.time[1]:''
        delete this.addForm.time
        this.$refs[form].validate((valid) => {
          if (valid) {
            if (this.isAdd ==='create') {
              recordApi.add(this.addForm).then((res) => {
                this.getList()
                this.$message({
                  message: res.message || this.$t('common.success'),
                  type: 'success'
                })
              })
            }

            if (this.isAdd == 'edit') {
              recordApi.edit(this.addForm).then((res) => {
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
      //查看
      handleView(row){
         this.$router.push({
           path:'/pointsMal/Prize',
           query:{
             id:row.id
           }
         })
      },
      //发布
      sendMsg(row){
        this.$confirm('确定发布该活动？', {
          confirmButtonText: this.$t('common.confirm'),
          cancelButtonText: this.$t('common.cancel'),
          type: 'warning'
        }).then(() => {
          recordApi.release({id:row.id}).then(res=>{
            if(res.code===200){
              this.getList()
              this.$message({
                message: res.msg || this.$t('common.success'),
                type: 'success'
              })
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: this.$t('common.isCancel')
          })
        })
      },
      //结束
      handleOver(){

      },
      //撤回
      handleOut(row){
        this.$confirm('确定撤回该活动？', {
          confirmButtonText: this.$t('common.confirm'),
          cancelButtonText: this.$t('common.cancel'),
          type: 'warning'
        }).then(() => {
          console.log(1)
          recordApi.withdraw({id:row.id}).then(res=>{
            if(res.code===200){
              this.getList()
              this.$message({
                message: res.msg || this.$t('common.success'),
                type: 'success'
              })
            }
          })
        }).catch(err => {
          console.log(err)
          this.$message({
            type: 'info',
            message: this.$t('common.isCancel')
          })
        })
      },
      // 删除
      handleDelete(row) {
        this.$confirm(this.$t('common.deleteTip'), this.$t('common.tip'), {
          confirmButtonText: this.$t('common.confirm'),
          cancelButtonText: this.$t('common.cancel'),
          type: 'warning'
        }).then(() => {
          recordApi.delete({id:row.id}).then(res => {
            const flag = --this.total % this.listQuery.pageSize
            if (!flag && this.total) this.listQuery.pageNo--
            this.getList()
            this.$message({
              message: res.msg || this.$t('common.success'),
              type: 'success'
            })
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: this.$t('common.isCancel')
          })
        })
      }
    }
  }
</script>

<style scoped>

</style>
