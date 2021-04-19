import api from "../../utils/api"
import tables from "../../utils/tables"

Page({
  data:{
    addval:'',
    //设置一个数组存放图片地址，在用户添加菜谱分类时，随机选
    //一张图片作为菜谱的图标
    imgSrc:[
      "../../static/type/type01.jpg",
      "../../static/type/type02.jpg",
      "../../static/type/type03.jpg",
      "../../static/type/type04.jpg",
      "../../static/type/type05.jpg",
      "../../static/type/type06.jpg"
    ],
    findAll:"", //数据库中A-type表所有的数据
    typename:"", //菜谱名称
    id:"", //菜谱的id
  },
  onShow(){
    this._findAll()
  },
 async _doAdd(){
    let index = Math.floor(Math.random()*6)
    let cateData={
      typename:this.data.addval,
      imgSrc:this.data.imgSrc[index]
    }
    //将添加的菜谱存到数据库
   let res = await api._add(tables.tables.typeTable,cateData)
   if(res._id){
     wx.showToast({
       title: '添加成功',
     })
     this.setData({
      addval:""
     })
   }
   this._findAll()
  
  },
   //查询数据库中A-type的所有数据
_findAll:function(){
  wx.cloud.callFunction({
       name:"findAll",
       data:{
        tables:tables.tables.typeTable,
        condition:{_openid:"oFuVe5ISO_vuERzzUC0BjmTZj1jk"}
       }
     }).then(res=>{
      // console.log(res.result.data);
       this.setData({
         findAll:res.result.data
       })
     })
   },
   //删除
   _doDelete(e){
     let _id = e.currentTarget.dataset.id
     let _openid = wx.getStorageSync('openid')
     //condition 条件
     let condition={
      _id,
      _openid
     }
     api._delete(tables.tables.typeTable,condition).then(res=>{
       if(res.stats.removed == 1){
         wx.showToast({
           title: '删除成功',
         })
       }
     })
     this._findAll()
   },
   //去修改按钮，不是真正的修改
   _goEdit(e){
     this.setData({
       typename:e.currentTarget.dataset.typename,
       id:e.currentTarget.dataset.id
     })
   },
   //修改菜谱
   _doEdit(){
     let _openid = wx.getStorageSync('openid')
     let condition = {
       _id:this.data.id,
       _openid
     }
     let data = {
       typename:this.data.typename
     }
     api._edit(tables.tables.typeTable,condition,data).then(res=>{
       if(res.stats.updated == 1){
         wx.showToast({
           title: '修改成功',
         })
         this.setData({
           typename:""
         })
       }
     })
     this._findAll()
   }
})