<template>
  <div class="app-container">
    <el-row :gutter="40" class="panel-group">
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <el-card shadow="always">
        <div class="card-panel">
          <div class="card-panel-icon-wrapper icon-people">
            <svg-icon icon-class="user" class-name="card-panel-icon"/>
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">
              {{$t('statistics.agentCount')}}
            </div>
            <count-to :start-val="0" :end-val="temp.landlordCount" :duration="1600" class="card-panel-num"/>
          </div>
        </div>
        </el-card>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <el-card shadow="always">
        <div class="card-panel">
          <div class="card-panel-icon-wrapper icon-message">
            <svg-icon icon-class="agent" class-name="card-panel-icon"/>
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">
              {{$t('statistics.departmentStaffCount')}}
            </div>
            <count-to :start-val="0" :end-val="temp.tenantCount" :duration="1500" class="card-panel-num"/>
          </div>
        </div>
        </el-card>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <el-card shadow="always">
        <div class="card-panel">
          <div class="card-panel-icon-wrapper icon-money">
            <svg-icon icon-class="table" class-name="card-panel-icon"/>
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">
              {{$t('statistics.ownerCount')}}
            </div>
            <count-to :start-val="0" :end-val="temp.convertLogCount" :duration="1400" class="card-panel-num"/>
          </div>
        </div>
        </el-card>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <el-card shadow="always">
        <div class="card-panel">
          <div class="card-panel-icon-wrapper icon-shopping">
            <svg-icon icon-class="guide" class-name="card-panel-icon"/>
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">
              {{$t('statistics.outsiderCount')}}
            </div>
            <count-to :start-val="0" :end-val="temp.prizeCount" :duration="1300" class="card-panel-num"/>
          </div>
        </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="40">
       <el-col :xs="24" :sm="24" :lg="12" style="margin-bottom: 32px">
         <el-card shadow="always">
         <Pie ref="Pie" :pieData="pieData" v-if="flag"/>
         </el-card>
       </el-col>
      <el-col :xs="24" :sm="24" :lg="12" style="margin-bottom: 32px">
        <el-card shadow="always" style="position: relative">
        <el-select v-model="days" placeholder="请选择天数" style="position: absolute;right: 110px;top:15px;z-index:100">
          <el-option label="7天" :value="7"/>
          <el-option label="15天" :value="15"/>
          <el-option label="30天" :value="30"/>
        </el-select>
        <Bullet ref="Bullet" :bulletData="bulletData" v-if="flagss"/>
        </el-card>
      </el-col>
    </el-row>
    <el-row>
      <el-col style="margin-bottom: 32px">
      <el-card shadow="always">
      <City ref="City" :cityData="cityData" v-if="flags"/>
      </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import CountTo from 'vue-count-to'
  import {Common} from "@/api";
  import Pie from './pie';
  import City from './city';
  import Bullet from './bullet';
  export default {
    name: 'Dashboard',
    components: {
      CountTo,Pie,Bullet,City
    },
    data() {
      return {
        temp: {
          convertLogCount: 0,
          landlordCount: 0,
          prizeCount: 0,
          tenantCount: 0
        },
        pieData:[],
        flag:true,
        flags:true,
        flagss:true,
        cityData:{},
        bulletData:{},
        days:''
      }
    },
    watch:{
      days(newVal,oldVal){
        this.convertLogStatistics()
      }
    },
    created() {
      this.getStatistics()
      this.personStatisticsResult()
      this.floorSecurityStatistics()
      this.convertLogStatistics()
    },
    mounted() {
      window.onresize = ()=> {
        this.$refs.Pie.pieInit.resize();
        this.$refs.Bullet.histogramInit.resize();
        this.$refs.City.cityInit.resize()
      }
    },
    methods: {
       getStatistics() {
        Common.statistics().then(res => {
          this.temp = res.result
        })
      },
      personStatisticsResult(){
        Common.personStatisticsResult().then(res => {
          const {gridPersonCount,householdCount,landlordCount,ownerCount,subLandlordCount,tenantCount} =res.result
          const pieData=[
            { value: ownerCount, name: '业主' },
            {value: landlordCount, name: '房东' },
            { value:gridPersonCount, name: '理事' },
            { value: tenantCount, name: '租户' },
            { value: householdCount, name: '户主' },
            { value: subLandlordCount, name: '二房东' }
          ]
          this.pieData=pieData
          this.flag=false
          this.$nextTick(()=>{
            this.flag=true
          })
        })
      },
      async floorSecurityStatistics(){
        this.flags=false
        const PidName=[]
        const landlordCount =[]
        const ownerCount=[]
        const gridPersonCount= []
        const tenantCount =[]
         const {result}  = await Common.floorSecurityStatistics()
        result.forEach(item=>{
          PidName.push(item.areaName)
          landlordCount.push(item.landlordCount)
          ownerCount.push(item.ownerCount)
          gridPersonCount.push(item.gridPersonCount)
          tenantCount.push(item.tenantCount)
        })
        this.cityData={
          PidName,landlordCount,ownerCount,gridPersonCount,tenantCount,result
        }
        this.$nextTick(()=>{
          this.flags=true
        })
      },
      async convertLogStatistics(){
        this.flagss=false
        const {result}  = await Common.convertLogStatistics({days:this.days})
        const PidName=[]
        const data=[]
        result.forEach(item=>{
          PidName.push(item.dateTime)
          data.push(item.count)
        })
        this.bulletData={
          data,PidName
        }
        this.$nextTick(()=>{
          this.flagss=true
        })
      }
    },

  }
</script>
<style>

</style>
<style lang="scss" scoped type="text/scss">
  .panel-group {
    margin-top: 18px;

    .card-panel-col {
      margin-bottom: 32px;
    }

    .card-panel {
      height: 108px;
      /*cursor: pointer;*/
      font-size: 12px;
      position: relative;
      overflow: hidden;
      color: #666;
      background: #fff;
      box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
      border-color: rgba(0, 0, 0, .05);

      &:hover {
        .card-panel-icon-wrapper {
          color: #fff;
        }

        .icon-people {
          background: #40c9c6;
        }

        .icon-message {
          background: #36a3f7;
        }

        .icon-money {
          background: #f4516c;
        }

        .icon-shopping {
          background: #34bfa3
        }
      }

      .icon-people {
        color: #40c9c6;
      }

      .icon-message {
        color: #36a3f7;
      }

      .icon-money {
        color: #f4516c;
      }

      .icon-shopping {
        color: #34bfa3
      }

      .card-panel-icon-wrapper {
        float: left;
        margin: 14px 0 0 14px;
        padding: 16px;
        transition: all 0.38s ease-out;
        border-radius: 6px;
      }

      .card-panel-icon {
        float: left;
        font-size: 48px;
      }

      .card-panel-description {
        /*float: right;*/
        font-weight: bold;
        margin: 26px 26px 0 0;
        /*margin-left: 0px;*/
        text-align: right;

        .card-panel-text {
          line-height: 18px;
          color: rgba(0,0,0,0.45);
          font-size: 16px;
          margin-bottom: 12px;
          word-break: keep-all;
        }

        .card-panel-num {
          font-size: 20px;
        }
      }
    }
  }

  @media (max-width: 550px) {
    .card-panel-description {
      display: none;
    }

    .card-panel-icon-wrapper {
      float: none !important;
      width: 100%;
      height: 100%;
      margin: 0 !important;

      .svg-icon {
        display: block;
        margin: 14px auto !important;
        float: none !important;
      }
    }
  }
  /deep/.el-card__body {
    padding: 20px 20px 0;
  }
</style>
