import tables from '../../utils/tables'
import api from '../../utils/api'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    lists:[],
    typename:''
  },
  onLoad(options){
    wx.setNavigationBarTitle({
      title: options.typename
    })
    this.data.typename = options.typename
    this._findrecipes(options.flag,options.id)
  },
  //查询菜单列表，这里要区分flag，如果flag是1，就按正常查询，如果是2，就用条件查询，其他就是搜索进入的
  async _findrecipes(flag,id){
    let condition = {}
    let orderBy = {}
    if(flag==1){
      condition = {
        status:1,
        recipeTypeid:id
      }
      orderBy={
        field:"_id",
        sort:"asc"
      }
    }else if(flag==2){
        condition={}
          orderBy={
            field:'views',
            sort:'desc'
          }
    }else{
      condition={
        recipename:api.db.RegExp({
          regexp: this.data.typename,
          options: 'i',
        })
      }
      orderBy={
        field:"_id",
        sort:"asc"
      }
    }
    let res = await wx.cloud.callFunction({
      name:"findAll",
      data:{
        tables:tables.tables.recipeTable,
        condition,
        orderBy
      }
    })
    let allPromise = []
    res.result.data.map(item=>{
        let condition={
            _openid:item._openid,
        }
       let promise = api._search(tables.tables.userTable,condition)
       allPromise.push(promise)
    })
    let allUsers = await Promise.all(allPromise)
    //console.log(allUsers);
    res.result.data.forEach((item,index)=>{
        item.userInfo = allUsers[index].data[0].userInfo
    })
     this.setData({
        lists:res.result.data
    })
  },
   //跳转到详情页面
   _goDetail(e){
    let {id,recipename,username,userimg} = e.currentTarget.dataset
    wx.navigateTo({
      url: '../detail/detail?id='+id+'&recipename='+recipename+'&username='+username+'&userimg='+userimg,
    })
}
 
})