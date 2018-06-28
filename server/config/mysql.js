const Client = require('mysql-pro')

const client  = new Client({
  mysql: {
    host     : 'localhost',
    user     : 'root',
    password : '123456',
    database : 'webapi',
    port     : '3306'
  }
});

const query = async function (sql, values = []) {
  let result = await client.query(sql, values)
  return result
}

const apiList =
  `create table if not exists api_list(
  id int auto_increment primary key,
  url varchar(100),
  title varchar(100)
  );`

const menuLevel = function (name) {
  return `create table if not exists ${name}(
  id int auto_increment primary key,
  name varchar(100),
  child_id varchar(100)
  );`
}


const createTable = function( sql ) {
  return new Promise((res, rej) => {
    query( sql ).then(data => {
      res(data)
    }).catch(err => {
      rej(err)
    })
  })
}

// 建表
createTable(apiList)
createTable(menuLevel('menu_level_1'))

// 查询api列表
const queryApiList = function(values = []){
  let sql = 'SELECT * FROM `api_list`'
  return query(sql, values)
}

const addApi = async function (values) {
  let sql = ''
}

module.exports = {
  query,
  queryApiList
}
