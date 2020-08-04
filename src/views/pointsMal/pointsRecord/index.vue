import fileDownload from "js-file-download";
<template>
  <div class="app-container">

    <search ref="search" :fields="searchFields" @change="handleSearch"/>
    <div class="filter-container">
     <UploadXls :temOut="false" :inExcel="false" :btnShow="true" @upOut="upOut"/>
    </div>
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row stripe style="width: 100%">
      <el-table-column  align="left" fixed :label="$t('common.serial')" width="50px">
        <template slot-scope="scope">
          {{ (listQuery.pageNo - 1) * listQuery.pageSize + scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column  align="left" label="积分栏目" prop="type"/>
      <el-table-column  align="left" label="积分使用" prop="content" width="200px"/>
      <el-table-column  align="left" label="用户" prop="memberName"/>
      <el-table-column  align="left" label="积分" prop="operation">
        <template slot-scope="{row}">
          {{row.operation|operation}}
        </template>
      </el-table-column>
      <el-table-column  align="left" label="所属活动" prop="activityName"/>
      <el-table-column  align="left" label="兑换数量" prop="count"/>
      <el-table-column  align="left" label="更新时间" prop="updatedAt" width="200px"/>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.pageNo"
      :limit.sync="listQuery.pageSize"
      @pagination="getList"
    />
  </div>
</template>

<script>
  import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
  import Search from '@/components/Search'
  import {recordApi} from '@/api'
  import UploadXls from "@/components/Upload/UploadXls";
  import fileDownload from "js-file-download"

  export default {
    name: "index",
    data(){
      return {
        searchFields: [
          {type: 0, label: '积分栏目', value: '', options: '', field: 'type'},
          {type: 0, label: '奖品名称', value: '', options: '', field: 'prizeName'},
          {type: 0, label:'用户', value: '', options: '', field: 'memberName'},
          {type: 0, label:'所属活动', value: '', options: '', field: 'activityName'},
          {type: 8, label:'兑奖时间', value: '', options: '', field: 'time'}
        ],
        listLoading: false,
        list: null,
        listQuery: {
          pageNo: 1,
          pageSize: 10
        },
        total: 0
      }
    },
    components: {Pagination, Search,UploadXls},
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

        recordApi.integralList(tempSearch).then(res => {
          this.list = res.result.records
          this.total = res.result.total
          this.listLoading = false
        })
      },
     async upOut(){
        const data = await recordApi.exportXlsOut()
        fileDownload(data, `积分记录列表.xls`);
      }
    }
  }
</script>

<style lang="scss" scoped>


</style>
