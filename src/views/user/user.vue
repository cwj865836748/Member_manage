<template>
  <div class="app-container">
    <search ref="search" :fields="searchFields" @change="handleSearch" @getArea="getArea" :firstDisable="true"/>
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
      <el-table-column  align="center" label="账号" prop="username"/>
      <el-table-column  align="center" label="姓名" prop="name"/>
      <el-table-column  align="center" label="手机号" prop="phone"/>
      <el-table-column  align="center" label="角色" prop="roleName"/>
      <el-table-column  align="center" label="区域权限" prop="areaName">
      </el-table-column>
      <el-table-column  align="center" label="状态" prop="isEnabled" width="100px">
        <template slot-scope="scope">
          <el-tag :type="scope.row.isEnabled?'success':'danger'"> {{scope.row.isEnabled|isEnabled}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column  align="center" label="更新时间" prop="updatedAt" width="200px">
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        min-width="200px"
      >
        <template slot-scope="{row}">
          <el-button type="warning"  size="small" @click="handleCreateEdit('edit',row)">
            编辑
          </el-button>
          <el-button type="primary" size="small" @click="resetPassword(row)">
            重置密码
          </el-button>
          <el-button type="danger" size="small" @click="handleDelete(row)">
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
    <el-dialog :title="isAdd==='create'?'添加用户':'编辑用户'" :visible.sync="addVisible" width="500px">
      <el-form :model="addForm" ref="addForm" label-width="100px" class="demo-ruleForm" :rules="addRules">
        <el-form-item label="账号" prop="userName">
          <el-input v-model="addForm.userName" placeholder="新增用户默认初始密码：123456"></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="addForm.name" placeholder="请输入姓名"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input  v-model="addForm.phone" placeholder="请输入手机号"></el-input>
        </el-form-item>
        <el-form-item label="角色" prop="roleId">
          <el-select v-model="addForm.roleId" placeholder="请选择角色">
            <el-option
              v-for="item in roleType"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="addForm.status" placeholder="请选择状态">
            <el-option
              v-for="item in statusType"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="权限区域" prop="areaId">
          <el-cascader
            v-model="areaArr"
            :options='areaOptions'
            :props="optionProps"
            style="width: 100%"
          ></el-cascader>
        </el-form-item>
        <el-form-item class="flex-x-end">
          <el-button size="small" @click="addVisible=false">取消</el-button>
          <el-button size='small' type="primary" @click="createEditData('addForm')">确定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog title="修改密码" :visible.sync="pwdVisible" width="500px">
      <el-form :model="passForm" ref="passForm" label-width="100px" class="demo-ruleForm" :rules="passRules">
        <el-form-item label="新密码" prop="password">
          <el-input v-model="passForm.password" type="password" placeholder="请输入新密码"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="rwd">
          <el-input v-model="passForm.rwd" type="password" placeholder="请确认密码"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleAB('passForm')">确定</el-button>
          <el-button @click="pwdVisible=false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

  </div>
</template>

<script>
  import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
  import Search from '@/components/Search'
  import {statusType} from '@/config/userManage'
  import {userApi,roleApi} from '@/api'
  import {validateRequire} from '@/utils/validate'
  import {regroupCascaderData} from '@/utils'
  export default {
    name: "index",
    data(){
      return {
        statusType,
        roleType:null,
        searchFields: [
          {type: 1, label: '角色', value: '', options: '', field: 'roleId'},
          {type: 0, label: '姓名', value: '', options: '', field: 'name'},
          {type: 0, label: '手机号', value: '', options: '', field: 'phone'},
          {type: 1, label: '状态', value: '', options: statusType, field: 'status'},
          {type: 6, label: '权限区域', value: [], options: [], field: 'areaId'},
        ],
        areaArr:[],
        areaOptions:[],
        optionProps: {
          children: 'areaList',
          label: 'name',
          value:'id',
          checkStrictly:true,
          expandTrigger: 'hover'
        },
        listLoading: false,
        list: null,
        listQuery: {
          pageNo: 1,
          pageSize: 10
        },
        addRules: {
          userName: [{
            required: true,
            trigger: 'blur',
            validator: validateRequire,
            text: '账号'
          }],
          name: [{
            required: true,
            trigger: 'blur',
            validator: validateRequire,
            text: '姓名'
          }],
          phone: [{
            required: true,
            trigger: 'blur',
            validator: validateRequire,
            text: '手机号'
          }],
          roleId: [{
            required: true,
            trigger: 'blur',
            validator: validateRequire,
            text: '角色'
          }],
          areaId: [{
            required: true,
            trigger: 'blur',
            validator: validateRequire,
            text: '权限区域'
          }]
        },
        total: 0,
        addVisible:false,
        isAdd:'create',
        addForm:{
          userName:'',
          name:'',
          phone:'',
          roleId:'',
          status:'',
          areaId:''
        },
        passForm:{
          password:'',
          id:'',
          rwd:''
        },
        passRules: {
          password: [{
            required: true,
            trigger: 'blur',
            validator: validateRequire,
            text: '新密码'
          }],
          rwd: [{
            required: true,
            trigger: 'blur',
            validator: validateRequire,
            text: '确认密码'
          }],
        },
        pwdVisible:false
      }
    },
    components: {Pagination, Search},
    created() {
      this.getList()
      this.getRole()
    },
    methods: {
      getArea(arr){
        this.areaOptions=arr
      },
      async getRole(){
        const {result} = await roleApi.allList()
        const list =[]
        result.forEach(item=>{
          const obj={
            label:item.name,
            value:item.id
          }
          list.push(obj)
        })
        this.roleType=list
        this.searchFields[0].options=list
      },
      handleSearch() {
        this.listQuery.pageNo = 1
        this.getList()
      },
      // 获取数据
      getList() {
        this.listLoading = true
        const tempSearch = this.searchFields.reduce((acc, cur) => {
          if(cur.field==='areaId'){
            acc[cur.field] = cur.value.length?cur.value[cur.value.length-1]:''
          }else {
            acc[cur.field] = cur.value
          }

          return acc
        }, {...this.listQuery})

        userApi.list(tempSearch).then(res => {
          this.list = res.result.records
          this.total = res.result.total
          this.listLoading = false
        })
      },

      // 重置
      resetForm() {
        this.addForm={
          userName:'',
          name:'',
          phone:'',
          roleId:'',
          status:1,
          areaId:''
        }
        this.areaArr=[]
      },
      resetPwd(){
        this.passForm={
          password:'',
          id:'',
          rwd:''
        }
      },
      resetPassword(row){
        this.resetPwd()
        this.pwdVisible = true
        this.passForm.id=row.id
        this.$nextTick(() => {
          this.$refs['passForm'].clearValidate()
        })
      },
      handleAB(form){
        this.$refs[form].validate((valid) => {
          if (valid) {
              userApi.resetPassword(this.passForm).then((res) => {
                this.getList()
                this.$message({
                  message: res.message || this.$t('common.success'),
                  type: 'success'
                })
              })
            this.pwdVisible = false
          }
        })
      },
      findNode(array, id) {
    let stack = [];
    let going = true;
    let walker = (array, id) => {
      array.forEach(item => {
        if (!going) return;
        stack.push(item['id']);
        if (item['id'] === id) {
          going = false;
        } else if (item['areaList']) {
          walker(item['areaList'], id);
        } else {
          stack.pop();
        }
      });
      if (going) stack.pop();
    }
    walker(array, id);
    return stack;
  },

      // 创建或编辑 type create or edit
      async handleCreateEdit(type, row) {
        if (type == 'create') this.resetForm()
        if (type == 'edit') {
          this.$nextTick(async()=>{
          const {result} = await userApi.queryById(row.id)
            this.areaArr = this.findNode(this.areaOptions,row.areaId)
          this.addForm={
            userName:result.username,
            name:result.name,
            phone:result.phone,
            roleId:result.roleId,
            status:result.isEnabled,
            areaId:result.areaId,
            id:row.id
          }
          })
        }
        this.isAdd = type
        this.addVisible = true
        this.$nextTick(() => {
          this.$refs['addForm'].clearValidate()
        })
      },
      // 确定创建或编辑
      createEditData(form) {
        this.addForm.areaId=this.areaArr[this.areaArr.length-1]
        this.$refs[form].validate((valid) => {
          if (valid) {
            if (this.isAdd ==='create') {
              userApi.add(this.addForm).then((res) => {
                this.getList()
                this.$message({
                  message: res.message || this.$t('common.success'),
                  type: 'success'
                })
              })
            }

            if (this.isAdd == 'edit') {
              userApi.edit(this.addForm).then((res) => {
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
          userApi.delete( row.id).then(res => {
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
      handlePwd(){

      }

    }
  }
</script>

<style lang="scss" scoped>


</style>
