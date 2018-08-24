const webpack = require('webpack')
const {I18nPlugin} = require('./i18n-auto-loader-dev/i18n-autotrans-loader/index')

module.exports = {
  // Headers of the page
  head: {
    title: 'CoinEx OTC',
    meta: [
      {charset: 'utf-8'},
      {
        renderer: 'webkit',
      },
      {
        name: 'format-detection',
        content: 'telephone=no',
      },
      {name: 'viewport', content: 'width=1200'},
      {'http-equiv': 'X-UA-Compatible', content: 'IE=edge'},
      {
        hid: 'description',
        name: 'description',
        content:
          'CoinEx OTC',
      },
      {
        hid: 'keywords',
        name: 'keywords',
        content:
          '比特币，以太坊，买卖比特币，交易所，数字货币，虚拟货币，Bitcoin, BTC, Litecoin, LTC, Ethereum, ETH, Zcash, ZEC, buy Bitcoin, sell Bitcoin, exchange, trading, cryptocurrency, digital asset',
      },
    ],
    link: [
      {rel: 'icon', type: 'image/ico', sizes: '48x48', href: '/favicon.ico'},
      {
        rel: 'stylesheet',
        type: 'text/css',
        charset: 'utf-8',
        href: '//cdnjs.cloudflare.com/ajax/libs/10up-sanitize.css/6.0.0/sanitize.min.css'
      },
    ],
  },
  render: {
    gzip: true,
    resourceHints: false, // 可以禁用prefetch/preload，prefetch太消耗带宽了... todo:仅仅禁止prefetch就够了，preload不应该禁止
  },
  watchers: {
    chokidar: {
      paths: '*.json',
      usePolling: true,
      useFsEvents: false,
    },
  },
  router: {
    middleware: ['i18n', 'webp'],
    extendRoutes(routes) {
      // 把_c开头的文件、目录过滤掉，这些是页面相关组件，不生成路由
      for (let i = 0; i < routes.length; i++) {
        const route = routes[i]

        if (route.component.match(/\/_c/)) {
          routes.splice(i, 1)
        }
      }
    },
  },
  /*
   ** Global CSS
   */
  css: [
    {src: '~assets/scss/global.scss', lang: 'scss'},
  ],

  performance: {
    prefetch: false, // 这种禁止prefetch方式没卵用...
  },
  /*
   ** Customize the progress-bar color
   */
  loading: '~/components/loading.vue',

  modules: [
    'bootstrap-vue/nuxt',
  ],
  /*
   ** Build configuration
   */
  build: {
    extractCSS: true,
    /*
     ** Run ESLINT on save
     */
    filenames: {
      manifest: 'manifest.[hash:7].js',
      css: 'style.[chunkhash:7].css',
      vendor: 'vendor.[chunkhash:7].js',
      app: 'otc.[hash:7].js',
      chunk: '[name].[chunkhash:7].js',
    },
    vendor: ['babel-polyfill', 'axios'],
    extend(webpackConfig, { isDev }) {
      // spritesmith
      webpackConfig.resolve = webpackConfig.resolve || {modules: []}

      webpackConfig.plugins = webpackConfig.plugins || []
      webpackConfig.devtool = false

      webpackConfig.plugins.push(new webpack.DefinePlugin({
        'process.env': {
          MODE: `"${process.env.MODE}"`,
        },
      }))
      webpackConfig.plugins.push(new webpack.ProvidePlugin({
        Vue: 'vue',
      }))

      webpackConfig.module.rules.push({
        test: /\.(jpe?g|png|svg|gif)$/,
        loader: ['srcset-loader'],
        exclude: /(node_modules)/,
        resourceQuery: /[?&](sizes|placeholder)(=|&|\[|$)/,
      })

      if (!isDev) {
        // 生产环境，图片压缩
        webpackConfig.module.rules.push({
          test: /\.(gif|png|jpe?g|svg)$/i,
          loaders: [
            {
              loader: 'image-webpack-loader',
              query: {
                pngquant: {
                  quality: '65-90',
                  speed: 4,
                  optimizationLevel: 7,
                  interlaced: true,
                },
                gifsicle: {
                  optimizationLevel: 7,
                },
                mozjpeg: {
                  progressive: true,
                  quality: 80,
                },
              },
            },
          ],
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
              quality: 75,
            },
          },
        })
      }

      // 对js文件也进行翻译
      const jsLoader = webpackConfig.module.rules.find(rule => rule.loader === 'babel-loader')

      if (jsLoader) {
        jsLoader.use = [{
          loader: 'babel-loader',
          options: jsLoader.options,
        }, {
          loader: 'i18n-autotrans-loader'
        }]

        delete jsLoader.loader
        delete jsLoader.options
      }

      // 指定使用loader的文件类型
      const vueLoader = webpackConfig.module.rules.find((rule) => rule.loader === 'vue-loader')
      vueLoader.options.postLoaders = {
        js: 'i18n-autotrans-loader?SFC=script',
        html: 'i18n-autotrans-loader?SFC=template',
      }

      // i18n未正式发布，先放在项目底下引用
      webpackConfig.resolveLoader = {
        modules: ['node_modules', 'i18n-auto-loader-dev'],
      }

      // i18n auto loader 配套的 plugin
      webpackConfig.plugins.push(new I18nPlugin({
        replacerMap: {
          'vueScript': '$t_i18n',
        },
        writeFile: !!isDev,
      }))
    },
  },

  plugins: [
    '~/plugins/polyfill',
    '~/plugins/cookies',
    {src: '~/plugins/i18n'},
    {src: '~/plugins/axios'},
    {src: '~/plugins/ga', ssr: false},
    {src: '~/plugins/webp'},
    {src: '~/plugins/utils'},
    {src: '~/plugins/helpers'},
    {src: '~/plugins/modal', ssr: false},
    {src: '~/plugins/tips', ssr: false},
    {src: '~/plugins/vue-components'},
    {src: '~/plugins/sentry'},
    '~/plugins/filter',
    '~/plugins/vuex-action-debouncer',
  ],
}
