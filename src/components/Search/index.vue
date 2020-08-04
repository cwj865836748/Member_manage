<!--
  搜索组件封装
  type:0输入框 1选择框 2日期区间 3输入框数字 4特殊选择框
  例子
  searchFields: [
          {type: 0, label: 'common.string', value: '', options: ''},
          {type: 1, label: 'common.sex', value: '', options: Sex},
          {type: 2, label: 'common.createDate', value: '', options: ''},
          {type: 3, label: 'common.number', value: '', options: ''},
          {type: 4, label: 'common.id', value: '', options: ''},
        ],
-->

<template>
  <div v-if="fields.length" class="filter-container">
    <el-form ref="search" :inline="true" size="small" @keyup.enter.native="handleSearch">

      <template v-for="(item,index) in fields">
        <el-form-item v-if="item.type==0" :label="item.label">
          <el-input
            v-model="item.value"
            :placeholder="$t('common.pleaseEnter')"
            clearable
            :disabled="(gridDetail&&!gridDetail.gridName)||false"
          />
        </el-form-item>

        <el-form-item v-if="item.type==1" :label="item.label">
          <el-select
            v-model="item.value"
            :placeholder="$t('common.pleaseSelect')"
            clearable
          >
            <el-option
              v-for="(vo,ko) in item.options"
              :key="ko"
              :label="vo.label"
              :value="vo.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item v-if="item.type==2" :label="item.label">
          <el-date-picker
            v-model="item.value"
            type="datetimerange"
            range-separator="~"
            :start-placeholder="$t('common.startPlhDate')"
            :end-placeholder="$t('common.endPlhDate')"
            clearable
            :editable="false"
            :format="formatDate"
            value-format="timestamp"
          />
        </el-form-item>

        <el-form-item v-if="item.type==3" :label="item.label">
          <el-input
            v-model.number="item.value"
            :placeholder="$t('common.pleaseEnter')"
            clearable
          />
        </el-form-item>

        <el-form-item v-if="item.type==4" :label="item.label">
          <el-select
            v-model="item.value"
            :placeholder="$t('common.pleaseSelect')"
            clearable
            @change="handleSearch"
            filterable
          >

            <el-option
              v-for="(vo,ko) in item.options"
              :key="ko"
              :label="vo.name||vo.title
              ||vo.englishName &&(vo.englishName+'/'+vo.chineseName)
              ||vo.problemCategoryEn&&(vo.problemCategoryEn.title+'/'+vo.problemCategoryZh.title)"

              :value="vo[item.filedValue || 'id']"
            />
          </el-select>
        </el-form-item>
        <el-form-item v-if="item.type==5" :label="item.label">
          <el-select
            v-model="item.value"
            :placeholder="$t('common.pleaseSelect')"
            clearable
            @change="handleSearch"
            multiple
          >
            <el-option
              v-for="(vo,ko) in item.options"
              :key="ko"
              :label="vo.label"
              :value="vo.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item v-if="item.type==6" :label="item.label">
          <el-cascader
            style="width: 260px"
            v-model="item.value"
            :options="areaOptions"
            :props="defaultProps"
            :disabled="item.disabled||false"
            ></el-cascader>
        </el-form-item>
        <el-form-item v-if="item.type==7" :label="item.label">
          <el-select
            v-model="item.value"
            filterable
            remote
            reserve-keyword
            placeholder="请输入关键词"
            :remote-method="remoteMethod"
            :loading="selectLoading">
            <el-option
              v-for="item in gridPersonOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="item.type==8" :label="item.label">
          <el-date-picker
            v-model="item.value"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd HH:mm:ss"
            :default-time="['00:00:00', '23:59:59']"
          >
          </el-date-picker>
        </el-form-item>
      </template>

      <el-form-item>
        <el-button :disabled="(gridDetail&&!gridDetail.gridName)||false" class="filter-item" type="primary" @click="handleSearch">
          查询
        </el-button>
        <el-button :disabled="(gridDetail&&!gridDetail.gridName)||false" class="filter-item" @click="handleReset">
          重置
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import {formatDate} from '@/config/base'
  import {houseApi} from '@/api'

  export default {
    props: {
      fields: {
        type: Array,
        default: null
      },
      gridDetail:{
        type: Object,
        default: null
      },
      firstDisable:{
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        formatDate,
        defaultProps: {
          children: 'areaList',
          label: 'name',
          value:'id',
          checkStrictly:this.firstDisable,
          expandTrigger: 'hover'
        },
        selectLoading:false,
        gridPersonOptions:[],
        areaOptions:[]
      }
    },
    created() {
      this.getTree()
    },
    mounted() {
    },
    methods: {
      /**
       * 搜索
       */
      handleSearch() {
        this.$emit('change')
      },
      /**
       * 重置
       */
      handleReset() {
        this.fields.map(v => {
          if (v.type == 5) {
            v.value = []
          }else if(v.disabled){
          }
          else {
            v.value = ''
          }
        })
        this.$emit('change')
      },
      remoteMethod(query){
        this.selectLoading = true;
        const list = []
        houseApi.getAllRole(query).then(re=>{
          this.selectLoading = false;
          re.result&&re.result.forEach(item=>{
            let obj ={
              label:item.name,
              value:item.id
            }
            list.push(obj)
          })
          this.gridPersonOptions=list
        })
      },
      //获取树
      async getTree(){
        const type = this.fields.some(item=> item.type === 6)
        if (!type){
          return
        }
        const {code,result} = await houseApi.getAreaList()
        if (code===200){
          this.areaOptions=this.getTreeData(result)
          this.$emit('getArea',this.areaOptions)
        }
      },
      getTreeData(data){
        // 循环遍历json数据
        for(var i=0;i<data.length;i++){
          if(this.firstDisable&&data[i].id===this.$store.state.user.userInfo.area&&this.$store.state.user.userInfo.username!=='synbop'){
            data[i].disabled=true
          }
          if(data[i].areaList&&data[i].areaList.length<1){
            // children若为空数组，则将children设为undefined
            data[i].areaList=undefined;
          }else {
            // children若不为空数组，则继续 递归调用 本方法
            this.getTreeData(data[i].areaList);
          }
        }
        return data;
      },
    }
  }
</script>
<style lang="scss" scoped>
</style>
