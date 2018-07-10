const router = require('koa-router')()

router.prefix('/apitest')

router.all('/:api', async function (ctx) {
  let res = {}
  let url = '/' + ctx.params.api
  let method = ctx.method
  console.log(url)
  await ctx.mysql.queryApiListByUrl(JSON.stringify({url})).then(data => {
    if (data.length === 0) {
      res = {
        errorCode: 4,
        errorMessage: '未查询到此api的信息'
      }
    } else {
      if (data[0].type.split(',').includes(method.toLowerCase())) {
        res = {
          errorCode: 0,
          data: JSON.parse(data[0].data)
        }
      } else {
        res = {
          errorCode: 3,
          errorMessage: '此api不支持' + method + '请求'
        }
      }
    }
  }).catch(err => {
    res = {
      errorCode: 99,
      errorMessage: err.message || 'error'
    }
  })

  ctx.body = res
})

module.exports = router
