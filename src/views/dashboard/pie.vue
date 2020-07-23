<template>
  <div id="roundEcharts" class="pic"></div>
</template>

<script>
export default {
  name: 'pie',
  data () {
    return {
      pieInit:null,
      pieData:[
        {value: 12, name: '房东' },
        { value: 12, name: '理事' },
        { value: 1, name: '租户' },
        { value: 1, name: '户主' }
      ]

    }
  },

  mounted () {
    let options= {
      title: [
        {
          text: '用户占比统计',
          left: '3%',
          top: '0%',
          textStyle: {
            color: '#333',
            fontSize: 18,
            align: 'center'
          }
        }],
        // 环形颜色
        color: ['#9B6BFF', '#FF2756', '#FF8C00', '#33B1FF'],
        legend: {

        orient: 'vertical',
          itemWidth: 15,//宽
          itemHeight: 10,//高
          itemGap: 40,//图例之间的间距
          left: '70%',  //图例距离左的距离
          y: 'center',  //图例上下居中
          icon:"circle",
          data: ["房东","理事","租户","户主"],
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
          radius: ['45%', '75%'],
          center: ['50%', '50%'],
          label: {
            normal: {
              position: 'inner',
              show: false
            }
          },
          data: this.pieData
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
