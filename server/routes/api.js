const router = require('koa-router')()

router.prefix('/api')

router.post('/list', async function (ctx, next) {
  let res = {};
  await ctx.mysql.queryApiList().then(data => {
    res = {
      errorCode: 0,
      data: data
    }
  }).catch(err => {
    res = {
      errorCode: 99,
      errorMessage: err.message || 'error'
    }
  })

  ctx.body = res
})

router.post('/add', async function (ctx, next) {
  let res = {};
  await ctx.mysql.queryApiList().then(data => {
    res = {
      errorCode: 0,
      data: data
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
