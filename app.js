process.SERVER_BUILD = true
const Koa = require('koa')
const Nuxt = require('nuxt').Nuxt
const Builder = require('nuxt').Builder
const koaRouter = require('koa-router')()
const config = require('./nuxt.config.js')
const route = require('./routes/index')
const mount = require('koa-mount')
const serve = require('koa-static')
const compress = require('koa-compress')
const path = require('path')
const staticCache = require('./server/staticCache')    // todo: read

const app = new Koa()
const isApiDev = app.env === 'api-dev'
const isPm2Dev = app.env === 'pm2-dev'

config.dev = !(app.env === 'production')

if (isApiDev || isPm2Dev) {
  // 强制false
  config.dev = false
}

const nuxt = new Nuxt(config)

// Build only in dev mode
if (config.dev) {
  if (!isApiDev && !isPm2Dev) {
    // API调试模式下，不build
    const builder = new Builder(nuxt)
    builder.build().catch((error) => {
      console.error(error) // eslint-disable-line no-console
      process.exit(1)
    })
  }
}

// http路由
route(app, koaRouter)
app.use(koaRouter.routes())
// 缓存
if (!config.dev) {
  // gzip
  app.use(compress({
    filter: function (contentType) {
      return /js|css|jpe?g|png|gif|apk|svg/i.test(contentType)
    },
    threshold: 2048,
    flush: require('zlib').Z_SYNC_FLUSH,
  }))
  // cdn回源
  // todo: 有用到？
  app.use(mount('/static', serve('./.nuxt/dist', {maxage: 24 * 60 * 60 * 7 * 1000, gzip: true})))

  app.use(staticCache(path.join(__dirname, 'static'), {
    maxAge: 24 * 60 * 60 * 7,
    filter: ['js', 'css', 'jpg', 'png', 'apk', 'svg'],
  }))
}

app.use(async function (ctx, next) {
  ctx.status = 200 // koa defaults to 404 when it sees that status is unset

  return new Promise((resolve, reject) => {
    ctx.res.on('close', resolve)
    ctx.res.on('finish', resolve)
    nuxt.render(ctx.req, ctx.res, promise => {
      // nuxt.render passes a rejected promise into callback on error.
      promise.then(resolve).catch(reject)
    })
  })
})

// for graceful reload
// process.on('SIGINT', function() {
//    db.stop(function(err) {
//      process.exit(err ? 1 : 0);
//    });
// });

app.listen(3006, '0.0.0.0', () => {
  console.info(`Server listening on 0.0.0.0:3006`)
})
