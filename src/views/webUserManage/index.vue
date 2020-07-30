import fileDownload from "js-file-download";
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
      <UploadXls  @downMo="downMo" @uploadFile="uploadFile" :btnShow="true" @upOut="upOut"/>
    </div>
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row stripe style="width: 100%">
      <el-table-column  align="center" fixed :label="$t('common.serial')" width="50px">
        <template slot-scope="scope">
          {{ (listQuery.pageNo - 1) * listQuery.pageSize + scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column  align="center" label="姓名" prop="name"/>
      <el-table-column  align="center" label="手机号" prop="phone">
<!--        <template slot-scope="{row}">-->
<!--          <span>{{ row.areaCode +'  '+ row.mobile }}</span>-->
<!--        </template>-->
      </el-table-column>

      <el-table-column  align="center" label="角色" prop="roleName">
      </el-table-column>
      <el-table-column  align="center" label="积分" prop="integral">
      </el-table-column>
      <el-table-column  align="center" label="状态" prop="isEnabled" width="150px">
        <template slot-scope="scope">
          <el-tag :type="scope.row.isEnabled?'success':'danger'"> {{scope.row.isEnabled|isEnabled}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column  align="center" label="更新时间" prop="updatedAt" width="200px">
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
      >
        <template slot-scope="{row}">
          <el-button type="warning"  size="small" @click="handleCreateEdit('edit',row)">
            编辑
          </el-button>
          <el-button type="primary" size="small" @click="handleView(row)">
            查看
          </el-button>
<!--          <el-button type="text" size="small" @click="handleDelete(row)" style="color: red">-->
<!--            删除-->
<!--          </el-button>-->
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
      <el-form :model="addForm" ref="addForm" label-width="auto" label-position="right" class="demo-ruleForm" :rules="addRules">
        <el-form-item label="姓名" prop="name">
          <el-input v-model="addForm.name" placeholder="请输入姓名"/>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="addForm.phone" placeholder="请输入手机号"/>
        </el-form-item>
        <el-form-item label="证件类型" prop="certificateType">
          <el-select v-model="addForm.certificateType" placeholder="请选择证件类型">
            <el-option
              v-for="item in cardType"
              :key="item.value"
              :label="item.label"
              :value="item.value"/>
          </el-select>
        </el-form-item>
        <el-form-item label="证件号" prop="cardNo">
          <el-input v-model="addForm.cardNo" placeholder="请输入证件号"/>
        </el-form-item>
        <el-form-item label="民族" prop="nation">
          <el-input v-model="addForm.nation" placeholder="请输入名族"/>
        </el-form-item>
        <el-form-item label="出生日期" prop="birthday" >
          <el-date-picker
            v-model="addForm.birthday"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-select v-model="addForm.sex" placeholder="请选择性别">
            <el-option
              v-for="item in sexType"
              :key="item.value"
              :label="item.label"
              :value="item.value"/>
          </el-select>
        </el-form-item>
        <el-form-item label="户籍" prop="census">
          <el-input v-model="addForm.census" placeholder="请输入户籍"/>
        </el-form-item>
        <el-form-item label="状态" prop="isEnabled">
          <el-select v-model="addForm.isEnabled" placeholder="请选择状态">
            <el-option
              v-for="item in statusType"
              :key="item.value"
              :label="item.label"
              :value="item.value"/>
          </el-select>
        </el-form-item>
        <el-form-item>
          <UploadSFZ @getsfz="getsfz"/>
        </el-form-item>
        <el-form-item class="flex-x-end">
          <el-button size="small"  @click="addVisible=false">取消</el-button>
          <el-button  size="small" type="primary" @click="createEditData('addForm')">确定</el-button>
        </el-form-item>
      </el-form>

    </el-dialog>
    <el-dialog title="用户信息" v-if="userVisible" :visible.sync="userVisible" width="1000px">
      <el-row>
        <el-col :span="5">
          <div class="formSize">正面照</div>
          <img :src="detailList.photo?detailList.photo:require('@/assets/images/photo@2x.png')" style="width: 80px;height: 80px">
        </el-col>
        <el-col :span="9">
          <div class="formSize">姓名：{{detailList.name}}</div>
          <div class="formSize">证件类型：{{detailList.certificate|certificateType}}</div>
          <div class="formSize">性别：{{detailList.sex|sex}}</div>
          <div class="formSize">出生：{{detailList.birthday}}</div>
          <div class="formSize">户籍：{{detailList.census}}</div>
        </el-col>
        <el-col :span="10">
          <div class="formSize">手机号：{{detailList.phone}}</div>
          <div class="formSize">证件号：{{detailList.cardNo}}</div>
          <div class="formSize">民族：{{detailList.nation}}</div>
          <div class="formSize">积分：{{detailList.integral}}</div>
        </el-col>
      </el-row>
      <el-row>
        <div class="formSize" style="font-weight: bold">房源信息</div>
        <el-table v-loading="listLoading" :data="detailList.roles" border fit highlight-current-row stripe style="width: 100%">
          <el-table-column
            fixed
            align="center" label="序号"
            type="index"
            width="50">
          </el-table-column>
          <el-table-column  align="center" label="所属区域" prop="county" width="150px"/>
          <el-table-column  align="center" label="乡镇街道" prop="town" width="150px">
            <!--        <template slot-scope="{row}">-->
            <!--          <span>{{ row.areaCode +'  '+ row.mobile }}</span>-->
            <!--        </template>-->
          </el-table-column>
          <el-table-column  align="center" label="居村委" prop="village" width="150px"/>
          <el-table-column  align="center" label="详细地址" prop="areaName" width="250px"/>
          <el-table-column  align="center" label="户室" prop="roomName" width="150px"/>
          <el-table-column  align="center" label="网格" prop="gridName" width="150px"/>
          <el-table-column  align="center" label="理事" prop="gridPerName" width="150px"/>
          <el-table-column  align="center" label="所属角色" prop="roleName" width="150px"/>
        </el-table>

      </el-row>
    </el-dialog>

  </div>
</template>

<script>
  import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
  import Search from '@/components/Search'
  import {webUserApi} from '@/api'
  import {roleType,statusType,sexType,cardType} from '@/config/userManage'
  import {validateRequire} from '@/utils/validate'
  import UploadSFZ from "@/components/Upload/UploadSFZ";
  import UploadXls from "@/components/Upload/UploadXls";
  import fileDownload from "js-file-download"
    export default {
        name: "index",
      data(){
          return {
            cardType,
            sexType,
            statusType,
            searchFields: [
              {type: 1, label: '角色', value: '', options: roleType, field: 'roleId'},
              {type: 0, label: '姓名', value: '', options: '', field: 'name'},
              {type: 0, label:'手机号', value: '', options: '', field: 'phone'},
              {type: 1, label: '状态', value: '', options: statusType, field: 'status'}
            ],
            listLoading: false,
            list: null,
            listQuery: {
              pageNo: 1,
              pageSize: 10
            },
            total: 0,
            detailList:null,
            userVisible:false,
            addVisible:false,
            addForm:{
              birthday:'',
              cardNo:'',
              census:'',
              certificateType:'',
              isEnabled:'',
              name:'',
              nation:'',
              phone:'',
              sex:''
            },
            addRules: {
              name: [{
                required: true,
                trigger: 'blur',
                validator: validateRequire,
                text: '姓名'
              }],
              certificateType: [{
                required: true,
                trigger: 'blur',
                validator: validateRequire,
                text: '证件类型'
              }],
              cardNo: [{
                required: true,
                trigger: 'blur',
                validator: validateRequire,
                text: '证件号码'
              }]
            },
            isAdd:'create'
          }
      },
      components: {Pagination, Search,UploadSFZ,UploadXls},
      created() {
        this.getList()
      },
      methods: {
        handleSearch() {
          this.listQuery.pageNo = 1
          this.getList()
        },
        getsfz(val){
          if (val.national){
            this.addForm.nation=val.national
          }
          if(val.gender){
            this.addForm.sex=val.gender==='男'?1:2
          }
          if(val.address){
            this.addForm.census=val.address
          }
          if(!val.certificateType){
            this.addForm.certificateType=1
          }
          this.addForm={...this.addForm,...val}
        },
        // 获取数据
        getList() {
          this.listLoading = true
          const tempSearch = this.searchFields.reduce((acc, cur) => {
            acc[cur.field] = cur.value
            return acc
          }, {...this.listQuery})

          webUserApi.list(tempSearch).then(res => {
            this.list = res.result.records
            this.total = res.result.total
            this.listLoading = false
          })
        },
        //查看
        handleView(row){
          webUserApi.queryById(row.id).then(res => {
            this.detailList = res.result
            this.userVisible=true
          })
        },
        // 重置
        resetForm() {
          this.addForm={
            birthday:'',
            cardNo:'',
            census:'',
            certificateType:'',
            isEnabled:'',
            name:'',
            nation:'',
            phone:'',
            sex:''
          }
        },
        // 创建或编辑 type create or edit
        async handleCreateEdit(type, row) {
          if (type == 'create') this.resetForm()
          if (type == 'edit') {
            webUserApi.queryById(row.id).then(res => {
              this.addForm = res.result
              this.addForm ={... this.addForm,certificateType:this.addForm.certificate}
              delete this.addForm.roles
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
                webUserApi.add(this.addForm).then((res) => {
                  console.log(this.addForm)
                  this.getList()
                  this.$message({
                    message: res.message || this.$t('common.success'),
                    type: 'success'
                  })
                })
              }

              if (this.isAdd === 'edit') {
                webUserApi.edit(this.addForm).then((res) => {
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
          this.$confirm('是否删除该用户？', {
            confirmButtonText: this.$t('common.confirm'),
            cancelButtonText: this.$t('common.cancel'),
            type: 'warning'
          }).then(() => {
            webUserApi.delete(row.id).then(res => {
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
        uploadFile(file){
          return new Promise((resolve, reject) => {
            const formData = new FormData()
            formData.append('file', file.file)
            webUserApi.exportXls(formData).then((res) => {
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
          const data = await webUserApi.exportTemplate()
          fileDownload(data, `前端用户导入模板.xls`);
        },
        async upOut(){
          const data = await webUserApi.exportXlsOut()
          fileDownload(data, `前端用户列表.xls`);
        }
      }
    }
</script>

<style lang="scss" scoped>
.formSize {
  margin-bottom: 10px;
  font-size: 14px;
  color: #606266;

}
</style>
