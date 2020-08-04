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
      <el-table-column  align="left" label="角色名称" prop="name"/>

      <el-table-column  align="left" label="描述" prop="description">
      </el-table-column>
      <el-table-column  align="left" label="更新时间" prop="updatedAt">
      </el-table-column>
      <el-table-column
        label="操作"
        align="left"
        width="250px"
      >
        <template slot-scope="{row}">
          <el-button type="warning"  size="small" @click="handleCreateEdit('edit',row)">
            编辑
          </el-button>
          <el-button type="success" size="small" @click="authorization(row)">
            授权
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
    <el-dialog :title="isAdd==='create'?'添加角色':'编辑角色'" :visible.sync="addVisible" width="500px">
      <el-form :model="addForm" ref="addForm" label-width="auto" label-position="right" class="demo-ruleForm" :rules="addRules">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="addForm.name" placeholder="请输入角色名称"></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input type="textarea" autosize v-model="addForm.description" placeholder="请输入描述"></el-input>
        </el-form-item>
        <el-form-item class="flex-x-end">
          <el-button size="small" @click="addVisible=false">取消</el-button>

          <el-button size="small" type="primary" @click="createEditData('addForm')">确定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog title="授权" :visible.sync="dialogFormVisible">
              <el-tree
                ref="tree"
                :data="treeData"
                show-checkbox
                default-expanded-all
                node-key="id"
                :props="defaultProps"
                @check="checkGroupNode"
              />
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          {{ $t('common.cancel') }}
        </el-button>
        <el-button type="primary" @click="isAuth">
          {{ $t('common.confirm') }}
        </el-button>
      </div>
    </el-dialog>


  </div>
</template>

<script>
  import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
  import Search from '@/components/Search'
  import {anotherApi,roleApi} from '@/api'
  import {validateRequire} from '@/utils/validate'
  export default {
    name: "index",
    data(){
      return {
        searchFields: [
          {type: 0, label: '角色名称', value: '', options: '', field: 'name'},
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
            text: '姓名'
          }],
        },
        total: 0,
        addVisible:false,
        dialogFormVisible:false,
        isAdd:'create',
        addForm:{
          description:'',
          name:''
        },
        defaultProps: {
          children: 'menus',
          label: 'name'
        },
        treeData:[],
        menuObj:{
          menuIds:[],
          roleId:''
        }
      }
    },
    components: {Pagination, Search},
    created() {
      this.getList()
      this.getTree()
    },
    methods: {
      async getTree(){
        const {result} = await anotherApi.menuList()
        this.treeData=result
      },
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

        roleApi.list(tempSearch).then(res => {
          this.list = res.result.records
          this.total = res.result.total
          this.listLoading = false
        })
      },
       authorization(row){
        this.dialogFormVisible=true
        this.menuObj.roleId=row.id
         this.getMenuTreeByRole()

      },
      async getMenuTreeByRole(){
        const {result}  =  await roleApi.getMenuTreeByRole({roleId:this.menuObj.roleId})
        const arr = []
        result.length&&result.forEach(item=>{
          if (item.menus&&item.menus.length){
            item.menus.forEach(items=>{
              items.isOwn&&arr.push(items.id)
            })
          }else {
            item.isOwn&&arr.push(item.id)
          }
        })
        this.$refs.tree.setCheckedKeys(arr)
        this.menuObj.menuIds=arr
      },
      // 重置
      resetForm() {
        this.addForm={
          description:'',
          name:''
        }
      },
      // 创建或编辑 type create or edit
      async handleCreateEdit(type, row) {
        if (type == 'create') this.resetForm()
        if (type == 'edit') {
          this.addForm = {
            description:row.description,
            name:row.name,
            id:row.id
          }
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
            if (this.isAdd ==='create') {
              roleApi.add(this.addForm).then((res) => {
                this.getList()
                this.$message({
                  message: res.message || this.$t('common.success'),
                  type: 'success'
                })
              })
            }

            if (this.isAdd == 'edit') {
              roleApi.edit(this.addForm).then((res) => {
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
          roleApi.delete( row.id).then(res => {
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
     async isAuth(){
        const {code} = await roleApi.authorization(this.menuObj)
       if (code===200){
         this.$message.success('授权成功')
         this.dialogFormVisible=false
       }
      },
      checkGroupNode(node,checkNode){
        this.menuObj.menuIds=[]
        checkNode.checkedNodes.forEach(item=>{
          this.menuObj.menuIds.push(item.id)
        })
      }
    }
  }
</script>

<style lang="scss" scoped>


</style>
