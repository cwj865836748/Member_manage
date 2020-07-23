<template>
  <div id="bullet" class="pic"></div>

</template>

<script>
export default {
  name: 'bullet',
  data () {
    return {
      histogramInit:null,
      option: {
        tooltip: {
          trigger: 'axis'
        },
        title: [
          {
            text: '时间维度兑换次数统计',
            left: '3%',
            top: '0%',
            textStyle: {
              color: '#333',
              fontSize: 18,
              align: 'center'
            }
          }],

        // legend: {
        //   // orient 设置布局方式，默认水平布局，可选值：'horizontal'（水平） ¦ 'vertical'（垂直）
        //   orient: 'horizontal',
        //   // x 设置水平安放位置，默认全图居中，可选值：'center' ¦ 'left' ¦ 'right' ¦ {number}（x坐标，单位px）
        //   right: 40,
        //   // y 设置垂直安放位置，默认全图顶端，可选值：'top' ¦ 'bottom' ¦ 'center' ¦ {number}（y坐标，单位px）
        //   top: 20,
        //   icon: 'circle', //  这个字段控制形状  类型包括 circle，rect ，roundRect，triangle，diamond，pin，arrow，none
        //
        //   itemWidth: 10, // 设置宽度
        //
        //   itemHeight: 10, // 设置高度
        //
        //   itemGap: 30, // 设置间距,
        //   data: ['武器库开门', '入库枪支', '出库枪支'],
        //   textStyle: {
        //     color: ['#0FEA8A', '#33B1FF', '#FF2756'],
        //     fontSize: 12
        //   }
        // },

        xAxis: [{
          type: 'category',

          boundaryGap: true,
          data: ['A库房', 'B库房'],

        }],

        yAxis: [
          {
            type: 'value',
            boundaryGap: true,
          }
        ],
        series: [
          {
            name: '武器库开门',
            type: 'bar',
            data: [4, 2],
            barWidth: 12,
            color: '#0FEA8A',
          },
          {
            name: '入库枪支',
            type: 'bar',
            data: [10, 41],
            barWidth: 12,
            barGap: '100%',
            color: '#33B1FF',
          },
          {
            name: '出库枪支',
            type: 'bar',
            data: [18, 41],
            barWidth: 12,
            barGap: '100%',
            color: '#FF2756',
          }
        ]
      }
    }
  },
  mounted () {
    this.histogramInit = this.$echarts.init(document.getElementById('bullet')) // 使用刚指定的配置项和数据显示图表。
    this.histogramInit.setOption(this.option)

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
