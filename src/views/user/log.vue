<template>
  <div class="app-container">
    <search ref="search" :fields="searchFields" @change="handleSearch"/>
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row stripe style="width: 100%">
      <el-table-column  align="left" fixed :label="$t('common.serial')" width="50px">
        <template slot-scope="scope">
          {{ (listQuery.pageNo - 1) * listQuery.pageSize + scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column  align="left" label="日志内容" prop="logContent"/>

      <el-table-column  align="left" label="IP" prop="ip">
      </el-table-column>
      <el-table-column  align="left" label="日志类型" prop="logType">
        <template slot-scope="scope">
          <el-tag :type="scope.row.logType===1?'':'warning'"> {{scope.row.logType|logType}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column  align="left" label="更新时间" prop="createdAt">
      </el-table-column>
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
  import {anotherApi} from '@/api'
  import {logType} from '@/config/userManage'
  export default {
    name: "index",
    data(){
      return {
        searchFields: [
          {type: 0, label: '日志内容', value: '', options: '', field: 'content'},
          {type: 8, label: '更新时间', value: '', options: '', field: 'time'},
          {type: 1, label: '日志类型', value: '', options: logType, field: 'type'},
        ],
        listLoading: false,
        list: null,
        listQuery: {
          pageNo: 1,
          pageSize: 10
        },
        total: 0,
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
          if(cur.field==='time'){
            acc['startTime'] = cur.value.length?cur.value[0]:''
            acc['endTime'] = cur.value.length>1?cur.value[1]:''
          }else {
            acc[cur.field] = cur.value
          }
          return acc
        }, {...this.listQuery})

        anotherApi.logList(tempSearch).then(res => {
          this.list = res.result.records
          this.total = res.result.total
          this.listLoading = false
        })
      }
    }
  }
</script>

<style lang="scss" scoped>


</style>
