<template>
  <div class="app-container">

    <search ref="search" :fields="searchFields" @change="handleSearch" :firstDisable="true"/>

    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row stripe style="width: 100%">
      <el-table-column  align="left" fixed :label="$t('common.serial')" width="50px">
        <template slot-scope="scope">
          {{ (listQuery.pageNo - 1) * listQuery.pageSize + scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column  align="left" label="所属区域" prop="county"/>
      <el-table-column  align="left" label="乡镇街道" prop="town"/>
      <el-table-column  align="left" label="居村委" prop="village"/>
      <el-table-column  align="left" label="详细地址" prop="address"/>
      <el-table-column  align="left" label="网格" prop="gridName"/>
      <el-table-column  align="left" label="理事" prop="gridPersonName"/>
      <el-table-column  align="left" label="住户数量" prop="residentCount"/>
      <el-table-column  align="left" label="安全消防等级" prop="securityLevel">
        <template slot-scope="{row}">
          <el-tag :type="row.securityLevel==='绿色'?'success':(row.securityLevel==='红色'?'danger':(row.securityLevel==='黄色'?'warning':'info'))"> {{row.securityLevel}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column  align="left" label="操作" prop="cz">
        <template slot-scope="{row}">
          <el-button size="small" @click="handleView(row)">
            查看
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
  </div>
</template>

<script>
  import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
  import Search from '@/components/Search'
  import {houseListApi} from '@/api'
  export default {
    name: "index",
    data(){
      return {
        searchFields: [
          {type: 6, label: '所属区域', value: [], options: [], field: 'areaId'},
          {type: 0, label: '详细地址', value: '', options: '', field: 'address'},
          {type: 0, label:'网格', value: '', options: '', field: 'gridName'},
          {type: 0, label:'理事', value: '', options: '', field: 'personName'}
        ],
        listLoading: false,
        list: null,
        listQuery: {
          pageNo: 1,
          pageSize: 10,
          personName:''
        },
        total: 0
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
          if(cur.field==='areaId'){
            acc[cur.field] = cur.value.length?cur.value[cur.value.length-1]:''
          }else {
            acc[cur.field] = cur.value
          }

          return acc
        }, {...this.listQuery})

        houseListApi.list(tempSearch).then(res => {
          this.list = res.result.records
          this.total = res.result.total
          this.listLoading = false
        })
      },
      handleView(row){
        sessionStorage.setItem('house',JSON.stringify(row))
        this.$router.push({
          path:'/houseManage/detail'
        })

      }
    }
  }
</script>

<style lang="scss" scoped>


</style>
