const webpack = require('webpack')
// const path = require('path')
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
// const StatsWriterPlugin = require('webpack-stats-plugin').StatsWriterPlugin
const {I18nPlugin} = require('./i18n-auto-loader-dev/i18n-autotrans-loader/index')

module.exports = {
  /*
   ** Headers of the page
   */
  head: {
    title: 'CoinEx OTC',
    meta: [
      {charset: 'utf-8'},
      {
        renderer: 'webkit'
      },
      {
        name: 'format-detection',
        content: 'telephone=no'
      },
      {name: 'viewport', content: 'width=1200'},
      {'http-equiv': 'X-UA-Compatible', content: 'IE=edge'},
      {
        hid: 'description',
        name: 'description',
        content:
          'CoinEx OTC'
      },
      {
        hid: 'keywords',
        name: 'keywords',
        content:
          '比特币，以太坊，买卖比特币，交易所，数字货币，虚拟货币，Bitcoin, BTC, Litecoin, LTC, Ethereum, ETH, Zcash, ZEC, buy Bitcoin, sell Bitcoin, exchange, trading, cryptocurrency, digital asset'
      }
    ],
    link: [
      {rel: 'icon', type: 'image/ico', sizes: '48x48', href: '/favicon.ico'}
    ]
  },
  render: {
    gzip: true,
    resourceHints: false,       // 可以禁用prefetch/preload，prefetch太消耗带宽了... todo:仅仅禁止prefetch就够了，preload不应该禁止
  },
  watchers: {
    chokidar: {
      paths: '*.json',
      usePolling: true,
      useFsEvents: false
    }
  },
  router: {
    middleware: ['i18n', 'webp'],
    extendRoutes(routes) {
      // 把_c开头的文件、目录过滤掉，这些是页面相关组件，不生成路由
      for (let i = 0; i < routes.length; i++) {
        let route = routes[i]

        if (route.component.match(/\/_c/)) {
          routes.splice(i, 1)
        }
      }
    }
  },
  /*
   ** Global CSS
   */
  css: [
    {src: '~assets/scss/global.scss', lang: 'scss'},
    // { src: '~assets/scss/font-awesome.min.css', lang: 'css' }
  ],

  performance: {
    prefetch: false,                // 这种禁止prefetch方式没卵用...
  },
  /*
   ** Customize the progress-bar color
   */
  loading: '~/components/loading.vue',

  modules: [
    'bootstrap-vue/nuxt'
  ],
  /*
   ** Build configuration
   */
  build: {
    // ssr: {
    //   inject: false,
    //   shouldPrefetch: () => false,      // prefetch会load大量的资源，实际上很多都没用到，暂时先禁用掉吧
    // cache: require("lru-cache")({
    //   max: 1000,
    //   maxAge: 1000 * 60 * 15
    // })
    // },
    extractCSS: true,
    /*
     ** Run ESLINT on save
     */
    // publicPath: "http://cdn.otc.coinex.com/_nuxt/",
    filenames: {
      manifest: 'manifest.[hash:7].js',
      css: 'style.[chunkhash:7].css',
      vendor: 'vendor.[chunkhash:7].js',
      app: 'otc.[hash:7].js',
      chunk: '[name].[chunkhash:7].js'
    },
    vendor: ['babel-polyfill', 'axios'],
    extend(webpackConfig, ctx) {
      // spritesmith
      webpackConfig.resolve = webpackConfig.resolve || {modules: []}
      // webpackConfig.resolve.modules.push('spritesmith-generated')

      webpackConfig.plugins = webpackConfig.plugins || []
      webpackConfig.devtool = false
      // config.plugins.push(
      //   new HappyPack({
      //     id: "vue",
      //     threads: 4,
      //     loaders: ["vue-loader", "i18n-cn-autotrans-loader"]
      //   })
      // );
      // config.plugins.push(
      //   new HappyPack({
      //     id: "babel",
      //     threads: 4,
      //     loaders: ["babel-loader?presets[]=es2015"]
      //   })
      // );
      // plugins

      // 暂时好像用不上sprite jeffjing 20180427
      // webpackConfig.plugins.push(
      //   new SpritesmithPlugin({
      //     src: {
      //       cwd: path.resolve(__dirname, 'assets/img/concat'),
      //       glob: '**/*.png'
      //     },
      //     target: {
      //       image: path.resolve(__dirname, 'assets/spritesmith/sprite.png'),
      //       css: path.resolve(__dirname, 'assets/spritesmith/sprite.scss')
      //     },
      //     retina: '@2x',
      //     apiOptions: {
      //       cssImageRef: '~assets/spritesmith/sprite.png'
      //     }
      //   })
      // )

      // style/css loader
      // config.module.rules[0].loader = "happypack/loader?id=vue";
      // config.module.rules[0].options.id = "vue";
      // config.module.rules[1].loader = "happypack/loader?id=babel";
      // config.module.rules[1].options.id = "babel";

      // config.module.rules.push(
      //   {
      //     test: /\.css$/,
      //     loader: ["style-loader", "css-loader"]
      //   },
      //   {
      //     test: /\.scss$/,
      //     loader: ["style-loader", "css-loader", "sass-loader"]
      //   }
      // );

      webpackConfig.plugins.push(new webpack.DefinePlugin({
        'process.env': {
          MODE: `"${process.env.MODE}"`
        }
      }))
      webpackConfig.plugins.push(new webpack.ProvidePlugin({
        Vue: 'vue'
      }))
      // webpackConfig.plugins.push(new StatsWriterPlugin({
      //   filename: 'stats.json' // Default
      // }))
      // webpackConfig.plugins.push(new BundleAnalyzerPlugin({
      //   generateStatsFile: true,
      // }))
      // webpackConfig.profile = true

      webpackConfig.module.rules.push({
        test: /\.(jpe?g|png|svg|gif)$/,
        loader: ['srcset-loader'],
        exclude: /(node_modules)/,
        resourceQuery: /[?&](sizes|placeholder)(=|&|\[|$)/
      })

      if (ctx.isClient) {
        // webpackConfig.module.rules.push({
        //   enforce: 'pre',
        //   test: /\.(js|vue)$/,
        //   loader: ['eslint-loader'],
        //   exclude: /(node_modules)/
        // })
      }

      if (!ctx.dev) {
        // 生产环境，图片压缩
        webpackConfig.module.rules.push({
          test: /\.(gif|png|jpe?g|svg)$/i,
          // test: /\.(gif|svg)$/i,
          loaders: [
            {
              loader: 'image-webpack-loader',
              query: {
                pngquant: {
                  quality: '65-90',
                  speed: 4,
                  optimizationLevel: 7,
                  interlaced: true
                },
                gifsicle: {
                  optimizationLevel: 7
                },
                mozjpeg: {
                  progressive: true,
                  // optimizationLevel: 3,
                  quality: 80
                }
              }
            }
          ]
        })
        /**
         * 生成webp文件
         */
        webpackConfig.module.rules.push({
          test: /\.(png|jpe?g)$/,
          loader: 'viawebp-loader',
          enforce: 'post',
          options: {
            expose: 'default', // webp、all、default
            name: 'img/[name].[hash:7].[ext]',
            webp: {
              quality: 75
            }
          }
        })
      }

      // 多语言自动替换
      // webpackConfig.module.rules.unshift({
      //   test: /\.vue$/,
      //   exclude: [/node_modules/, /\.nuxt/, /Privacy(.{2})\.vue/, /Service(.{2})\.vue/],
      //   loader: 'i18n-cn-autotrans-loader',
      //   enforce: 'pre',
      //   options: {
      //     hashLength: 4,
      //     repeatFlag: '\\[R\\]',
      //     writeFile: false, // 第一次生成用true，之后改为false
      //     root: 'locales',
      //     prefix: '',
      //     originalLang: 'zh_Hans_CN',
      //     targetLangs: ['zh_Hant_HK', 'en_US'],
      //     deprecatedMark: '****DEPRECATED****',
      //     cacheTime: 5000
      //   }
      // })
      // 指定使用loader的文件类型
      const vueLoader = webpackConfig.module.rules.find((rule) => rule.loader === 'vue-loader')
      vueLoader.options.postLoaders = {
        js: 'i18n-autotrans-loader?SFC=script',
        html: 'i18n-autotrans-loader?SFC=template'
      }

      // i18n未正式发布，先放在项目底下引用
      webpackConfig.resolveLoader = {
        modules: ['node_modules', 'i18n-auto-loader-dev']
      }

      // i18n auto loader 配套的 plugin
      webpackConfig.plugins.push(new I18nPlugin({
        replacerMap: {
          'vueScript': '$t_i18n',
        },
        writeFile: !!ctx.dev
      }))
    }
  },

  plugins: [
    '~/plugins/polyfill',
    '~/plugins/cookies',
    {src: '~/plugins/i18n'},
    // {src: '~/plugins/quill', ssr: false},
    {src: '~/plugins/axios'},
    {src: '~/plugins/ga', ssr: false},
    // {src: '~/plugins/datepolyfill', ssr: false},
    {src: '~/plugins/webp'},
    // { src: "~/plugins/amap", ssr: false },
    // {src: '~/plugins/clipboards', ssr: false},
    // {src: '~/plugins/captcha', ssr: false},
    {src: '~/plugins/utils'},
    {src: '~/plugins/modal', ssr: false},
    {src: '~/plugins/tips', ssr: false},
    {src: '~/plugins/vue-components'},
    // { src: '~/plugins/vuelidate' }
  ]
}
