//封装增删改查的方法

//初始化数据库
const db = wx.cloud.database()

//添加
const _add = (table,data)=>{
  return db.collection(table).add({data})
}
//删除
const _delete = (table,condition)=>{
  return db.collection(table).where(condition).remove()
}
//修改
const _edit = (table,condition,data)=>{
  return db.collection(table).where(condition).update({data})
}
//查询
const _search = (table,condition)=>{
  return db.collection(table).where(condition).get()
}
//查询单条数据
const _searchOne = (table,id)=>{
  return db.collection(table).doc(id).get()
}
//分页查询
const _searchPage = (table,num1,num2)=>{
  return db.collection(table).limit(num1).skip(num2).get()
}
export default {
  _add,_delete,_edit,_search,_searchPage,db,_searchOne
}