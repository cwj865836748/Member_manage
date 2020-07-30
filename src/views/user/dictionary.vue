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
      <el-table-column  align="center" label="字典名称" prop="dictName"/>
      <el-table-column  align="center" label="字典编号" prop="dictCode">
      </el-table-column>
      <el-table-column  align="center" label="描述" prop="description">
      </el-table-column>

      <el-table-column
        label="操作"
        align="center"
        width="300px"
      >
        <template slot-scope="{row}">
          <el-button type="warning"  size="small" @click="handleCreateEdit('edit',row)">
            编辑
          </el-button>
          <el-button type="primary" size="small" @click="handleView(row)">
            字典配置
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
    <el-dialog :title="isAdd==='create'?'添加字典':'编辑字典'" :visible.sync="addVisible" width="500px" append-to-body>
      <el-form :model="addForm" ref="addForm" label-width="auto" label-position="right" class="demo-ruleForm" :rules="addRules">
        <el-form-item label="字典名称" prop="dictName">
          <el-input v-model="addForm.dictName" placeholder="请输入字典名称"></el-input>
        </el-form-item>
        <el-form-item label="字典编号" prop="dictCode">
          <el-input v-model="addForm.dictCode" placeholder="请输入字典编号"></el-input>
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
    <el-dialog title="字典项列表" :visible.sync="dictionaryVisible" width="1000px" append-to-body>
      <search ref="search" :fields="dictionaryFields" @change="dictionarySearch"/>
      <div class="filter-container">
        <el-button
          class="filter-item"
          type="primary"
          icon="el-icon-plus"
          @click="dictionaryCreateEdit('create')"
          size="small"
        >
          添加
        </el-button>
      </div>
      <el-table v-loading="listLoading" :data="dictionaryList" border fit highlight-current-row stripe style="width: 100%">
        <el-table-column  align="center" fixed :label="$t('common.serial')" width="50px" fixed>
          <template slot-scope="scope">
            {{ (dictionaryQuery.pageNo - 1) * dictionaryQuery.pageSize + scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column  align="center" label="字典项" prop="itemText"/>
        <el-table-column  align="center" label="字典项值" prop="itemValue">
        </el-table-column>
        <el-table-column  align="center" label="排序" prop="sortOrder">
        </el-table-column>
        <el-table-column  align="center" label="描述" prop="description" width="200px">
        </el-table-column>
        <el-table-column  align="center" label="状态" prop="status">
          <template slot-scope="scope">
            <el-tag :type="scope.row.status?'success':'danger'"> {{scope.row.status|isEnabled}}</el-tag>
          </template>
        </el-table-column>

        <el-table-column
          label="操作"
          align="center"
          width="200px"
        >
          <template slot-scope="{row}">
            <el-button type="warning"  size="small" @click="dictionaryCreateEdit('edit',row)">
              编辑
            </el-button>
            <el-button type="danger" size="small" @click="dictionaryDelete(row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <pagination
        v-show="dictionaryTotal>0"
        :total="dictionaryTotal"
        :page.sync="dictionaryQuery.pageNo"
        :limit.sync="dictionaryQuery.pageSize"
        @pagination="getDictionaryList"
      />
    </el-dialog>
    <el-dialog :title="dictionaryAdd==='create'?'添加字典项':'编辑字典项'" :visible.sync="dictionaryAddVisible" width="500px" append-to-body>
      <el-form :model="dictionaryForm" ref="dictionaryForm" label-width="auto" label-position="right" class="demo-ruleForm" :rules="dictionaryRules">
        <el-form-item label="字典项名称：" prop="itemText">
          <el-input v-model="dictionaryForm.itemText" placeholder="请输入字典项名称"></el-input>
        </el-form-item>
        <el-form-item label="字典项值：" prop="itemValue">
          <el-input v-model="dictionaryForm.itemValue"  placeholder="请输入字典项值"></el-input>
        </el-form-item>
        <el-form-item label="排序：" prop="sortOrder">
          <el-input  v-model="dictionaryForm.sortOrder"  placeholder="请输入排序"></el-input>
        </el-form-item>
        <el-form-item label="状态：" prop="status">
          <el-select v-model="dictionaryForm.status" placeholder="请选择状态">
            <el-option
              v-for="item in statusType"
              :key="item.value"
              :label="item.label"
              :value="item.value"/>
          </el-select>
        </el-form-item>
        <el-form-item class="flex-x-end">
          <el-button type="primary" size="small" @click="dictionaryAddVisible=false">取消</el-button>
          <el-button size="small" @click="dCreateEditData('dictionaryForm')">确定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

  </div>
</template>

<script>
  import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
  import Search from '@/components/Search'
  import {statusType} from '@/config/userManage'
  import {dictionaryApi} from '@/api'
  import {validateRequire} from '@/utils/validate'
  export default {
    name: "index",
    data(){
      return {
        statusType,
        searchFields: [
          {type: 0, label: '字典名称', value: '', options: '', field: 'dictName'},
        ],
        dictionaryFields:[
          {type: 0, label: '字典名称', value: '', options: '', field: 'itemText'},
          {type: 1, label: '状态', value: '', options: statusType, field: 'status'},
        ],
        listLoading: false,
        list: null,
        dictionaryList:null,
        listQuery: {
          pageNo: 1,
          pageSize: 10
        },
        dictionaryQuery:{
          pageNo: 1,
          pageSize: 10
        },
        addRules: {
          dictName: [{
            required: true,
            trigger: 'blur',
            validator: validateRequire,
            text: '字典名称'
          }],
          dictCode: [{
            required: true,
            trigger: 'blur',
            validator: validateRequire,
            text: '字典编号'
          }]
        },
        dictionaryRules: {
          itemText: [{
            required: true,
            trigger: 'blur',
            validator: validateRequire,
            text: '字典项名称'
          }],
          itemValue: [{
            required: true,
            trigger: 'blur',
            validator: validateRequire,
            text: '字典项值'
          }]
        },
        total: 0,
        dictionaryTotal:0,
        addVisible:false,
        dictionaryVisible:false,
        isAdd:'create',
        dictionaryAdd:'create',
        addForm:{
          description:'',
          dictCode:'',
          dictName:''
        },
        dictionaryAddVisible:false,
        dictionaryForm:{
          status:'',
          sortOrder:'',
          itemValue:'',
          itemText:''
        },
        dictId:''
      }
    },
    components: {Pagination, Search},
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
          acc[cur.field] = cur.value
          return acc
        }, {...this.listQuery})

        dictionaryApi.list(tempSearch).then(res => {
          this.list = res.result.records
          this.total = res.result.total
          this.listLoading = false
        })
      },

      //字典配置
      handleView(row){
        this.dictionaryVisible=true
        this.dictId=row.id
        this.getDictionaryList()
      },
      // 重置
      resetForm() {
        this.addForm={
          description:'',
          dictCode:'',
          dictName:''
        }
      },
      // 创建或编辑 type create or edit
      async handleCreateEdit(type, row) {
        if (type == 'create') this.resetForm()
        if (type == 'edit') {
          this.addForm = JSON.parse(JSON.stringify(row))
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
              dictionaryApi.add(this.addForm).then((res) => {
                this.getList()
                this.$message({
                  message: res.message || this.$t('common.success'),
                  type: 'success'
                })
              })
            }

            if (this.isAdd == 'edit') {
              dictionaryApi.edit(this.addForm).then((res) => {
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
          dictionaryApi.delete({id: row.id}).then(res => {
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

      dictionarySearch(){
        this.dictionaryQuery.pageNo = 1
        this.getDictionaryList()
      },
      //获取字典项数据
      getDictionaryList(){
        this.listLoading = true

        const tempSearch = this.dictionaryFields.reduce((acc, cur) => {
          acc[cur.field] = cur.value
          return acc
        }, {...this.dictionaryQuery,dictId:this.dictId})

        dictionaryApi.listEntry(tempSearch).then(res => {
          this.dictionaryList = res.result.records
          this.dictionaryTotal = res.result.total
          this.listLoading = false
        })
      },
      // 重置
      resetDictionaryForm() {
       this.dictionaryForm={
            status:'',
            sortOrder:'',
            itemValue:'',
            itemText:'',
        }
      },
      async dictionaryCreateEdit(type, row) {
        if (type == 'create') this.resetDictionaryForm()
        if (type == 'edit') {
          this.dictionaryForm = JSON.parse(JSON.stringify(row))
        }
        this.dictionaryAdd = type
        this.dictionaryAddVisible = true
        this.$nextTick(() => {
          this.$refs['dictionaryForm'].clearValidate()
        })
      },
      dCreateEditData(form){
        this.$refs[form].validate((valid) => {
          if (valid) {
            if (this.dictionaryAdd ==='create') {
              dictionaryApi.addEntry({...this.dictionaryForm,dictId:this.dictId}).then((res) => {
                this.getDictionaryList()
                this.$message({
                  message: res.message || this.$t('common.success'),
                  type: 'success'
                })
              })
            }

            if (this.dictionaryAdd == 'edit') {
              dictionaryApi.editEntry({...this.dictionaryForm,dictId:this.dictId}).then((res) => {
                this.getDictionaryList()
                this.$message({
                  message: res.message || this.$t('common.success'),
                  type: 'success'
                })
              })
            }
            this.dictionaryAddVisible=false
          }
        })

      },
      // 删除
      dictionaryDelete(row) {
        this.$confirm(this.$t('common.deleteTip'), this.$t('common.tip'), {
          confirmButtonText: this.$t('common.confirm'),
          cancelButtonText: this.$t('common.cancel'),
          type: 'warning'
        }).then(() => {
          dictionaryApi.deleteEntry({id: row.id}).then(res => {
            const flag = --this.dictionaryTotal % this.dictionaryQuery.pageSize
            if (!flag && this.dictionaryTotal) this.dictionaryQuery.pageNo--
            this.getDictionaryList()
            this.$message({
              message: res.message || this.$t('common.success'),
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
