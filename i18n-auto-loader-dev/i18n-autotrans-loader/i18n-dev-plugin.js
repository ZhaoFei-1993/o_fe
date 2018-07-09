const fs = require('fs')
const path = require('path')
const chineseS2T = require('chinese-s2t')
const _ = require('lodash')

const sharedConfig = require('./shared-config')
const loader = require('./i18n-dev-loader')

function createFile(root, filename, callback) {
  const filePath = path.resolve(root, filename + '.json')

  let data
  try {
    data = fs.readFileSync(filePath)
  } catch (e) {
    fs.writeFileSync(filePath, '{}', {flag: 'wx'})
  }

  callback && callback(data || '{}')
}

/**
 * 递归地把老的content合并到新的，用以保留原有的翻译。同时把无用的文本给标记下
 * @param newContent {Object}
 * @param oldContent {Object}
 * @param isFirst {Boolean}     是第一次写locale到文件，不会标记废弃
 */
function mergeContent(newContent, oldContent, isFirst) {
  newContent = JSON.parse(JSON.stringify(newContent))

  for (const key in oldContent) {
    if (!oldContent.hasOwnProperty(key)) continue

    if (!newContent[key] && !isFirst) {
      // 新的不存在，说明被废弃，标注下
      if (key.indexOf(sharedConfig.deprecatedMark) > -1) {
        // 已经被废弃过，直接复制过来
        newContent[key] = oldContent[key]
      } else {
        newContent[key + sharedConfig.deprecatedMark] = oldContent[key]
      }
    } else if (typeof newContent[key] === 'object') {
      // value 是object，且不是global，则递归合并
      newContent[key] = mergeContent(newContent[key], oldContent[key])
    } else {
      // value 是 string，用已有的value代替新的value
      newContent[key] = oldContent[key]
    }
  }

  return newContent
}

/**
 * 按照key来将object进行排序
 * @param unordered
 * @return {string}
 */
function sortObject(unordered) {
  const ordered = {}
  Object.keys(unordered).sort((a, b) => {
    if (a === 'global' || a === 'i18n_autotrans_version') return -1
    if (b === 'global' || b === 'i18n_autotrans_version') return 1

    return a < b ? -1 : 1
  }).forEach(function (key) {
    if (typeof ordered[key] === 'object') {
      // ordered[key] = sortObject(unordered[key])  // 暂时不对页面里面的排序了
      ordered[key] = unordered[key]
    } else {
      ordered[key] = unordered[key]
    }
  })
  return ordered
}

/**
 * 输出i18n内容到文件中去
 * @param i18nRoot 文件目录
 * @param filename 文件名
 * @param content i18内容
 */
function writeContentToFile(i18nRoot, filename, content) {
  const filePath = path.resolve(i18nRoot, filename + '.json')
  fs.readFile(filePath, 'utf8', function (err, prevContent) {
    if (err) throw err

    const isFirst =  prevContent === '{}' || Object.keys(content).length === 2 // 这里很诡异的判断方式来判断是第一次写入

    try {
      content = mergeContent(content, JSON.parse(prevContent), isFirst)
    } catch (e) {
      return console.log(`parse failed when merge content ${filename}`)
    }

    content = sortObject(content)

    const contentString = JSON.stringify(content, null, 4)

    // 一定要先对比一下两者是否一样，不然会导致无限写磁盘
    if (contentString === prevContent) return

    fs.writeFile(filePath, contentString, 'utf8', err => err && console.log(err))
  })
}

/**
 * 递归地将简中翻译为繁体
 * @param simplified
 * @return {{}}
 */
function simplified2Traditional(simplified) {
  const traditional = {}
  for (const key in simplified) {
    if (!simplified.hasOwnProperty(key)) continue

    if (typeof simplified[key] === 'object') {
      traditional[key] = simplified2Traditional(simplified[key])
    } else {
      traditional[key] = chineseS2T.s2t(simplified[key])
    }
  }
  return traditional
}

function onCompilationComplete() {
  if (!sharedConfig.writeFile) return

  const content = loader.getContent()
  const filePath = path.resolve(sharedConfig.i18nRoot, sharedConfig.originalLang + '.json')

  fs.readFile(filePath, 'utf8', function (err, data) {
    if (err) throw err

    // 由于global不是自动生成的，而是手动填写的，因此先要把global给复制过来
    const diskOriginContent = JSON.parse(data)
    content.global = diskOriginContent.global || content.global

    writeContentToFile(sharedConfig.i18nRoot, sharedConfig.originalLang, content)

    if (sharedConfig.targetLangs && sharedConfig.targetLangs.length) {
      sharedConfig.targetLangs.forEach(lang => {
        if (lang === 'zh_Hant_HK') {
          const traditionalContent = simplified2Traditional(content)
          writeContentToFile(sharedConfig.i18nRoot, lang, traditionalContent)
        } else {
          writeContentToFile(sharedConfig.i18nRoot, lang, content)
        }
      })
    }
  })
}

module.exports = class I18nPlugin {
  constructor(config = {}) {
    _.merge(sharedConfig, config)

    this.config = sharedConfig

    if (!fs.existsSync(sharedConfig.i18nRoot)) {
      throw new Error(`i18n root path not exist: ${sharedConfig.i18nRoot}`)
    }

    createFile(sharedConfig.i18nRoot, sharedConfig.originalLang, function (data) {
      // const diskLocal = JSON.parse(data)
      // const extractedLocal = loader.getContent()
      // // 磁盘上已有locale的给同步过来
      // Object.assign(extractedLocal, diskLocal)
    })

    for (const name of sharedConfig.targetLangs) {
      createFile(sharedConfig.i18nRoot, name)
    }
  }
  apply(compiler) {
    if (compiler.hooks) {
      // webpack 4
      compiler.hooks.compilation.tap('i18n-auto-plugin', compilation => {
        compilation.hooks.seal.tap('i18n-auto-plugin', () => {
          onCompilationComplete()
        })
      })
    } else {
      // webpack < 4
      compiler.plugin('compilation', compilation => {
        compilation.plugin('seal', () => {
          onCompilationComplete()
        })
      })
    }
  }
}
