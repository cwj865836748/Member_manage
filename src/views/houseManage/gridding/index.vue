import fileDownload from "js-file-download";
<template>
  <div class="app-container mh">
  <el-row :gutter="40" style="margin: 0" class="mh">
    <el-col :span="5" :xl="5" :lg="6" :md="7" :sm="8" :xs="8" class="mh" style="padding: 0">
      <el-card shadow="always" class="mymh">
      <el-row :gutter="5" class="flex-y-center" style="margin-bottom: 10px" >
       <el-col :span="4" class="wgSize">网格:</el-col>
        <el-col :span="14">
       <el-input
         placeholder="请输入"
         size="small"
         v-model="treeKey"/>
        </el-col>
        <el-col :span="6"> <el-button type="primary" size="small" @click="$refs.tree.filter(treeKey)">查询</el-button></el-col>
      </el-row>
      <el-row>
        <el-col :span="10">
       <el-button size="small" type="primary" icon="el-icon-plus"  @click="createOrUpdate('create')">新建网格</el-button>
        </el-col>
      </el-row>
      <el-tree
         class="filter-tree"
         style="margin: 10px 30px"
         :data="treeData"
         :props="treeProps"
         :default-expanded-keys="treeArr"
         :filter-node-method="filterNode"
         @node-click="getGridList"
         node-key="id"
         ref="tree">
            <span class="custom-tree-node" slot-scope="{ node }">
        <span>{{ node.label }}</span>
        <span v-if="node.data.isLast">
          <el-button
            type="text"
            size="mini"
            @click.stop="createOrUpdate('create',node)">
            <i class="el-icon-circle-plus" style="font-size: 16px"></i>
          </el-button>
        </span>
      </span>
       </el-tree>
      </el-card>
    </el-col>
    <el-col :span="19" :xl="19" :lg="18" :md="17" :sm="16" :xs="16" class="mh">
      <el-card shadow="always" class="mh" v-show="gridDetail.gridName">
      <el-row class="head">
        <el-col :span="8">
          <div class="wgName margin20">{{gridDetail.gridName}}</div>
          <div class="margin20 wgName2">理事：{{gridDetail.personName}}</div>
          <div class="margin20 wgName2">创建时间：{{gridDetail.createAt}}</div>
          <div class="wgName2">描述：{{gridDetail.content}}</div>
        </el-col>
        <el-col :span="8" style="padding-top: 40px">
          <div class="margin20 wgName2">手机号：{{gridDetail.phone}}</div>
          <div style="color: #1890FF" class="wgName2">管理房源：{{gridDetail.houseCount}}</div>
        </el-col>
        <el-col :span="8" style="text-align: right">
          <el-button :disabled="!gridDetail.gridName" type="warning" size="small" @click="createOrUpdate('edit')">编辑</el-button>
          <el-button :disabled="!gridDetail.gridName" size="small"  type="danger" @click="handleDelete('grid')">删除</el-button>
        </el-col>
      </el-row>
      <el-row class="head">
      <search ref="search" :gridDetail="gridDetail" :fields="searchFields" @change="handleSearch" @getArea="getArea"/>
      <div class="filter-container" >
        <div class="flex-x-start">
        <el-button
          class="filter-item"
          type="primary"
          icon="el-icon-plus"
          @click="addHouse"
          size="small"
          :disabled="!gridDetail.gridName"
        >
          添加
        </el-button>

        <UploadXls v-if="gridDetail.gridName" @downMo="downMo" @uploadFile="uploadFile"/>
          <el-button
            class="filter-item"
            type="danger"
            @click="deleteSome"
            size="small"
            :disabled="!deleteList.length"
          >
            批量删除
          </el-button>
        </div>
        <el-table v-loading="listLoading" row-key="id" ref="multipleTable" @selection-change="handleDeleteRow" :data="list" border fit highlight-current-row stripe style="width: 100%">
          <el-table-column
            type="selection"
            :reserve-selection="true"
            prop="id"
            align="left"
            width="55">
          </el-table-column>
          <el-table-column  align="left" fixed :label="$t('common.serial')" width="50px" type="index">

          </el-table-column>
          <el-table-column  align="left" label="所属区域" prop="county"/>
          <el-table-column  align="left" label="乡镇街道" prop="town">
            <!--        <template slot-scope="{row}">-->
            <!--          <span>{{ row.areaCode +'  '+ row.mobile }}</span>-->
            <!--        </template>-->
          </el-table-column>

          <el-table-column  align="left" label="居村委" prop="village">
          </el-table-column>
          <el-table-column  align="left" label="详细地址" prop="address">
          </el-table-column>
          <el-table-column  align="left" label="更新时间" prop="updatedAt">
          </el-table-column>
          <el-table-column
            label="操作"
            align="left"
          >
            <template slot-scope="{row}">
              <el-button type="danger" size="small" @click="handleDelete('house',row)">
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <pagination
          v-show="total>0"
          :total="total"
          :pageNo.sync="listQuery.pageNo"
          :pageSize.sync="listQuery.pageSize"
          @pagination="getGridFloorList"
        />
      </div>
      </el-row>
      </el-card>
      <el-card shadow="always" class="mh flex-xy-center" v-show="!gridDetail.gridName" >
        <span style="color: #909399">暂无数据</span>
      </el-card>
    </el-col>
  </el-row>
  <el-dialog
    :title="isAdd==='create'?'新建网格':'编辑网格'"
    :visible.sync="addVisible"
    width="500px"
  >
    <el-form :model="addForm" ref="addForm" label-width="auto" label-position="right" class="demo-ruleForm" :rules="addRules">
      <el-form-item label="所属区域" prop="areaId" placeholder="请选择所属区域">
        <el-cascader
          v-model="areaArr"
          :options='areaOptions'
          :props="optionProps"
          style="width: 100%"
         ></el-cascader>
      </el-form-item>
      <el-form-item label="网格名称" prop="name">
        <el-input v-model="addForm.name"placeholder="请输入网格名称" />
      </el-form-item>
      <el-form-item label="理事" prop="gridPersonId">
        <el-select
          v-model="addForm.gridPersonId"
          filterable
          placeholder="请输入关键词"
          :filter-method="remoteMethod"
          >
          <el-option
            v-for="item in gridPersonOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="描述" prop="content">
        <el-input type="textarea" autosize v-model="addForm.content" placeholder="请输入描述"/>
      </el-form-item>
      <el-form-item class="flex-x-end">
        <el-button  @click="closeForm" size="small">取消</el-button>
        <el-button type="primary" @click="submitForm('addForm')" size="small">确定</el-button>
      </el-form-item>
    </el-form>

  </el-dialog>
  <el-dialog
    title="添加房源"
    :visible.sync="houseVisible"
    width="90%"
    :close-on-click-modal="false"
    destroy-on-close
  >
        <search ref="abc" :fields="houseFields" @change="addHouse" />

    <el-table ref="multipleTable" row-key="systemid" @selection-change="handleselectRow" :data="houseList" border fit highlight-current-row stripe style="width: 100%">
      <el-table-column
        type="selection"
        :reserve-selection="true"
        prop="id"
        align="left"
        width="55">
      </el-table-column>
      <el-table-column  align="left" fixed :label="$t('common.serial')" width="80px">
        <template slot-scope="scope">
          {{ (houseQuery.pageNo - 1) * houseQuery.pageSize + scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column  align="left" label="systemid" prop="systemid"/>
      <el-table-column  align="left" label="所属区域" prop="county"/>
      <el-table-column  align="left" label="乡镇街道" prop="town">
        <!--        <template slot-scope="{row}">-->
        <!--          <span>{{ row.areaCode +'  '+ row.mobile }}</span>-->
        <!--        </template>-->
      </el-table-column>

      <el-table-column  align="left" label="居村委" prop="village">
      </el-table-column>
      <el-table-column  align="left" label="详细地址" prop="address">
      </el-table-column>
    </el-table>
    <el-button size="small" style="margin-top: 10px" type="primary" @click="addGridFloor">确定</el-button>

    <pagination
        v-show="houseTotal>0"
        :total="houseTotal"
        :pageNo.sync="houseQuery.pageNo"
        :pageSize.sync="houseQuery.pageSize"
        @pagination="getHouseList"
      />

  </el-dialog>
</div>
</template>

<script>
  import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
  import Search from '@/components/Search'
  import {houseApi} from '@/api'
  import {validateRequire} from '@/utils/validate'
  import UploadXls from "@/components/Upload/UploadXls";
  import fileDownload from "js-file-download"
  export default {
        name: "index",
    components: {Pagination, Search,UploadXls},
      data(){

        return {
          searchFields: [
            {type: 6, label: '所属区域', value: [], options: [], field: 'id',disabled:true},
            {type: 0, label: '详细地址', value: '', options: '', field: 'address'},
          ],
          houseFields: [
            // {type: 6, label: '所属区域', value: [], options: [], field: 'areaId'},
            {type: 0, label: '详细地址', value: '', options: '', field: 'address'},
          ],
          listLoading:false,
          list: null,
          listQuery: {
            pageNo: 1,
            pageSize: 10,
            id:null
          },
          total: 0,
          isAdd:'create',
          addVisible:false,
          addForm:{
            areaId:'',
            content:'',
            gridPersonId:'',
            name:''
          },
          areaOptions:[],
          areaArr:[],
          addRules: {
            areaId: [{
              required: true,
              trigger: 'blur',
              validator: validateRequire,
              text: '所属区域'
            }],
            name: [{
              required: true,
              trigger: 'blur',
              validator: validateRequire,
              text: '网格名称'
            }],
            gridPersonId: [{
              required: true,
              trigger: 'blur',
              validator: validateRequire,
              text: '理事'
            }]
          },
          gridPersonList:[],
          houseVisible:false,
          treeKey:'',
          treeData:[],
          treeArr:[],
          treeProps: {
            children: 'areaList',
            label: 'name'
          },
          optionProps: {
              children: 'areaList',
              label: 'name',
              value:'id',
              expandTrigger: 'hover'
          },
          selectLoading:false,
          gridPersonOption:[],
          gridPersonOptions:[],
          gridDetail:{
            gridName:'',
            personName:'',
            phone: "",
            houseCount: null,
            createAt:'',
            content:null
          },
          houseList:[],
          houseQuery: {
            pageNo: 1,
            pageSize: 10
          },
          houseTotal: 0,
          selectList:[],
          deleteList:[]
        }
      },
    watch:{
      addVisible(newVal,oldVal){
        if (!newVal){
          //this.areaArr=[]
        }
      }
    },
      created() {
          this.getTree()
          this.getAllGrid()
      },
      methods:{
          //获取树节点点击之后的网格信息
        getGridList(data, node){
          if (node.data.isLast){
            this.areaArr=this.findNode(this.treeData,node.data.id)
            return false
          }
          if (!node.data.isGrid){
            return false
          }
          this.searchFields[0].value=this.findNode(this.treeData,node.parent.data.id)
          // this.houseFields[0].value=[node.parent.parent.parent.data.id,node.parent.parent.data.id,node.parent.data.id]
          this.listQuery.id = node.data.id//网格id
          this.getGridInfo()
          this.getGridFloorList()
        },
        //获取右边房源信息
        getGridInfo(){
          houseApi.getGridInfo({id:this.listQuery.id}).then(res => {
            this.gridDetail=res.result
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
        getGridFloorList(data={}){
          this.listLoading=true
          this.listQuery.pageNo=data.pageNo?data.pageNo:this.listQuery.pageNo
          this.listQuery.pageSize=data.pageSize?data.pageSize:this.listQuery.pageSize
          const obj = {
            pageNo:data.pageNo||this.listQuery.pageNo,
            pageSize:data.pageSize||this.listQuery.pageSize,
            gridId:this.listQuery.id,
            address:this.searchFields[1].value,
          }
          houseApi.getGridFloorList(obj).then(res => {
            this.list=res.result.records
            this.total=res.result.total
            this.listLoading=false
          })
        },
        //获取树
        async getTree(){
          const {code,result} = await houseApi.queryAreaGrids()
          if (code===200){
            this.treeData=this.getTreeData(result)
            !this.treeArr.length&&result.length&&result.forEach(item=>{
              this.treeArr.push(item.id)
            })
          }
        },
        getTreeData(data){
          // 循环遍历json数据
          for(let i=0;i<data.length;i++){
            if(data[i].areaList.length<1){
              // children若为空数组，则将children设为undefined
              data[i].areaList=data[i].grids;
            }else {
              // children若不为空数组，则继续 递归调用 本方法
              this.getTreeData(data[i].areaList);
            }
          }
          return data;
        },
        getArea(arr){
          this.areaOptions=arr
        },
        //树节点过滤
        filterNode(value, data) {
          if (!value) return true;
          return data.name.indexOf(value) !== -1;
        },
       async getAllGrid(){
         houseApi.getAllRole('').then(re=>{
           re.result&&re.result.forEach(item=>{
             let obj ={
               label:item.name,
               value:item.id
             }
             this.gridPersonOption.push(obj)
             this.gridPersonOptions.push(obj)
           })
         })
        },
        //获取理事
        remoteMethod(query) {
          this.gridPersonOptions= this.gridPersonOption.filter(item=>item.label.includes(query))
        },

        //搜索
        handleSearch() {
          this.listQuery.pageNo = 1
          this.getGridFloorList()
        },
        // 删除房源以及网格
        handleDelete(type,row) {
          if(type==='grid'){
            this.$confirm('是否删除该网格', {
              confirmButtonText: this.$t('common.confirm'),
              cancelButtonText: this.$t('common.cancel'),
              type: 'warning'
            }).then(() => {
              houseApi.delete(this.gridDetail.gridId).then(res => {
                this.list=null
                this.total=0
                this.listQuery= {
                  pageNo: 1,
                  pageSize: 10,
                  id:null
                }
                this.gridDetail={
                  gridName:'',
                  personName:'',
                  phone: "",
                  houseCount: null,
                  createAt:'',
                  content:null
                }
                this.$message({
                  message: res.msg || this.$t('common.success'),
                  type: 'success'
                })
                this.getTree()
                this.searchFields[0].value=[]
              })
            }).catch(() => {
              this.$message({
                type: 'info',
                message: this.$t('common.isCancel')
              })
            })

          }

        else{
            this.$confirm('是否删除该房源', {
              confirmButtonText: this.$t('common.confirm'),
              cancelButtonText: this.$t('common.cancel'),
              type: 'warning'
            }).then(() => {
            houseApi.deleteGridFloor(row.id).then(res => {
              const flag = --this.total % this.listQuery.pageSize
              if (!flag && this.total) this.listQuery.pageNo--
              this.getGridFloorList()
              this.getGridInfo()
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
        },
// 重置
        resetForm() {
          this.addForm={
            areaId:'',
            content:'',
            gridPersonId:'',
            name:''
          }
        },
        closeForm (){
          this.addVisible=false
          this.areaArr=[]
        },

        //打开表单
        createOrUpdate(type,node){
          if (type == 'create') {
            this.resetForm()
            if (node){
              this.areaArr=this.findNode(this.treeData,node.data.id)
            }
          }
          if (type == 'edit') {
            this.addForm = {
              content:this.gridDetail.content,
              gridPersonId:this.gridDetail.personId,
              areaId:this.listQuery.id,
              name:this.gridDetail.gridName,
              id:this.gridDetail.gridId
            }
            this.areaArr=this.searchFields[0].value
          }
          this.isAdd=type
          this.addVisible = true
          this.$nextTick(() => {
            this.$refs['addForm'].clearValidate()
          })
        },

        //提交表单
        submitForm(form){
          this.addForm.areaId=this.areaArr[this.areaArr.length-1]
          this.$refs[form].validate((valid) => {
            if (valid) {
              if (this.isAdd ==='create') {
                houseApi.add(this.addForm).then((res) => {
                  this.getTree()
                  this.$message({
                    message: res.message || this.$t('common.success'),
                    type: 'success'
                  })
                })
              }

              if (this.isAdd == 'edit') {
                houseApi.edit(this.addForm).then((res) => {
                  this.getGridInfo()
                  this.getTree()
                  this.searchFields[0].value=this.areaArr
                  // this.houseFields[0].value=this.areaArr
                  this.$message({
                    message: res.message || this.$t('common.success'),
                    type: 'success'
                  })
                })
              }
              this.addVisible=false
            }
          })
          this.areaArr=[]
        },
        addHouse(){
          this.houseQuery.pageNo=1
          this.houseVisible=true
          this.getHouseList()
        },
        //获取房源列表
        getHouseList(data={}){
          const areaId =this.searchFields[0].value[this.searchFields[0].value.length-1]
          if(!areaId){
            return  this.$message.error('所属区域不能为空');
          }
          houseApi.findAllFloorList({...this.houseQuery,address:this.houseFields[0].value,areaId,...data}).then(res => {
            this.houseList=res.result.records
            this.houseTotal = res.result.total
            this.listLoading = false
          })
        },
        //行选中函数  若有删除，若无添加
        handleselectRow(selection, row) {
          this.selectList=selection
        },
        handleDeleteRow(selection, row){
          console.log(selection)
          this.deleteList=selection.length?selection:[]
        },
        //批量删除
        deleteSome(){
          this.$confirm('是否删除选择房源', {
            confirmButtonText: this.$t('common.confirm'),
            cancelButtonText: this.$t('common.cancel'),
            type: 'warning'
          }).then(() => {
            let ids =[]
            this.deleteList.forEach(item=>{
              ids.push(item.id)
            })

            houseApi.deleteGridFloorBatch(ids.join(',')).then(res=>{
              if (res.code===200){
                this.deleteList=[]
                this.$refs.multipleTable.clearSelection()
                this.getGridFloorList()
                this.getGridInfo()
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
        addGridFloor(){
          if(!this.selectList.length){
            return this.$message.warning('请选择要添加的房源')
          }
          const floorsDtos=[]
          this.selectList.forEach(item=>{
            floorsDtos.push({address:item.address,systemId:item.systemid})
          })
          const obj={
            gridId:this.listQuery.id,
            areaId:this.searchFields[0].value[this.searchFields[0].value.length-1],
            // floorsDtos:JSON.stringify(floorsDtos)
            floorsDtos:floorsDtos
          }

            houseApi.addGridFloor(obj).then((res) => {
              this.getGridFloorList()
              this.getGridInfo()
              this.$message({
                message: res.message || this.$t('common.success'),
                type: 'success'
              })
            })
          this.houseVisible=false
        },
        uploadFile(file){
          return new Promise((resolve, reject) => {
            const formData = new FormData()
            formData.append('file', file.file)
            formData.append('areaId', this.gridDetail.area)
            formData.append('gridId', this.gridDetail.gridId)
            houseApi.exportXls(formData).then((res) => {
              let buf = new Buffer(res).toString();
              //判断大小 小于80即有错误码，判断
              if (buf.length <= 80) {
                this.$message({
                  message: '导入成功',
                  type: 'success'
                })
                this.getGridInfo()
                this.getGridFloorList()
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
          const data = await houseApi.exportTemplate()
          fileDownload(data, `房源网格模板.xls`);
        }
      }

    }
</script>

<style lang="scss" scoped>
.head {
  background: #fff;
  padding: 30px 40px;
    .wgName {
      font-size: 20px;
      font-weight: 600;
    }
  .wgName2{
    font-size: 15px;
    color: #606266;
  }
}
.head:first-child {
  border-bottom: 1px #E8E8E8 solid;
}
  .margin20 {
    margin-bottom: 20px;
  }
  .wgSize {
    font-size: 16px;
    color: #606266;
    text-align: center;
    min-width: 45px;
  }
  .mh {
   min-height: calc(100vh - 124px)
  }
  .mymh {
    height: calc(100vh - 124px);
    overflow-y: auto;
  }
</style>
