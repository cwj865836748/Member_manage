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
      <el-table-column  align="left" label="标题" prop="title"/>
      <el-table-column  align="left" label="浏览量" prop="count" width="150px">
      </el-table-column>
      <el-table-column  align="left" label="积分值" prop="integral" width="150px">
      </el-table-column>
      <el-table-column  align="left" label="状态" prop="status" width="150px">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status?'success':'danger'"> {{scope.row.status|articleType}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column  align="left" label="更新时间" prop="updatedAt" width="200px">
      </el-table-column>
      <el-table-column
        label="操作"
        align="left"
      >
        <template slot-scope="{row}">
          <el-button  size="small" @click="handleCreateEdit('edit',row)">
            编辑
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
    <el-dialog :title="isAdd==='create'?'添加文章':'编辑文章'" :visible.sync="addVisible" width="1000px">
      <el-form :model="addForm" ref="addForm" label-width="auto" label-position="right" class="demo-ruleForm" :rules="addRules">
        <el-form-item label="标题:" prop="title">
          <el-input v-model="addForm.title" placeholder="请输入标题"></el-input>
        </el-form-item>
        <el-form-item label="内容:" prop="content">
          <Tinymce ref="tinymce" v-model="addForm.content" :height="300" v-if="addVisible" />
        </el-form-item>
        <el-form-item label="积分:" prop="integral">
          <el-input-number size="mini" v-model="addForm.integral" :min="0" controls-position="right"></el-input-number>
        </el-form-item>
        <el-form-item label="状态:" prop="status">
          <el-select v-model="addForm.status" placeholder="请选择状态">
          <el-option
            v-for="item in statusType"
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
  import {statusType} from '@/config/userManage'
  import {articleApi} from '@/api'
  import {validateRequire} from '@/utils/validate'
  import Tinymce from '@/components/Tinymce'
    export default {
        name: "index",
      data(){
          return {
            statusType,
            searchFields: [
              {type: 0, label: '标题', value: '', options: '', field: 'title'},
              {type: 1, label: '状态', value: '', options: statusType, field: 'status'},
            ],
            listLoading: false,
            list: null,
            listQuery: {
              pageNo: 1,
              pageSize: 10
            },
            addRules: {
              title: [{
                required: true,
                trigger: 'blur',
                validator: validateRequire,
                text: '标题'
              }]
            },
            total: 0,
            addVisible:false,
            isAdd:'create',
            addForm:{
              content:'',
              integral:0,
              status:'',
              title:''
            }
          }
      },
      components: {Pagination, Search,Tinymce},
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

          articleApi.list(tempSearch).then(res => {
            this.list = res.result.records
            this.total = res.result.total
            this.listLoading = false
          })
        },

        // 重置
        resetForm() {
          this.addForm={
            content:'',
            integral:0,
            status:1,
            title:''
          }
        },
        // 创建或编辑 type create or edit
        async handleCreateEdit(type, row) {
          if (type == 'create') this.resetForm()
          if (type == 'edit') {
            this.addForm = JSON.parse(JSON.stringify(row))
            this.$nextTick(() => {
              this.$refs.tinymce.setContent(this.addForm.content)
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
          this.$refs[form].validate((valid) => {
            if (valid) {
              if (this.isAdd ==='create') {
                articleApi.add(this.addForm).then((res) => {
                  this.getList()
                  this.$message({
                    message: res.message || this.$t('common.success'),
                    type: 'success'
                  })
                })
              }

              if (this.isAdd == 'edit') {
                articleApi.edit(this.addForm).then((res) => {
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
            console.log(row)
            articleApi.delete(row.id).then(res => {
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

<style scoped>

</style>
