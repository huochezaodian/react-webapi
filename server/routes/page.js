const router = require('koa-router')()

router.get('/', (ctx) => {
  ctx.render('build/index.html', {})
})

module.exports = router
