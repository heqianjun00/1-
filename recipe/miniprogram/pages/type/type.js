import tables from '../../utils/tables' 
Page({

  /**
   * 页面的初始数据
   */
  data: {
    types:[]
  },
  onShow(){
    this.findType()
  },
  findType(){
    wx.cloud.callFunction({
      name:"findAll",
      data:{
        tables:tables.tables.typeTable,
        condition:{},
      }
    }).then(res=>{
      //console.log(res.result.data);
      this.setData({
        types:res.result.data
      })
    })
  },
  _goList(e){
    //console.log(e.currentTarget.dataset);
    //flag 1表示是导航栏菜谱进入list页面的，2表示热门菜谱进入list页面的，如果是其他表示搜索页面进入list页面的
    let {flag,id,typename} = e.currentTarget.dataset
    wx.navigateTo({
      url: '../list/list?flag='+flag+'&id='+id+'&typename='+typename,
    })
}
})