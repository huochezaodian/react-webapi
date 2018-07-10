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

// 查询api列表 by url
const queryApiListByUrl = function (params) {
  params = JSON.parse(params)
  let sql = `SELECT * FROM api_list WHERE url='${params.url}'`
  return query(sql)
}

// 查询api列表 by urls
const queryApiListByUrls = function (params) {
  params = JSON.parse(params)
  let urls = ""
  params.urls.split(',').forEach((url, idx) => {
    if (idx === 0) {
      urls = "'" + url + "'"
    } else {
      urls += ",'" + url + "'"
    }
  })
  let sql = "SELECT * FROM api_list WHERE url in (" + urls + ")"
  return query(sql)
}

// 添加api
const addApi = async function (params) {
  params = JSON.parse(params)
  let sql = `insert into api_list(url,name,des,type,data) values('${params.url}','${params.name}','${params.des}','${params.type}','${params.data}')`
  return query(sql)
}

// 修改api
const editApi = function (params) {
  params = JSON.parse(params)
  let sql = 'update api_list set '
  Object.keys(params).forEach(key => {
    if (key !== 'id') sql += `${key}='${params[key]}'`
  });
  sql += `where id=${params.id}`
  return query(sql)
}

// 删除api
const deleteApi = function (params) {
  params = JSON.parse(params)
  let sql = `delete from api_list where url='${params.url}'`
  return query(sql)
}

// 查询菜单列表
const queryMenusList = function () {
  let sql = 'SELECT * FROM `menu_level_1`'
  return query(sql)
}

// 查询菜单目录信息
const queryMenuInfo = function (params) {
  params = JSON.parse(params)
  let sql = `SELECT * FROM menu_level_1 WHERE id=${params.id}`
  return query(sql)
}

// 添加目录
const addDecorator = function (params) {
  params = JSON.parse(params)
  let sql = `insert into menu_level_1(name,des,child_id) values('${params.name}','${params.des}','')`
  return query(sql)
}

// 修改目录
const editDecorator = function (params) {
  params = JSON.parse(params)
  let sql = 'update menu_level_1 set '
  Object.keys(params).forEach(key => {
    if (key !== 'id') sql += `${key}='${params[key]}'`
  });
  sql += `where id=${params.id}`
  return query(sql)
}

// 删除目录
const deleteDecorator = function (params) {
  params = JSON.parse(params)
  let sql = `delete from menu_level_1 where id=${params.id}`
  return query(sql)
}

module.exports = {
  query,
  queryApiList,
  queryApiListByUrl,
  queryApiListByUrls,
  queryMenusList,
  addDecorator,
  editDecorator,
  deleteDecorator,
  queryMenuInfo,
  addApi,
  editApi,
  deleteApi
}
