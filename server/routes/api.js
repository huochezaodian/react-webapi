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

router.get('/menus', async function (ctx) {
  let res = {};
  let data = null;
  await ctx.mysql.queryMenusList().then(menus => {
    data = menus
  }).catch(err => {
    res = {
      errorCode: 99,
      errorMessage: err.message || 'error'
    }
  })
  if ( res.errorCode === undefined ) {
    let promises = data.map((menu, idx) => {
      return new Promise((res, rej) => {
        let children = []
        menu.child_id && ctx.mysql.queryApiListByUrls(JSON.stringify({urls: menu.child_id})).then(list => {
          children = [...list]
          data[idx].children = children
          res()
        }).catch(err => {
          rej(err)
        })
      })
    })
    await Promise.all(promises).catch(err => {
      res = {
        errorCode: 99,
        errorMessage: err.message || 'error'
      }
    })
  }
  if (res.errorCode === undefined) {
    res = {
      errorCode: 0,
      data
    }
  }
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

router.post('/edit/decorator', async function (ctx) {
  let res = {};
  await ctx.mysql.editDecorator(ctx.request.body).then(data => {
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

router.post('/menu/info', async function (ctx) {
  let res = {};
  await ctx.mysql.queryMenuInfo(ctx.request.body).then(data => {
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

router.post('/add/api', async function (ctx) {
  let res = {};
  let params = JSON.parse(ctx.request.body)
  await ctx.mysql.queryMenuInfo(JSON.stringify({id: params.parentId})).then(async data => {
    if (data.length > 0) {
      let childId = data[0].child_id === '' ? [] : data[0].child_id.split(',')
      if (childId.includes(params.url)) {
        res = {
          errorCode: 2,
          errorMessage: '此接口已经存在'
        }
      } else {
        childId.push(params.url)
        let newChildId = childId.join(',')
        await ctx.mysql.editDecorator(JSON.stringify({id: params.parentId, child_id: newChildId}))
      }
    } else {
      res = {
        errorCode: 1,
        errorMessage: '未查询到目录信息'
      }
    }
  }).catch(err => {
    res = {
      errorCode: 99,
      errorMessage: err.message || 'error'
    }
  })
  if (res.errorCode === undefined) {
    await ctx.mysql.addApi(ctx.request.body).then(data => {
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
  }
  ctx.body = res
})

router.post('/edit/api', async function (ctx) {
  let res = {};
  await ctx.mysql.editApi(ctx.request.body).then(data => {
    res = {
      errorCode: 0,
      data
    }
  }).catch(err => {
    res = {
      errorCode: 99,
      errorMessage: err.message || 'error'
    }
  })

  ctx.body = res
})

router.post('/api/info', async function (ctx) {
  let res = {};
  await ctx.mysql.queryApiListByUrl(ctx.request.body).then(data => {
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

module.exports = router
