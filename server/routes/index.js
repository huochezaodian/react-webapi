const api = require('./api')
const users = require('./users')
const page = require('./page')

const routes = [
  page,
  api,
  users
]

module.exports = routes
