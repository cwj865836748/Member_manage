<template>
  <div id="bullet" class="pic"></div>

</template>

<script>
export default {
  name: 'bullet',
  props: {
    bulletData: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      histogramInit:null
    }
  },
  mounted () {
    const option={
      tooltip : {
        trigger: 'axis', // 触发类型，默认数据触发，可选为：'axis' item
        formatter: '时间：{b} <br/> 兑换次数：{c}'

      },
      title: [
        {
          text: '时间维度兑换次数统计',
          left: '3%',
          top: '0%',
          textStyle: {
            color: 'rgba(0,0,0,.45)',
            fontSize: 18,
            align: 'center'
          }
        }],
        dataZoom: [
        {
          show: true,
          realtime: true,
          height: 10,
          start: 0,
          end: 50
        }
      ],
      xAxis: [{
        type: 'category',
        boundaryGap: true,
        data: this.bulletData.PidName,
        axisLabel: {
          textStyle: {
            // 文字样式
            fontSize: 14
          }
        }
      }],

        yAxis: [
        {
          type: 'value',
          boundaryGap: true,
        }
      ],
        series:[{
          type: 'bar',
          data: this.bulletData.data,
          itemStyle: {
            normal: {
              color: new this.$echarts.graphic.LinearGradient(
                0, 0, 0, 1,
                [
                  {offset: 0, color: '#5EFCE8'},
                  {offset: 1, color: '#736EFE'}
                ]
              )
            }
          },
          barWidth: 30
        }]
    }
    this.histogramInit = this.$echarts.init(document.getElementById('bullet')) // 使用刚指定的配置项和数据显示图表。
    this.histogramInit.setOption(option)

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
