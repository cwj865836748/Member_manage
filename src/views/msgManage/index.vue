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
      <el-table-column  align="left" fixed :label="$t('common.serial')" width="50px">
        <template slot-scope="scope">
          {{ (listQuery.pageNo - 1) * listQuery.pageSize + scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column  align="left" label="消息内容" prop="content" width="250px"/>
      <el-table-column  align="left" label="类型" prop="type">
        <template slot-scope="{row}">
          {{row.type|msgType}}
        </template>
      </el-table-column>
      <el-table-column  align="left" label="已读数量" prop="readCount">
      </el-table-column>
      <el-table-column  align="left" label="角色" prop="rolesName" />

      <el-table-column  align="left" label="区域" prop="areaName" width="250px">
      </el-table-column>
      <el-table-column  align="left" label="状态" prop="status" width="150px">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status?'success':'danger'"> {{scope.row.status|msgStatusType}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column  align="left" label="更新时间" prop="updateAt" width="200px"/>

      <el-table-column
        label="操作"
        align="left"
        width="250"
      >
        <template slot-scope="{row}">
          <el-button type="warning"  size="small" @click="handleCreateEdit('edit',row)" v-if="row.status===0">
            编辑
          </el-button>
          <el-button type="primary" size="small" @click="sendMessage(row)" v-if="row.status===0">
            发送
          </el-button>
          <el-button type="danger" size="small" @click="handleDelete(row)" >
            删除
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
    <el-dialog :title="isAdd==='create'?'添加消息':'编辑消息'" :visible.sync="addVisible" width="600px">
      <el-form :model="addForm" ref="addForm" label-width="auto" label-position="right" class="demo-ruleForm" :rules="addRules">
        <el-form-item label="消息内容:" prop="content">
          <el-input v-model="addForm.content" type="textarea" autosize placeholder="请输入消息内容"/>
        </el-form-item>
        <el-form-item label="区域:" prop="area">
          <el-cascader
            style="width: 100%"
            v-model="addForm.area"
            :options="options"
            :props="optionProps"
            ></el-cascader>
        </el-form-item>
        <el-form-item label="角色:" prop="roles">
          <el-select v-model="addForm.roles" multiple placeholder="请选择角色">
            <el-option
              v-for="item in roleType"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>        </el-form-item>
        <el-form-item label="类型:" prop="type">
          <el-select v-model="addForm.type" placeholder="请选择类型">
            <el-option
              v-for="item in msgType"
              :key="item.value"
              :label="item.label"
              :value="item.value"/>
          </el-select>
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
  import {msgStatusType,roleType,msgType} from '@/config/userManage'
  import {msgApi,houseApi} from '@/api'
  import {validateRequire} from '@/utils/validate'
  export default {
    name: "index",
    data(){
      return {
        roleType,
        msgType,
        searchFields: [
          {type: 0, label: '消息内容', value: '', options: '', field: 'content'},
          {type: 1, label: '状态', value: '', options: msgStatusType, field: 'status'},
        ],
        listLoading: false,
        options:[],
        list: null,
        listQuery: {
          pageNo: 1,
          pageSize: 10
        },
        optionProps: {
          children: 'areaList',
          label: 'name',
          value:'id',
          checkStrictly:true,
          expandTrigger: 'hover'
        },
        addRules: {
          content: [{
            required: true,
            trigger: 'blur',
            validator: validateRequire,
            text: '内容'
          }],
          type: [{
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
          area:'',
          integral:'',
          roles:'',
          type:''
        }
      }
    },
    components: {Pagination, Search},
    created() {
      this.getList()
      this.getTree()
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
          acc[cur.field] = cur.value
          return acc
        }, {...this.listQuery})

        msgApi.list(tempSearch).then(res => {
          this.list = res.result.records
          this.total = res.result.total
          this.listLoading = false
        })
      },

      // 重置
      resetForm() {
        this.addForm={
          area:'',
          content:'',
          roles:'',
          type:''
        }
      },
      // 创建或编辑 type create or edit
      async handleCreateEdit(type, row) {
        if (type == 'create') this.resetForm()
        if (type == 'edit') {
          this.addForm={
            area:row.area,
            content:row.content,
            type:row.type,
            id:row.id
          }
          this.addForm.roles=row.roles.split(',').map(parseFloat)
        }
        this.isAdd = type
        this.addVisible = true
        this.$nextTick(() => {
          this.$refs['addForm'].clearValidate()
        })
      },
      // 确定创建或编辑
      createEditData(form) {
        if (this.isAdd === 'create'){
          this.addForm.area=this.addForm.area?this.addForm.area[this.addForm.area.length-1]:''
        }else {
          this.addForm.area=Array.isArray(this.addForm.area)?this.addForm.area[this.addForm.area.length-1]:this.addForm.area
        }
        this.addForm.roles=this.addForm.roles?this.addForm.roles.join(','):''
        this.$refs[form].validate((valid) => {
          if (valid) {
            if (this.isAdd ==='create') {
              msgApi.add(this.addForm).then((res) => {
                this.getList()
                this.$message({
                  message: res.message || this.$t('common.success'),
                  type: 'success'
                })
              })
            }

            if (this.isAdd == 'edit') {
              msgApi.edit(this.addForm).then((res) => {
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
      // 删除
      handleDelete(row) {
        this.$confirm(this.$t('common.deleteTip'), this.$t('common.tip'), {
          confirmButtonText: this.$t('common.confirm'),
          cancelButtonText: this.$t('common.cancel'),
          type: 'warning'
        }).then(() => {
          msgApi.delete(row.id).then(res => {
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
      },
      //获取树
      async getTree(){
        const {code,result} = await houseApi.getAreaList()
        if (code===200){

          this.options=this.getTreeData(result)
        }
      },
      getTreeData(data){
        // 循环遍历json数据
        for(var i=0;i<data.length;i++){

          if(data[i].areaList.length<1){
            // children若为空数组，则将children设为undefined
            data[i].areaList=undefined;
          }else {
            // children若不为空数组，则继续 递归调用 本方法
            this.getTreeData(data[i].areaList);
          }
        }
        return data;
      },

       sendMessage(row){
        this.$confirm('是否发送该条消息', {
          confirmButtonText: this.$t('common.confirm'),
          cancelButtonText: this.$t('common.cancel'),
          type: 'warning'
        }).then(async() => {
          const {code} =await msgApi.sendMessage({id:row.id})
          if (code===200){
            this.$message.success('发送成功')
            this.getList()
          }
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
