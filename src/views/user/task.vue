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
      <el-table-column  align="left" label="任务类名" prop="jobClassName"/>

      <el-table-column  align="left" label="cron表达式" prop="cronExpression">
      </el-table-column>
      <el-table-column  align="left" label="描述" prop="description">
      </el-table-column>
      <el-table-column  align="left" label="状态" prop="status" width="100px">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status===0?'success':'danger'"> {{scope.row.status|isTaskEnabled}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="left"
        width="250px"
      >
        <template slot-scope="{row}">
          <el-button type="warning"  size="small" @click="handleCreateEdit('edit',row)" v-if="row.status===-1">
            编辑
          </el-button>
          <el-button type="success" size="small" @click="resume(row)" v-if="row.status===-1">
            恢复
          </el-button>
          <el-button type="info" size="small" @click="pause(row)" v-if="row.status===0">
            暂停
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
    <el-dialog :title="isAdd==='create'?'添加任务':'编辑任务'" :visible.sync="addVisible" width="500px">
      <el-form :model="addForm" ref="addForm" label-width="auto" label-position="right" class="demo-ruleForm" :rules="addRules">
        <el-form-item label="任务类名" prop="jobClassName">
          <el-input v-model="addForm.jobClassName" placeholder="请输入任务类名"></el-input>
        </el-form-item>
        <el-form-item label="cron表达式" prop="cronExpression">
          <el-input v-model="addForm.cronExpression" placeholder="请输入cron表达式"></el-input>
        </el-form-item>
        <el-form-item label="参数" prop="parameter">
          <el-input v-model="addForm.parameter" placeholder="请输入参数"></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input autosize type="textarea" v-model="addForm.description" placeholder="请输入描述"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="addForm.status" placeholder="请选择状态">
            <el-option :value="-1" label="禁用"/>
            <el-option :value="0" label="启用"/>
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
  import {taskApi} from '@/api'
  import {validateRequire} from '@/utils/validate'
  export default {
    name: "index",
    data(){
      return {
        searchFields: [
          {type: 0, label: '任务类名', value: '', options: '', field: 'jobClassName'},
        ],
        listLoading: false,
        list: null,
        listQuery: {
          pageNo: 1,
          pageSize: 10
        },
        addRules: {
          jobClassName: [{
            required: true,
            trigger: 'blur',
            validator: validateRequire,
            text: '任务名称'
          }],
          cronExpression: [{
            required: true,
            trigger: 'blur',
            validator: validateRequire,
            text: 'cron表达式'
          }]
        },
        total: 0,
        addVisible:false,
        isAdd:'create',
        addForm:{
          description:'',
          cronExpression:'',
          jobClassName:'',
          parameter:'',
          status:''
        }
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

        taskApi.list(tempSearch).then(res => {
          this.list = res.result.records
          this.total = res.result.total
          this.listLoading = false
        })
      },
      // 重置
      resetForm() {
        this.addForm={
          description:'',
          cronExpression:'',
          jobClassName:'',
          parameter:'',
          status:0
        }
      },
      // 创建或编辑 type create or edit
      async handleCreateEdit(type, row) {
        if (type == 'create') this.resetForm()
        if (type == 'edit') {
          this.addForm=JSON.parse(JSON.stringify(row))
          delete this.addForm.createdAt
          delete this.addForm.updatedAt
          delete this.addForm.delFlag
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
              taskApi.add(this.addForm).then((res) => {
                this.getList()
                this.$message({
                  message: res.message || this.$t('common.success'),
                  type: 'success'
                })
              })
            }

            if (this.isAdd == 'edit') {
              taskApi.edit(this.addForm).then((res) => {
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
          taskApi.delete( row.id).then(res => {
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
      resume(row){
        this.$confirm('是否启用任务', {
          confirmButtonText: this.$t('common.confirm'),
          cancelButtonText: this.$t('common.cancel'),
          type: 'warning'
        }).then(async () => {
          await taskApi.resume({jobClassName:row.jobClassName})
          this.getList()
        }).catch(() => {
          this.$message({
            type: 'info',
            message: this.$t('common.isCancel')
          })
        })
      },
      pause(row){
        this.$confirm('是否暂停任务', {
          confirmButtonText: this.$t('common.confirm'),
          cancelButtonText: this.$t('common.cancel'),
          type: 'warning'
        }).then(async() => {
          await taskApi.pause({jobClassName:row.jobClassName})
          this.getList()
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

<style lang="scss" scoped>


</style>
