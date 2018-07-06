const router = require('koa-router')()

router.prefix('/api')

router.post('/list', async function (ctx) {
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

  ctx.body = res;
})

router.post('/add', async function (ctx) {
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

router.get('/menus', async function (ctx) {
  let res = {};
  await ctx.mysql.queryMenusList().then(menus => {
    menus.map(menu => {
      let children = []
      menu.child_id && menu.child_id.split(',').map(async childId => {
        await ctx.mysql.queryApiListById(childId).then(list => {
          children.push(list)
        })
      })
      menu.children = children
    })
    res = {
      errorCode: 0,
      data: menus
    }
  }).catch(err => {
    res = {
      errorCode: 99,
      errorMessage: err.message || 'error'
    }
  })

  ctx.body = res
})

router.post('/add/decorator', async function (ctx) {
  let res = {};
  await ctx.mysql.addDecorator(ctx.request.body).then(data => {
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
