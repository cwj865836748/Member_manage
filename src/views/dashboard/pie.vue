<template>
  <div id="roundEcharts" class="pic"></div>
</template>

<script>
export default {
  name: 'pie',
  data () {
    return {
      pieInit:null
    }
  },
 props:{
   pieData:{
     type:Array,
     default:[]
   }
 },
  mounted () {
    let options= {
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c} ({d}%)'
      },
      title: [
        {
          text: '用户占比统计',
          left: '3%',
          top: '0%',
          textStyle: {
            color: 'rgba(0,0,0,.45)',
            fontSize: 18,
            align: 'center'
          }
        }],
        // 环形颜色
      color: ['#ff5454','#ffd200','#00b4ff','#00eacb','#954eff','#1c68da'],
        legend: {

        orient: 'vertical',
          itemWidth: 15,//宽
          itemHeight: 10,//高
          itemGap: 20,//图例之间的间距
          right: '5%',  //图例距离左的距离
          y: 'center',  //图例上下居中
          icon:"circle",
          data: ["业主","房东","理事","租户","户主","二房东"],
          textStyle: { //图例文字的样式
            fontSize: 14
          },
          formatter:(name)=>{
          let target;
          for(let i=0;i<this.pieData.length;i++){
            if(this.pieData[i].name===name){
              target=this.pieData[i].value
            }
          }

          return `${name}:${target} `

        },
      },
      series: [

        {
          name: '用户占比统计',
          type: 'pie',
          radius: ['55%', '85%'],
          center: ['50%', '50%'],
          // itemStyle: {
          //   normal: {
          //     color: (params)=> {
          //       let colorList = [
          //         {
          //           c1: '#FEB692',
          //           c2: '#EA5455' //业主
          //         },
          //         {
          //           c1: '#FDEB71',
          //           c2: '#F8D800'//房东
          //         },
          //         {
          //           c1: '#ABDCFF',//理事
          //           c2: '#0396FF'
          //         },
          //         {
          //           c1: '#81FBB8',//租户
          //           c2: '#28C76F'
          //         },
          //         {
          //           c1: '#CE9FFC',//户主
          //           c2: '#7367F0'
          //         },
          //         {
          //           c1: '#FCCF31',//二房东
          //           c2: '#F55555'
          //         }]
          //       return new this.$echarts.graphic.LinearGradient(1, 0, 0, 0, [{ //颜色渐变函数 前四个参数分别表示四个位置依次为左、下、右、上
          //
          //         offset: 0,
          //         color: colorList[params.dataIndex].c1
          //       }, {
          //         offset: 1,
          //         color: colorList[params.dataIndex].c2
          //       }])
          //       /*  return colorList[params.dataIndex]*/
          //     }
          //   }
          // },
          itemStyle: { // 此配置
            normal: {
              borderWidth: 2,
              borderColor: '#ffffff',
            },
            // emphasis: {
            //   borderWidth: 0,
            //   shadowBlur: 10,
            //   shadowOffsetX: 0,
            //   shadowColor: 'rgba(0, 0, 0, 0.5)'
            // }
          },
          label: {
            normal: {
              position: 'inner',
              show: false
            }
          },
          data: this.pieData,

        }
      ]
    }
    this.pieInit= this.$echarts.init(document.getElementById('roundEcharts'))
    // 绘制图表，this.echarts1_option是数据
    this.pieInit.setOption(options)
  },
  methods: {
  }

}
</script>

<style lang="scss" scoped>
  .pic {
    height: 300px;
    background: #fff;
    margin-bottom: 32px;
  }
</style>
