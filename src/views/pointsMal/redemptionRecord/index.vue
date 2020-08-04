<template>
  <div class="app-container">

    <search ref="search" :fields="searchFields" @change="handleSearch"/>

    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row stripe style="width: 100%">
      <el-table-column  align="left" fixed :label="$t('common.serial')" width="50px">
        <template slot-scope="scope">
          {{ (listQuery.pageNo - 1) * listQuery.pageSize + scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column  align="left" label="兑换码" prop="code"/>
      <el-table-column  align="left" label="奖品名称" prop="prizeName"/>
      <el-table-column  align="left" label="兑换用户" prop="memberName"/>
      <el-table-column  align="left" label="所属活动" prop="activityName"/>
      <el-table-column  align="left" label="兑换数量" prop="count"/>
      <el-table-column  align="left" label="兑奖时间" prop="createdAt" width="200px"/>
      <el-table-column  align="left" label="状态" prop="status" width="150px">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status?'success':(scope.row.status===1?'info':'danger')"> {{scope.row.status|redemptionType}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column  align="left" label="操作">
        <template slot-scope="{row}">
          <el-button v-if="row.status===0" type="primary" size="small" @click="handleRedeem(row)">
            兑奖
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
  import {recordApi} from '@/api'
  import {redemptionType} from '@/config/userManage'
  export default {
    name: "index",
    data(){
      return {
        searchFields: [
          {type: 0, label: '兑奖码', value: '', options: '', field: 'code'},
          {type: 0, label: '奖品名称', value: '', options: '', field: 'prizeName'},
          {type: 0, label:'兑奖用户', value: '', options: '', field: 'memberName'},
          {type: 1, label:'状态', value: '', options: redemptionType, field: 'status'},
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

        recordApi.redempitonList(tempSearch).then(res => {
          this.list = res.result.records
          this.total = res.result.total
          this.listLoading = false
        })
      },
      handleRedeem(row){
        this.$confirm('是否领取该奖品？', {
          confirmButtonText: this.$t('common.confirm'),
          cancelButtonText: this.$t('common.cancel'),
          type: 'warning'
        }).then(() => {
          recordApi.convertAction({id:row.id}).then(res => {
            if(res.code===200){
              this.$message.success('兑奖成功')
              this.getList()
            }
          })
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
