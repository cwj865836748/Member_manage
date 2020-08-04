<template>
  <div class="app-container">
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
    <el-table :data="list"  style="width: 100%"
              border fit highlight-current-row stripe
              :tree-props="{children: 'menus'}"
              row-key="id"
    >

      <el-table-column  align="left" label="菜单名称" prop="name"/>

      <el-table-column  align="left" label="菜单类型" prop="menuType">
      </el-table-column>
<!--      <el-table-column  align="left" label="路径" prop="updatedAt">-->
<!--      </el-table-column>-->
      <el-table-column  align="left" label="排序" prop="sortNo">
      </el-table-column>
      <el-table-column
        label="操作"
        align="left"
      >
        <template slot-scope="{row}">
          <el-button type="warning"  size="small" @click="handleCreateEdit('edit',row)">
            编辑
          </el-button>
          <el-button type="danger" size="small" @click="handleDelete(row)">
            删除
          </el-button>
        </template>
      </el-table-column>

    </el-table>
    <el-dialog :title="isAdd==='create'?'添加菜单':'修改'" :visible.sync="addVisible" width="500px">
      <el-form :model="addForm" ref="addForm" label-width="auto" label-position="right" class="demo-ruleForm" :rules="addRules">
        <el-form-item label="菜单名称" prop="name">
          <el-input v-model="addForm.name" placeholder="请输入菜单名称"></el-input>
        </el-form-item>
        <el-form-item label="类型" prop="menuType">
          <el-select v-model="addForm.menuType" placeholder="请选择类型">
            <el-option label="一级菜单" :value="0"/>
            <el-option label="子菜单" :value="1"/>
          </el-select>
        </el-form-item>
        <el-form-item label="跳转地址" prop="redirect">
          <el-input v-model="addForm.redirect" placeholder="请输入跳转地址"></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input type="textarea" autosize v-model="addForm.description" placeholder="请输入描述"></el-input>
        </el-form-item>
<!--        <el-form-item label="菜单图标" prop="icon">-->
<!--          <el-input v-model="addForm.icon" placeholder="请输入图标"></el-input>-->
<!--        </el-form-item>-->
        <el-form-item label="菜单排序" prop="sortNo">
          <el-input v-model="addForm.sortNo" placeholder="请输入排序"></el-input>
        </el-form-item>
        <el-form-item label="父id" prop="parentId">
          <el-input v-model="addForm.parentId" placeholder="请输入父id"></el-input>
        </el-form-item>
        <el-form-item class="flex-x-end">
          <el-button  @click="addVisible=false">取消</el-button>

          <el-button type="primary" @click="createEditData('addForm')">确定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>




  </div>
</template>

<script>

  import {anotherApi} from '@/api'
  import {validateRequire} from '@/utils/validate'
  export default {
    name: "index",
    data(){
      return {

        listLoading: false,
        list: null,
        listQuery: {
          pageNo: 1,
          pageSize: 10
        },
        total: 0,
        addVisible:false,
        isAdd:'create',
        addRules: {
          name: [{
            required: true,
            trigger: 'blur',
            validator: validateRequire,
            text: '菜单名称'
          }],
          menuType: [{
            required: true,
            trigger: 'blur',
            validator: validateRequire,
            text: '菜单类型'
          }],
          redirect: [{
            required: true,
            trigger: 'blur',
            validator: validateRequire,
            text: '路径'
          }]
        },
        addForm:{
          name:'',
          menuType:'',
          description:'',
          redirect:'',
          sortNo:'',
          parentId:''
        }
      }
    },
    created() {
      this.getList()
    },
    methods: {
      async getList() {
        const {result} = await anotherApi.menuList()
        this.list = result
      },
      // 重置
      resetForm() {
        this.addForm = {
          name:'',
          menuType:'',
          icon:'',
          description:'',
          redirect:'',
          sortNo:'',
          parentId:''
        }
      },
      // 创建或编辑 type create or edit
      async handleCreateEdit(type, row) {
        if (type == 'create') this.resetForm()
        if (type == 'edit') {
          this.addForm = JSON.parse(JSON.stringify(row))
          delete this.addForm.menus
        }
        this.isAdd = type
        this.addVisible = true
        this.$nextTick(() => {
          this.$refs['addForm'].clearValidate()
        })
      },
      // 确定创建或编辑
      createEditData(form) {
        this.$refs[form].validate((valid) => {
          if (valid) {
            if (this.isAdd === 'create') {
              anotherApi.add(this.addForm).then((res) => {
                this.getList()
                this.$message({
                  message: res.message || this.$t('common.success'),
                  type: 'success'
                })
              })
            }

            if (this.isAdd == 'edit') {
              anotherApi.edit(this.addForm).then((res) => {
                this.getList()
                this.$message({
                  message: res.message || this.$t('common.success'),
                  type: 'success'
                })
              })
            }
            this.addVisible = false
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
          anotherApi.delete(row.id).then(res => {
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

    }
  }
</script>

<style lang="scss" scoped>


</style>
