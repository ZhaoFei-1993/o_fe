module.exports = (req, res, next) => {
  // fake auth
  console.log(req.cookies)
  // 验证逻辑根据测试需要修改
  // if (!req.cookies || !req.cookies.token) {
  //   return res.sendStatus(401)
  // }
  if (req.url === '/verification' && req.method === 'GET') {
    return res.json({data: {}})
  }
  if (req.url === '/logout' && req.method === 'POST') {
    return res.json({data: {}})
  }
  // 转换成后端使用的数据结构
  const transformedData = {
    'code': (res.status >= 200 && res.status < 300) ? 0 : res.status,
    'message': 'OK',
    'data': res.data && res.data.length ? {
      total: res.headers['x-total-count'] || 1000,
      data: res.data,
    } : res.data,
  }
  res.data = transformedData
  req.query._page = req.query.page
  req.query._limit = req.query.limit
  req.query._start = req.query.start
  req.query._end = req.query.end
  return next()
}
