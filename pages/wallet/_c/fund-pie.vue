<template>
  <vue-highcharts :options="optionsData" ref="pieCharts"></vue-highcharts>
</template>

<script>
import VueHighcharts from 'vue2-highcharts'
let pipChart

export default {
  props: {
    options: {
      type: Object,
    },

    width: {
      type: Number,
      default: 550,
    },

    // 饼图数据
    datas: {
      type: Array,
      default: [],
    },

    // 饼图名称
    name: {
      type: String,
      default: 'BCH',
    },

    // 展示的单位BTC、BCH等
    asset: {
      type: String,
    },
  },

  components: {
    VueHighcharts,
  },

  data() {
    return {
      optionsData: this.options || {
        chart: {
          plotBackgroundColor: null,
          plotBorderWidth: null,
          height: '180',
          width: this.width,
          plotShadow: false,
          spacing: [ 0, 50, 20, 0 ],
          events: {
            render: function (event) {
              pipChart = event.target
              const e = pipChart.series[0].data[0]
              if (!e) {
                return
              }
              let money = e.virtual ? 0 : e.y
              money = this.formatterChartTitle(money)
              let fontSize = '16px'
              if (money.length > 8) {
                fontSize = '11px'
              }

              const centerY = pipChart.series[0].center[1]
              const titleHeight = parseInt(pipChart.title.styles.fontSize)
              const centerX = pipChart.series[0].center[0]

              const textCenter = centerX - pipChart.plotWidth / 2

              pipChart.setTitle({
                x: textCenter,
                align: 'center',
                y: centerY + titleHeight / 2 - 15,
                text: '',
                style: {
                  color: e.color,
                  fontSize: fontSize,
                },
              })

              pipChart.setSubtitle({
                y: centerY + titleHeight / 2 + 10,
                text: '',
                x: textCenter,
                align: 'center',
              })
            }.bind(this),
            selection: function (e) {
              let fontSize = '16px'
              let y = e.virtual ? 0 : e.target.y
              y = this.formatterChartTitle(y)
              if (y.length > 8) {
                fontSize = '11px'
              }

              pipChart.setTitle({
                text: y,
                style: {
                  color: e.target.color,
                  fontSize: fontSize,
                },
              })
              pipChart.setSubtitle({
                text: e.target.name,
              })
            },
          },
        },
        credits: {
          enabled: false,
        },

        legend: {
          enabled: true,
          align: 'right',
          floating: true,
          width: 220,
          layout: 'horizontal',
          itemWidth: 100,
          maxHeight: 160,
          verticalAlign: 'middle',
          padding: 8,
          itemStyle: {
            color: '#6f6f6f',
            fontSize: '14px',
            fontFamily: 'PingFangSC',
            fontWeight: 'normal',
          },
          itemMarginTop: 10,
        },
        title: {
          style: {
            fontSize: '16px',
            color: '#52cbca',
          },
          useHtml: true,
          floating: true,
          text: ' ',
        },
        subtitle: {
          text: ' ',
          floating: true,
          style: {
            fontSize: '14px',
            textAlign: 'center',
            color: '#6f6f6f',
          },
        },
        tooltip: {
          pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>',
          enabled: false,
        },

        plotOptions: {
          pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            borderWidth: 0,
            dataLabels: {
              enabled: false,
              format: '<b>{point.name}</b>: {point.percentage:.1f} %',
              style: {
                color:
                  (VueHighcharts.theme &&
                    VueHighcharts.theme.contrastTextColor) ||
                  'black',
              },
            },
            showInLegend: true,
            point: {
              events: {
                mouseOver: function (e) {
                  // 鼠标滑过时动态更新标题
                  let fontSize = '16px'
                  let y = e.target.virtual ? 0 : e.target.y
                  y = this.formatterChartTitle(y)
                  if (y.length > 8) {
                    fontSize = '11px'
                  }

                  pipChart.setTitle({
                    text: y,
                    style: {
                      color: e.target.color,
                      fontSize: fontSize,
                    },
                  })
                  pipChart.setSubtitle({
                    text: e.target.name,
                  })
                }.bind(this),

                mouseOut: function (e) {
                  // 鼠标滑出时动态更新标题
                  pipChart.setTitle({
                    text: '',
                  })
                  pipChart.setSubtitle({
                    text: '',
                  })
                },
                click: function (e) {
                  // 同样的可以在点击事件里处理
                  return false
                },
              },
            },
          },
        },
        series: [
          {
            type: 'pie',
            center: [ 120, '50%' ],
            innerSize: '70%',
            name: this.name,
            colors: [
              '#ffbc32',
              '#52cbca',
              '#a289d2',
              '#4cc3ff',
              '#FF8888',
              '#7CFC00',
              '#FFE4B5',
              '#FFFF00',
              '#f8e71c',
              '#bdd98f',
              '#ff6e6e',
              '#fc9d9c',
              '#9141a1',
              '#4a90e2',
              '#b4db3b',
              '#4d68ff',
              '#c96bd5',
              '#7ed321',
            ],
            data: this.datas,
          },
        ],
      },
      currencyRate: {
        rates: {
          BCH_to_CNY: {
            rate: 1,
          },
          BCH_to_BTC: {
            rate: 1,
          },
          BCH_to_EOS: {
            rate: 1,
          },
          BCH_to_LTC: {
            rate: 1,
          },
        },
      },
    }
  },

  watch: {
    datas(newVal) {
      const pieCharts = this.$refs.pieCharts.getChart()
      if (pieCharts.series && pieCharts.series[0]) {
        pieCharts.series[0].update({
          data: newVal,
        })
      }
    },
  },

  methods: {
    formatterChartTitle(y) {
      let rate = 1
      if (
        this.currencyRate &&
        this.currencyRate.rates &&
        this.currencyRate.rates['BCH_to_' + this.asset]
      ) {
        rate = this.currencyRate.rates['BCH_to_' + this.asset].rate
      }
      if (rate && y) {
        y = `${y}`.decimalMul(rate)
      }
      y = this.toDecimal2(y)
      if (y > 100000) {
        y = this.toDecimal2(y / 10000) + 'w'
      } else {
      }
      y = y + ' ' + this.asset
      return y
    },

    /**
     * 将数字转化成只保留两位小数
     */
    toDecimal2(x) {
      const f = parseFloat(x)
      if (isNaN(f)) {
        return false
      }
      const fr = Math.round(x * 100) / 100
      let s = fr.toString()
      let rs = s.indexOf('.')
      if (rs < 0) {
        rs = s.length
        s += '.'
      }
      while (s.length <= rs + 2) {
        s += '0'
      }
      return s
    },
  },
}
</script>

<style lang="scss" scoped>

</style>
