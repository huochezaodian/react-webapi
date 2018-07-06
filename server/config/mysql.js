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

const query = async function (sql) {
  let result = await client.query(sql)
  return result
}

const apiList =
  `create table if not exists api_list(
  id INT NOT NULL AUTO_INCREMENT,
  url VARCHAR(100) NOT NULL,
  name VARCHAR(100) NOT NULL,
  des VARCHAR(100) NOT NULL,
  type VARCHAR(100) NOT NULL,
  data VARCHAR(20000) NOT NULL,
  PRIMARY KEY ( id )
  );`

const menuLevel = function (name) {
  return `create table if not exists ${name}(
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  des VARCHAR(100) NOT NULL,
  child_id VARCHAR(100) NOT NULL,
  PRIMARY KEY ( id )
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
const queryApiList = function () {
  let sql = 'SELECT * FROM `api_list`'
  return query(sql)
}

// 查询api列表 by id
const queryApiListById = function (id) {
  let sql = `SELECT * FROM api_list WHERE id=${id}`
  return query(sql)
}

// 查询菜单列表
const queryMenusList = function () {
  let sql = 'SELECT * FROM `menu_level_1`'
  return query(sql)
}

// 添加目录
const addDecorator = function (params) {
  params = JSON.parse(params)
  let sql = `insert into menu_level_1(name,des,child_id) values('${params.name}','${params.des}','')`
  console.log(sql)
  return query(sql)
}

module.exports = {
  query,
  queryApiList,
  queryApiListById,
  queryMenusList,
  addDecorator
}
