import api from '../../utils/api'
import tables from '../../utils/tables'

//定义一个adminId，用于判断是否是管理员登录，如果是管理员登录，点击头像可以跳转到category页面
const adminId = "oFuVe5ISO_vuERzzUC0BjmTZj1jk"
Page({

  /**
   * 页面的初始数据
   */
  data: {

    isLogin: false, //是否登录。 false 未登录  true，已经登录
    userInfo:[], //存放用户信息
    isadmin:false, //判断是否是管理员登录
    recipes: [{
        id: "1",
        recipeName: "烤苏格兰蛋",
        src: "../../imgs/1.jpg",
        opacity: 0, //遮罩层默认不显示
      },
      {
        id: "2",
        recipeName: "法国甜点",
        src: "../../imgs/2.jpg",
        opacity: 0, //遮罩层默认不显示
      },
      {
        id: "3",
        recipeName: "法式蓝带芝心猪排",
        src: "../../imgs/3.jpg",
        opacity: 0, //遮罩层默认不显示
      },
      {
        id: "4",
        recipeName: "菠萝煎牛肉扒",
        src: "../../imgs/4.jpg",
        opacity: 0, //遮罩层默认不显示
      },
      {
        id: "5",
        recipeName: "快手营养三明治",
        src: "../../imgs/5.jpg",
        opacity: 0, //遮罩层默认不显示
      },
      {
        id: "6",
        recipeName: "顶级菲力牛排",
        src: "../../imgs/6.jpg",
        opacity: 0, //遮罩层默认不显示
      }
    ],
    types: [{
        typename: "营养菜谱",
        'src': "../../static/type/type01.jpg"
      },
      {
        typename: "儿童菜谱",
        'src': "../../static/type/type02.jpg"
      },
      {
        typename: "家常菜谱",
        'src': "../../static/type/type03.jpg"
      },
      {
        typename: "主食菜谱",
        'src': "../../static/type/type04.jpg"
      },
      {
        typename: "西餐菜谱",
        'src': "../../static/type/type05.jpg"
      },
      {
        typename: "早餐菜谱",
        'src': "../../static/type/type06.jpg"
      },
    ],
    lists: [{
        src: "../../static/list/list01.jpg",
        name: "土豆小番茄披萨",
        userInfo: {
          nickName: "林总小图",
          pic: "../../static/list/users.png"
        },
        views: 999,
        follow: 100
      },
      {
        src: "../../static/list/list02.jpg",
        name: "草莓巧克力三明治",
        userInfo: {
          nickName: "林总小图",
          pic: "../../static/list/users.png"
        },
        views: 88,
        follow: 200
      },
      {
        src: "../../static/list/list03.jpg",
        name: "法师意大利面",
        userInfo: {
          nickName: "林总小图",
          pic: "../../static/list/users.png"
        },
        views: 999,
        follow: 100
      },
      {
        src: "../../static/list/list04.jpg",
        name: "自制拉花",
        userInfo: {
          nickName: "林总小图",
          pic: "../../static/list/users.png"
        },
        views: 999,
        follow: 100
      },
      {
        src: "../../static/list/list05.jpg",
        name: "营养早餐",
        userInfo: {
          nickName: "林总小图",
          pic: "../../static/list/users.png"
        },
        views: 999,
        follow: 100
      }
    ],
    activeIndex:0,
    followRecipes:[]
  },
  onLoad(){
    let isLogin = wx.getStorageSync('isLogin')
    let userInfo = wx.getStorageSync('userInfo')
    let isadmin = wx.getStorageSync('isadmin')
    this.setData({
      isLogin,
      userInfo,
      isadmin
    })
   
  },
  onShow(){
    this._findSelfRecipes()
    this._getFollowsId()
  },
  // 处理遮罩层显示问题
  _delStyle(e) {
    // 获取索引
    let index = e.currentTarget.dataset.index;
    // 将所有的列表都设置不显示
    this.data.recipes.map((item) => {
      item.opacity = 0;
    })
    // 将长按的列表项设置为选中
    this.data.recipes[index].opacity = 1;
    this.setData({
      recipes: this.data.recipes
    })
    
  },
  // 执行删除操作
  _doDelete(e){
    let that =this
    let index = e.currentTarget.dataset.index;
    // 如果没有显示删除图标，点击删除，直接返回
    if(!this.data.recipes[index].opacity)return;
    let _this = this;
    wx.showModal({
       title:"删除提示",
       content:"您确定删除么？",
       success(res){
            if(res.confirm){
              //执行删除
              console.log(e)
              //这里的删除实际上是没有删除数据库的数据，只是修改了数据库status字段的值，1表示正常，0表示删除
              let condition ={
                _id:e.currentTarget.dataset.id
              }
              let data={
                status:0
              }
              api._edit(tables.tables.recipeTable,condition,data).then(res=>{
                that._findSelfRecipes()
              })
            }else{
              //取消删除
              _this.data.recipes[index].opacity = 0;
              _this.setData({
                recipes: _this.data.recipes
              })
            }
       }
    })
  },

  //登录
  _doLogin(){
    wx.getUserProfile({desc:'获取用户信息'}).then(res=>{
      this.setData({
        isLogin:true,
        userInfo:res.userInfo
      })
      wx.showToast({
        title: '欢迎登录',
      })
      wx.setStorageSync('isLogin', true)
      wx.setStorageSync('userInfo', res.userInfo)
      //将用户信息存储到数据库
    /*   
    这个添加的函数进行了封装
    db.collection("A-userInfo").add({
        data:{
          userInfo:res.userInfo
        }
      }) */
      let data = {
        userInfo:res.userInfo
      }
      api._add(tables.tables.userTable,data)
      //调用login云函数将openid存入缓存
      wx.cloud.callFunction({
        name:"login"
      }).then(res=>{
        wx.setStorageSync('openid', res.result.openid)
        let isadmin = adminId==res.result.openid?true:false
        this.setData({
          isadmin
        })
        //将isadmin存入缓存,用于再管理员登录的情况下，防止重新编译页面，就不能点击头像跳转
        wx.setStorageSync('isadmin', isadmin)
      })

    })
      
  },
  //是管路员登录，可以点击头像跳转到category页面
  _goCategory(){
    if(this.data.isadmin){
      wx.navigateTo({
        url: '../category/category',
      })
    }
  },

  //跳转到pbrecipe页面
  _goPbrecipe(){
    wx.navigateTo({
      url: '../../pages/pbrecipe/pbrecipe',
    })
  },
  //菜单，分类，关注  切换
  toggle(e){
    this.setData({
      activeIndex:e.currentTarget.dataset.index
    })
    this._findSelfRecipes()
    this.findType()
    
  },
  //查询自己发布的菜单
  _findSelfRecipes(){
    wx.cloud.callFunction({
      name:"findAll",
      data:{
        tables:tables.tables.recipeTable,
        condition:{_openid:wx.getStorageSync('openid'),status:1},
        orderBy:{field:"time",sort:"desc"}
      }
    }).then(res=>{
      this.setData({
        recipes:res.result.data
      })
       // 将所有的列表都设置不显示
      this.data.recipes.map((item) => {
      item.opacity = 0;
      })
      this.setData({
        recipes: this.data.recipes
      })
    })
  },
  //查询菜谱分类
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
},
//获取关注的菜谱的id
async _getFollowsId(){
  let condition = {
    _openid:wx.getStorageSync('openid')
  }
  let res = await api._search(tables.tables.followsTable,condition)
  //console.log(res.data);
 // this.data.followRecipes
 let arr=[]
  res.data.map(item=>{
   let res =  this._findRecipes(item.recipeid)
  arr.push(res)
  })
  let follow = await Promise.all(arr)
  //console.log(follow);
  let arr1=[]
  follow.map(item=>{
    let condition={
        _openid:item.result.data[0]._openid,
    }
   let promise = api._search(tables.tables.userTable,condition)
   arr1.push(promise)
   //console.log(promise);
   //allPromise.push(promise)
})
let follow1 = await Promise.all(arr1)
console.log(follow1);
follow.map((item,index)=>{
  item.result.data[0].userInfo = follow1[index].data[0].userInfo
})
console.log(follow);
this.setData({
  followRecipes:follow
}) 
 //this._findRecipes(res.data[0].recipeid)
  },
  //根据菜谱id查出菜谱
  async _findRecipes(val){
   // let promise = 
    return wx.cloud.callFunction({
         name:"findAll",
         data:{
             tables:tables.tables.recipeTable,
             condition:{
              _id:val
              }
         }
     })  
 },
   //关注菜谱跳转到详情页面
   _goDetail(e){
    let {id,recipename,username,userimg} = e.currentTarget.dataset
    wx.navigateTo({
      url: '../detail/detail?id='+id+'&recipename='+recipename+'&username='+username+'&userimg='+userimg,
    })
}
})