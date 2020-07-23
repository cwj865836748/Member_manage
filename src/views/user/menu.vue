<template>
  <div class="app-container">
    <el-table :data="list"  style="width: 100%"
              border fit highlight-current-row stripe
              :tree-props="{children: 'menus'}"
              row-key="id"
    >
      <el-table-column  align="center" fixed :label="$t('common.serial')">
        <template slot-scope="scope">
          {{ (listQuery.pageNo - 1) * listQuery.pageSize + scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column  align="center" label="菜单名称" prop="name"/>

      <el-table-column  align="center" label="菜单类型" prop="menuType">
      </el-table-column>
      <el-table-column  align="center" label="路径" prop="updatedAt">
      </el-table-column>
      <el-table-column  align="center" label="排序" prop="sortNo">
      </el-table-column>
    </el-table>




  </div>
</template>

<script>

  import {anotherApi} from '@/api'
  export default {
    name: "index",
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
          const {result} = await anotherApi.menuList()
          this.list=result
      }
    }
  }
</script>

<style lang="scss" scoped>


</style>
