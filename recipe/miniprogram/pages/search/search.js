import api from '../../utils/api'
import tables from '../../utils/tables'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    typename:"", //输入框数据
    searchHistory:[], //搜索历史
    hotSearch:[],//热门搜索
  },
onLoad(){
  this._gethotRecipecs()
},
onShow(){
  this._getSearchHistory()
  
},
  _goList(e){
   if(this.data.typename != ''){
    //console.log(e.currentTarget.dataset);
    //flag 1表示是导航栏菜谱进入list页面的，2表示热门菜谱进入list页面的，如果是其他表示搜索页面进入list页面的
    let {flag,id,typename} = e.currentTarget.dataset
    wx.navigateTo({
      url: '../list/list?flag='+flag+'&id='+id+'&typename='+typename,
    }) 
    //将输入搜索的记录存到缓存中
    let searchHistory =  []
    searchHistory = wx.getStorageSync('searchHistory') || []
    //如果该条搜索记录缓存中已存在，就不存
    if(!searchHistory.includes(typename)){
      searchHistory.unshift(typename)
    }
    wx.setStorageSync('searchHistory',searchHistory)
    //清空输入框
    this.setData({
      typename:""
    })
   } else{
     return false
   }
  },
  //将缓存中的搜索记录显示在页面，最多显示9条
  _getSearchHistory(){
    this.setData({
      searchHistory : wx.getStorageSync('searchHistory').splice(0,9) || ""//用splice方法截取数组
    })
    //console.log(this.data.searchHistory);
  },
  //长按删除该条记录
  _deletHistory(e){
    //删除视图的记录
    let index = e.currentTarget.dataset.index
    this.data.searchHistory.splice(index,1)
    this.setData({
      searchHistory:this.data.searchHistory
    })
    //删除缓存的记录，就是将新的searchHistory存入缓存，替换原来的缓存
    wx.setStorageSync('searchHistory',this.data.searchHistory)
  },
  //清空所有搜索记录
  _deletAll(){
      this.setData({
        searchHistory:''
      })
      wx.removeStorageSync('searchHistory')
  },
  //点击将这条搜索记录赋值到搜索框
  _searchInp(e){
     let index = e.currentTarget.dataset.index
      this.setData({
        typename:this.data.searchHistory[index]
      })
  },
  //获取热门搜索。其实就是获取热门菜谱
  async _gethotRecipecs(){
    let promise = wx.cloud.callFunction({
      name:"findAll",
      data:{
          tables:tables.tables.recipeTable,
          condition:{status:1},
          orderBy:{field:"views",sort:"desc"}
      }
  })
  let res = await promise
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
    hotSearch:res.result.data
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