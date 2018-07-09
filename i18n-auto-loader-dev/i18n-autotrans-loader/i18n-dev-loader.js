const path = require('path')
const loaderUtils = require('loader-utils')
const esprima = require('esprima')
const estraverse = require('estraverse')
const escodegen = require('escodegen')
const md5 = require('blueimp-md5')
const sharedConfig = require('./shared-config')

const extractedLocale = {
  i18n_autotrans_version: 3,
  global: {},
}

const I18N_ANNOTATION_REGEX = /@i18n\s+([^\s*]+)/

function getTextKey(text, hashLength = sharedConfig.hashLength) {
  let textKey = text.replace(/[\s\r\n]/g, '').slice(0, 8)
  textKey = textKey.replace(/\./g, '_')       // 由于我们使用 '.' 作为索引的分隔符，所以key里面不能出现 '.'

  //  八个首字符+hash
  return text.length > 8 ? `${textKey}_${md5(text).slice(0, hashLength)}` : textKey
}

const textAstCache = {

}

// 把html最终转化为如下形式，最后esprima解析出想要的节点
// '<div title="中国">公告板</div>'
//              ↓
// html = `'<div ' + _vm._ssrAttr("title", "中国" + '>' + '公告板' + '</div>'`
function parseHtml(html) {
  // todo:换成配置里面的正则
  const textArr = html.match(/(^|>)([^>]*?[\u4e00-\u9fa5][^<]*?)</g)
  const attrArr = html.match(/([\d\w]+?)="([^"]*?[\u4e00-\u9fa5][^"]*?)"/g)

  textArr && textArr
    .map(text => text.replace(/^>/, '').replace(/<$/, ''))    // 匹配的前后带尖括号，需要去掉
    .forEach(text => {
      html = html.replace(text, `' + '${text}' + '`)
    })

  attrArr && attrArr
    .map(attr => {
      const [name, value] = attr.split('=')

      return {
        name,
        value: value.replace(/^"/, '').replace(/"$/, ''), // 匹配的形如 nam
      }
    })
    .forEach(attr => {
      html = html.replace(`${attr.name}="${attr.value}"`, `' + _vm._ssrAttr("${attr.name}", "${attr.value}") + '`)
    })

  return esprima.parseScript(`temp = '${html}'`).body[0].expression.right
}

function replaceAst(ast, replacer, filenameKey, fileMap) {
  const wrappedReplacerAst = esprima.parseScript(`temp = ${replacer}("__replacerPlaceholder__")`)
  const replacerAst = wrappedReplacerAst.body[0].expression.right
  const replacement = JSON.stringify(replacerAst)

  return estraverse.replace(ast, {
    leave: function (node) {
      const nodeValue = node.value

      if (node.type === 'Literal' && typeof nodeValue === 'string') {
        // 以global开头的就不管了，说明是手动调用
        if (nodeValue.match(sharedConfig.regexp) && nodeValue.indexOf('global.') === -1) {
          const text = nodeValue.trim().replace(/\s+/g, ' ')

          try {
            const textKey = getTextKey(text)
            const textIndex = `${filenameKey}.${textKey}`
            const cacheKey = `${textIndex}.${replacer}`

            if (textAstCache[cacheKey]) {
              fileMap[textKey] = text
              return textAstCache[cacheKey]
            } else {
              let textReplacedAst
              // 对于vue ssr，只有在html 标签特别纯粹的情况下，会出现文本里面有完整html标签的情况，所以这种时候需要特殊处理
              if (text.indexOf('<') > -1 && text.indexOf('>') > -1) {
                const htmlReplacerAst = parseHtml(text)

                // 如果直接解析出来是个字面量，就不再递归了（比如 <位置> 这种就会解析出字面量）
                if (htmlReplacerAst.type === 'Literal') {
                  fileMap[textKey] = text
                  textAstCache[cacheKey] = htmlReplacerAst

                  return htmlReplacerAst
                } else {
                  return replaceAst(htmlReplacerAst, replacer, filenameKey, fileMap)
                }
              } else {
                fileMap[textKey] = text
                textReplacedAst = JSON.parse(replacement.replace(/__replacerPlaceholder__/g, textIndex))
                textAstCache[cacheKey] = textReplacedAst

                return textReplacedAst
              }
            }
          } catch (e) {
            console.log(`Error: parse i18n error, ignore ${text}`)
          }
        }
      }
    },
  })
}

function replaceText(source, replacer, filenameKey, fileMap) {
  const ast = esprima.parseModule(source, {
    // comment: true
  })

  // ast = escodegen.attachComments(ast, ast.comments)

  const transformedAst = replaceAst(ast, replacer, filenameKey, fileMap)

  source = escodegen.generate(transformedAst, {
    format: {
    },
    // comment: true
  })

  return {
    source,
    fileMap,
  }
}

function getFileNameKey(resourcePath) {
  // 不在src里面的都不管
  if (resourcePath.match(sharedConfig.exclude)) return ''

  const relativePath = resourcePath.replace(path.resolve('.') + '/', '')

  return relativePath.replace('.', '_').split('/').join('_')
}

function decideReplacer(resourcePath, query, source) {
  let fileType = ''
  // 先看文件默认的
  if (resourcePath.match(/\.vue$/)) {
    if (query.SFC === 'template' || (source.match(/_vm\.\$createElement/) && source.match(/staticRenderFns/))) {
      fileType = 'vueTemplate'
    } else if (query.SFC === 'script') {
      fileType = 'vueScript'
    }
  }
  let replacer = sharedConfig.replacerMap[fileType]

  // 再看query里面的
  replacer = query.replacer || replacer

  // 最后看文件里面的
  const replacerMatches = source.match(I18N_ANNOTATION_REGEX)
  if (replacerMatches) {
    replacer = replacerMatches[1]
  }

  return replacer
}

module.exports = function (source, map) {
  this.cacheable && this.cacheable()

  const filenameKey = getFileNameKey(this.resourcePath)

  if (!filenameKey) return this.callback(null, source, map)

  const urlQuery = this.resourceQuery ? loaderUtils.parseQuery(this.resourceQuery) : null
  const query = Object.assign({}, loaderUtils.getOptions(this), urlQuery)     // todo:这里是哪里的options？

  const i18nReplacer = decideReplacer(this.resourcePath, query, source)

  // 如果没有匹配到replacer，或者replacer是 'off', 则退出
  if (!i18nReplacer || i18nReplacer === 'off') return this.callback(null, source, map)

  // 预先判断下有没有相关文本，减少解析ast的时间
  if (!source.match(sharedConfig.regexp)) return this.callback(null, source, map)

  const fileMap = extractedLocale[filenameKey] || {}
  const result = replaceText(source, i18nReplacer, filenameKey, fileMap)

  extractedLocale[filenameKey] = result.fileMap

  source = result.source

  this.callback(null, source)    // 最后返回的时候不返回sourcemap，因为我们没有处理sourcemap，所以如果直接返回的话会出错。
}

// 暴露出获取数据的接口
module.exports.getContent = () => extractedLocale
