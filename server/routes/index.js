const api = require('./api')
const users = require('./users')
const router = require('koa-router')()

router.get('/', (ctx) => {
  console.log(1);
  ctx.render('build/index.html', {})
})

const routes = [
  router,
  api,
  users
]

module.exports = routes
