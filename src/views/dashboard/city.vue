<template>
  <div id="city" class="pic"></div>

</template>

<script>
export default {
  name: 'city',
  data () {
    return {
      cityInit:null,
      tooltipData:[
        {name:'湖里区',a:'1',b:'2',c:'3',d:'4'},
        {name:'湖里区',a:'1',b:'2',c:'3',d:'4'},
        {name:'湖里区',a:'1',b:'2',c:'3',d:'4'},
        {name:'湖里区',a:'1',b:'2',c:'3',d:'4'},
      ]
    }
  },
  mounted () {
    var option= {
      tooltip: {
        trigger: 'item',
        formatter:(params)=>{
          return this.tooltipData[0].name + '<br/>' +this.tooltipData[0].a ;
        }
      },
      title: [
        {
          text: '镇-村统计各个区域各个用户的占比',
          left: '1.5%',
          top: '0%',
          textStyle: {
            color: '#333',
            fontSize: 18,
            align: 'center'
          }
        }],

      legend: {
        // orient 设置布局方式，默认水平布局，可选值：'horizontal'（水平） ¦ 'vertical'（垂直）
        orient: 'horizontal',
        // x 设置水平安放位置，默认全图居中，可选值：'center' ¦ 'left' ¦ 'right' ¦ {number}（x坐标，单位px）
        right: '40%',
        // y 设置垂直安放位置，默认全图顶端，可选值：'top' ¦ 'bottom' ¦ 'center' ¦ {number}（y坐标，单位px）
        top: 20,
        //  这个字段控制形状  类型包括 circle，rect ，roundRect，triangle，diamond，pin，arrow，none

        // itemWidth: 10, // 设置宽度
        //
        // itemHeight: 10, // 设置高度

        itemGap: 30, // 设置间距,
        data: ['武器库开门', '入库枪支', '出库枪支'],
        // textStyle: {
        //   color: ['#0FEA8A', '#33B1FF', '#FF2756'],
        //   fontSize: 12
        // }
      },

      xAxis: [{
        type: 'category',
        // nameGap: 15,
        boundaryGap: true,
        data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
        // axisLabel: {
        //   textStyle: {
        //     // 文字样式
        //     color: '#333',
        //     fontSize: 14,
        //     padding: [4, 0]
        //   }
        // },

        // axisLine: {
        //   lineStyle: {
        //     color: '#0A2A83' // 左边线的颜色
        //   }
        // },
        // axisTick: {
        //   show: false
        // }

      }],

      yAxis: [
        {
          type: 'value',
          nameGap: 15,
          // boundaryGap: true,
          // axisLine: {
          //   show: true
          // },
          // splitLine: { // gird区域中的分割线
          //   show: true, // 是否显示
          //   lineStyle: {
          //     color: '#0A2A83'
          //   }
          // },
          // axisLabel: {
          //   textStyle: {
          //     color: '#0060FF',
          //     fontSize: 12
          //
          //   },
          // }
        }
      ],
      series: [
        {
          name: '武器库开门',
          type: 'bar',
          data: [4, 2],
          barWidth: 20,
          // barGap: '100%',
          color: '#0FEA8A',
          itemStyle: {
            normal: {
              label: {
                show: true, // 开启显示
                position: 'inside', // 在上方显示
                // textStyle: { // 数值样式
                //   color: '#fff',
                //   fontSize: 9
                // },
                formatter: '{c}'
              }
            }
          }
        },
        {
          name: '入库枪支',
          type: 'bar',
          data: [10, 41],
          barWidth: 20,
          // barGap: '100%',
          color: '#33B1FF',
          itemStyle: {
            normal: {
              label: {
                show: true, // 开启显示
                position: 'inside', // 在上方显示
                // textStyle: { // 数值样式
                //   color: '#fff',
                //   fontSize: 9
                // },
                formatter: '{c}'
              }
            }
          }
        },
        {
          name: '出库枪支',
          type: 'bar',
          data: [18, 41],
          barWidth: 20,
          // barGap: '100%',
          color: '#FF2756',
          itemStyle: {
            normal: {
              label: {
                show: true, // 开启显示
                position: 'inside', // 在上方显示
                // textStyle: { // 数值样式
                //   color: '#fff',
                //   fontSize: 9
                // },
                formatter: '{c}'
              }
            }
          }
        },
        {
          name: '出库枪支',
          type: 'bar',
          data: [18, 41],
          barWidth: 20,
          // barGap: '100%',
          color: '#808080',
          itemStyle: {
            normal: {
              label: {
                show: true, // 开启显示
                position: 'inside', // 在上方显示
                // textStyle: { // 数值样式
                //   color: '#fff',
                //   fontSize: 9
                // },
                formatter: '{c}'
              }
            }
          }
        }
      ]
    }
    this.cityInit = this.$echarts.init(document.getElementById('city')) // 使用刚指定的配置项和数据显示图表。
    this.cityInit.setOption(option)

  }
}
</script>

<style lang="scss" scoped>
.pic {
  height: 350px;
  background: #fff;

}
</style>
