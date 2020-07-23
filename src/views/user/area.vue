<template>
  <div class="app-container">
    <el-table :data="list"  style="width: 100%"
              border fit highlight-current-row stripe
              :tree-props="{children: 'areaList'}"
              row-key="id"
    >
      <el-table-column  align="center" fixed :label="$t('common.serial')">
        <template slot-scope="scope">
          {{ (listQuery.pageNo - 1) * listQuery.pageSize + scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column  align="center" label="区域名称" prop="name"/>

      <el-table-column  align="center" label="区域代码" prop="id">
      </el-table-column>
    </el-table>




  </div>
</template>

<script>

  import {houseApi} from '@/api'
  export default {
    name: "area",
    data(){
      return {

        listLoading: false,
        list: null,
        listQuery: {
          pageNo: 1,
          pageSize: 10
        },
        total: 0,
      }
    },
    created() {
      this.getList()
    },
    methods:{
      async getList(){
        const {result} = await houseApi.getAreaList()
        this.list=result
      }
    }
  }
</script>

<style lang="scss" scoped>


</style>
