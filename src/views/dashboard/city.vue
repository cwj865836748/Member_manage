<template>
  <div id="city" class="pic"></div>

</template>

<script>
export default {
  name: 'city',
  props:{
    cityData:{
      type:Object,
      default:null
    }
  },

  data () {
    return {
      cityInit:null
    }
  },
  mounted () {
    let color = [
      '#ff5454','#ffd200','#00b4ff','#00eacb']
    let option= {

      tooltip: {
        trigger: 'item',
        confine:true,
        //extraCssText:'height:600px;',
        formatter:(params)=>{
          let icon  =`<div style='background: ${color[0]};height: 8px;width: 8px;margin-top:7px;margin-left: 10px;display: inline-block'></div>`
          let icon1  =`<div style='background: ${color[1]};height: 8px;width: 8px;margin-top:7px;margin-left: 10px;display: inline-block'></div>`
          let icon2  =`<div style='background: ${color[2]};height: 8px;width: 8px;margin-top:7px;margin-left: 10px;display: inline-block'></div>`
          let icon3  =`<div style='background: ${color[3]};height: 8px;width: 8px;margin-top:7px;margin-left: 10px;display: inline-block'></div>`
           let tip=''
          this.cityData.result[params.dataIndex].villageFloor.forEach(item=>{
            const title = item.areaName+icon+item.ownerCount+icon1+item.landlordCount+icon2+item.gridPersonCount+icon3+item.tenantCount+'<br>'
            tip=tip+title
          })
          return  tip
        }
      },
      title: [
        {
          text: '镇-村统计各个区域各个用户的占比',
          left: '1.5%',
          top: '0%',
          textStyle: {
            color: 'rgba(0,0,0,.45)',
            fontSize: 18,
            align: 'center'
          }
        }],
      // dataZoom: [
      //   {
      //     show: true,
      //     realtime: true,
      //     height: 10,
      //     start: 0,
      //     end: 50
      //   }
      // ],

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
        data: ['业主数量', '房东数量', '理事数量', '租户数量'],
        // textStyle: {
        //   color: ['#0FEA8A', '#33B1FF', '#FF2756'],
        //   fontSize: 12
        // }
      },

      xAxis: [{
        type: 'category',
        // nameGap: 15,
        boundaryGap: true,
        data: this.cityData.PidName,
        axisLabel: {
          textStyle: {
            // 文字样式
            fontSize: 14,
            // padding: [4, 0]
          }
        }
      }],

      yAxis: [
        {
          type: 'value',
          nameGap: 15
        }
      ],
      series: [
        {
          name: '业主数量',
          type: 'bar',
          data: this.cityData.ownerCount,
          barWidth: 20,
          // barGap: '100%',
          itemStyle: {
            normal: {
              label: {
                show: true, // 开启显示
                position: 'top', // 在上方显示
                formatter: (params)=>{
                  if (params.value>0){
                    return params.value
                  }else {
                    return ''
                  }
                }
              },
              color: color[0]
            }
          }
        },
        {
          name: '房东数量',
          type: 'bar',
          data: this.cityData.landlordCount,
          barWidth: 20,
          // barGap: '100%',
          itemStyle: {
            normal: {
              label: {
                show: true, // 开启显示
                position: 'top', // 在上方显示
                formatter: (params)=>{
                  if (params.value>0){
                    return params.value
                  }else {
                    return ''
                  }
                }
              },
              color: color[1]
            }
          }
        },
        {
          name: '理事数量',
          type: 'bar',
          data: this.cityData.gridPersonCount,
          barWidth: 20,
          // barGap: '100%',
          itemStyle: {
            normal: {
              label: {
                show: true, // 开启显示
                position: 'top', // 在上方显示
                formatter: (params)=>{
                  if (params.value>0){
                    return params.value
                  }else {
                    return ''
                  }
                }
              },
            color:color[2]
            }
          }
        },
        {
          name: '租户数量',
          type: 'bar',
          data: this.cityData.tenantCount,
          barWidth: 20,
          // barGap: '100%',
          itemStyle: {
            normal: {
              label: {
                show: true, // 开启显示
                position: 'top', // 在上方显示
                // textStyle: { // 数值样式
                //   color: '#fff',
                //   fontSize: 9
                // },
                formatter: (params)=>{
                  if (params.value>0){
                    return params.value
                  }else {
                    return ''
                  }
                }
              },
              color:color[3]
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
  height: 450px;
  background: #fff;

}
</style>
